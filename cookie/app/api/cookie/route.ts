import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userWallet = cookieStore.get('userwallet');  
    if (userWallet && userWallet != undefined) {
      return NextResponse.json({},{status: 200});
    } else {
      return NextResponse.json({},{ status: 404 });
    }
  } catch(error) {
    return NextResponse.json({ message: error}, { status: 500 });
  }

}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    const userWallet = cookieStore.get('userwallet');
    if (userWallet) {
      cookieStore.delete('userwallet');
      return NextResponse.json({ message: 'Cookie deleted successfully' });
    } else {
      return NextResponse.json({ message: 'Cookie not found' }, { status: 404 });
    }
  } catch(error) {
    return NextResponse.json({message: error}, {status: 500});
  }

}
