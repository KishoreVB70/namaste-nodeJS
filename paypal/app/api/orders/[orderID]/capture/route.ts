import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/paypal';
import { OrdersController, ApiError} from '@paypal/paypal-server-sdk';
import { getResponseBody } from '@/lib/utils';
import { TransactionDetails } from '@/lib/types';
import { sBaseAddTransaction, sBaseUpdateBalance } from '@/lib/supabase';

const ordersController = new OrdersController(client);

export async function POST(req: NextRequest, { params }: { params: { orderID: string } }) {
  const {orderID }= params;
  console.log("Order ID: ", orderID);

  if(!orderID) {
    return NextResponse.json({ error: "Order ID" }, { status: 400 });
  }
  try {
    const captureRequest = {
      id: orderID,
      prefer: 'return=minimal',
    };

    const response = await ordersController.ordersCapture(captureRequest);
    const responseBody = await getResponseBody(response);
    const orderData = JSON.parse(responseBody);

    const errorDetail = orderData?.details?.[0];

    if(!errorDetail) {
      const amountVal = orderData.purchase_units[0].payments.captures[0].amount.value as string;
      const amount = parseInt(amountVal);
      const address = orderData.purchase_units[0].payments.captures[0].custom_id as string;
      await sBaseUpdateBalance(amount, address)
      const transactionDetails: TransactionDetails = {
        amount,
        "mode": "paypal",
        "type": "credit"
      }
      await sBaseAddTransaction(transactionDetails,address);
    }

    return NextResponse.json(orderData, { status: response.statusCode });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('PayPal API Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'Failed to capture order.' }, { status: 500 });
  }
}
