import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/paypal';
import { OrdersController, ApiError, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';
import { getResponseBody } from '@/lib/utils';
const ordersController = new OrdersController(client);

type Cart = {
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { cart }: {cart: [Cart]} = req;
  
    const orderRequest = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: cart[0].quantity.toString(),
            },
            customId: "bot"
          }
        ],
      },
      prefer: 'return=minimal',
    };
    
    const response = await ordersController.ordersCreate(orderRequest);
    const responseBody: string = await getResponseBody(response);
    const jsonResponse = JSON.parse(responseBody);
    return NextResponse.json(jsonResponse, { status: response.statusCode });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('PayPal API Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
  }
}
