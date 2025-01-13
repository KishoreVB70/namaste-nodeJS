import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/paypal';
import { OrdersController, ApiError } from '@paypal/paypal-server-sdk';

const ordersController = new OrdersController(client);

export async function POST(request: NextRequest, { params }: { params: { orderID: string } }) {
  const { orderID } = params;

  try {
    const captureRequest = {
      id: orderID,
      prefer: 'return=minimal',
    };

    const { body, statusCode } = await ordersController.ordersCapture(captureRequest);
    const jsonResponse = JSON.parse(body);

    return NextResponse.json(jsonResponse, { status: statusCode });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('PayPal API Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'Failed to capture order.' }, { status: 500 });
  }
}
