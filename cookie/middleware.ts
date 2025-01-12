import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from "jose";


export async function middleware(request: NextRequest) {
    try {
        const token = request.cookies.get("userwallet")?.value;
        if (!token) {
            return NextResponse.json({error: "no token"}, {status:401});
        }

        const secretKey = process.env.JWT_SECRET as string;
        if (!secretKey) {
          throw new Error('JWT secret key is not defined');
        }

        const secretKeyUint8 = new TextEncoder().encode(secretKey);
        const { payload } = await jwtVerify(token, secretKeyUint8);

        // Type assurance
        if (typeof payload !== 'object' || !payload || !('address' in payload)) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const requestHeaders = new Headers(request.headers);

        const address = payload.address as string;
        requestHeaders.set('x-address', address);

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
    }catch(error) {
        console.log("middleware error", error);
        NextResponse.json({error}, {status: 500});
    }

}

export const config = {
    matcher: '/api/balance',
};