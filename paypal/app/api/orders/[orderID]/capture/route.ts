import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/paypal';
import { OrdersController, ApiError} from '@paypal/paypal-server-sdk';
import { getResponseBody } from '@/lib/utils';

const ordersController = new OrdersController(client);

export async function POST(request: NextRequest, { params }: { params: { orderID: string } }) {
  const { orderID } = params;

  console.log("capture order called");
  try {
    const captureRequest = {
      id: orderID,
      prefer: 'return=minimal',
    };

    const response = await ordersController.ordersCapture(captureRequest);
    const responseBody = await getResponseBody(response);
    const jsonResponse = JSON.parse(responseBody);

    return NextResponse.json(jsonResponse, { status: response.statusCode });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('PayPal API Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'Failed to capture order.' }, { status: 500 });
  }
}
