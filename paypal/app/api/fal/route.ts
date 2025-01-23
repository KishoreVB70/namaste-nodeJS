import { generateAudioCost } from "@/lib/utils/constants";
import { sBaseAddTransaction, sBaseGetBalance, sBaseUpdateBalance } from "@/lib/supabase";
import { TransactionDetails } from "@/lib/utils/types";
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

    const transactionDetails: TransactionDetails = {
      amount: generateAudioCost,
      type: "debit",
    }

    // Add transaction
    await sBaseAddTransaction(transactionDetails, address);

    return route.POST(req);
  }catch(error) {
    return NextResponse.json({error}, {status: 500});
  }
};
 
export const GET = route.GET;