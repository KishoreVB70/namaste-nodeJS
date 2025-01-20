import { generateAudioCost } from "@/lib/constants";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const address = req.headers.get("x-address");

    // Get the balance
    const {data, error} = await supabase
    .from("user_wallet")
    .select("balance")
    .eq("adddress", address)
    .single();

    if (error) {
        return NextResponse.json({error: error}, {status: 500})
    }

    if (data.balance < generateAudioCost) {
        return NextResponse.json({error: "Low balance"}, {status: 400})
    }

    // Generate sound operation

    // Reduce balance
    const newBalance = data.balance - generateAudioCost;
    {
        const {error} = await supabase
        .from("userwallet")
        .update({
            "balance": newBalance
        })
        .eq("address", address);

        if (error) {
            return NextResponse.json(
                {
                    message: "update failed", error: error
                },
                {status: 500}
            )
        }    

        return NextResponse.json({}, {status: 200});
    }


}