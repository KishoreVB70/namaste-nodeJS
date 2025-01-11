import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const userWallet = cookieStore.get('userwallet');

  if (userWallet) {
    return NextResponse.json({ cookie: true });
  } else {
    return NextResponse.json({ message: 'Cookie not found' }, { status: 404 });
  }
}
