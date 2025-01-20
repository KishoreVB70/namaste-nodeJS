import { generateAudioCost } from "@/lib/constants";
import { sBaseGetBalance, sBaseUpdateBalance } from "@/lib/supabase";
import { route } from "@fal-ai/server-proxy/nextjs";
import { NextRequest, NextResponse } from "next/server";
 
export async function POST(req: NextRequest) {
  const address = req.headers.get("x-address");
  if (!address) {
      return NextResponse.json({error: "Address not found"}, {status:404});
  }
  try {
    const balance = await sBaseGetBalance(address);
    if (balance < generateAudioCost) {
      return NextResponse.json({error: "Inadequate funds"}, {status: 400})
    }

    // Update balance
    await sBaseUpdateBalance(-generateAudioCost, address);

    return route.POST(req);


  }catch(error) {
    return NextResponse.json({error}, {status: 500});
  }
};
 
export const GET = route.GET;