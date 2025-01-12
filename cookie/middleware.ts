import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken';

interface JwtPayloadWithAddress extends jwt.JwtPayload {
    address: string;
}
export function middleware(request: NextRequest) {
    try {
        console.log("in middleware");
        const token = request.cookies.get("userwallet")?.value;
        if (!token) {
            return NextResponse.json({error: "no token"}, {status:401});
        }
        const secretKey = process.env.JWT_SECRET as string;
        console.log(secretKey);

        if (!secretKey) {
          throw new Error('JWT secret key is not defined');
        }
    
        const decoded = jwt.verify(token, secretKey);
        console.log("decoded", decoded);

        // Type assurance
        if (typeof decoded !== 'object' || decoded === null || !('address'  in  decoded)) {
            return NextResponse.json({error: "Invalid token"}, {status:401});
        }

        const payload = decoded as JwtPayloadWithAddress;
        const requestHeaders = new Headers(request.headers);
        console.log("Payload", payload.address);
        requestHeaders.set('x-address', payload.address);
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