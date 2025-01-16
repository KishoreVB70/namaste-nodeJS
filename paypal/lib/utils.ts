"server only";
import { ApiResponse, Order } from '@paypal/paypal-server-sdk';

export async function getResponseBody(response: ApiResponse<Order>): Promise<string> {
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
