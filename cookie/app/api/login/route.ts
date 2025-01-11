import { NextResponse } from 'next/server';
import {ethers} from 'ethers';
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { address, signature, message } = await req.json();

    // Verify the signature
    const recoveredAddress: string = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Address verification failed' }, { status: 401 });
    }

    // Generate a JWT
    console.log(JWT_SECRET);
    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' });

    const response = NextResponse.json({ message: 'Address verified successfully', token, address });
    response.cookies.set('userwallet', token, {
      httpOnly: true, // Ensures the cookie is inaccessible to JavaScript on the client
      secure: process.env.NODE_ENV === 'production', // Sends the cookie over HTTPS only in production
      sameSite: 'strict', // Protects against CSRF attacks
      path: '/', // Makes the cookie available throughout your site
      maxAge: 60 * 60, // Sets the cookie to expire in 1 hour
    });

    return response;
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error }, { status: 400 });
  }
}
