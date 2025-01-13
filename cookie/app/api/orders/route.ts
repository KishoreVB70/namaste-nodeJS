import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/paypal';
import { OrdersController, ApiError, CheckoutPaymentIntent, ApiResponse, Order } from '@paypal/paypal-server-sdk';

const ordersController = new OrdersController(client);

type Cart = {
    quantity: number
}

async function getResponseBody(response: ApiResponse<Order>): Promise<string> {
  if (typeof response.body === 'string') {
    return response.body;
  } else if (response.body instanceof Blob) {
    return await response.body.text();
  } else if (response.body instanceof ReadableStream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        result += decoder.decode(value, { stream: !done });
      }
    }
    return result;
  } else {
    throw new Error('Unsupported response body type');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cart }: {cart: Cart} = await request.json();
  
    const orderRequest = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: cart.quantity.toString(),
            },
          },
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
