import { sBaseAddTransaction, sBaseGetBalance, sBaseUpdateBalance } from "@/lib/supabase";
import { generateAudioCost } from "@/lib/utils/constants";
import { TransactionDetails } from "@/lib/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const address = req.headers.get("x-address");
    if (!address) {
        return NextResponse.json({error: "No"})
    }

    try {
        console.log("Address:", address)
        console.log("cost: ", -generateAudioCost);
        await sBaseUpdateBalance(-generateAudioCost, address);
        const transaction: TransactionDetails = {
            amount: generateAudioCost,
            type: "debit",
            mode: "stable_ai"
        }
        await sBaseAddTransaction(transaction, address);
        return NextResponse.json({message: "updated user balance"}, {status:200});

    } catch(error) {
        console.log(error);
        return NextResponse.json({error: error}, {status:401});
    }
}

export async function GET(req: NextRequest) {
    const address = req.headers.get("x-address");
    if (!address) {
        return NextResponse.json({error: "Address not found"}, {status:404});
    }

    try {
        const balance = await sBaseGetBalance(address);
        return NextResponse.json({balance}, {status: 200});
    }catch(error) {
        console.log("Balance error", error);
        return NextResponse.json({error}, {status: 500});
    }
}