import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function UPDATE(req: NextRequest) {
    const address = req.headers.get("x-address");
    const balance = req.headers.get("x-balance");

    // Get existing balance
    const {data, error} = await supabase
    .from("userwallet")
    .select("balance")
    .eq("address", address)
    .single();

    if (error) {
        return NextResponse.json({error: "Balance query error"}, {status:401});
    }

    const oldBalance = data.balance;
    const updatedBalance = oldBalance + balance;
    {
        const {error} = await supabase
        .from("userwallet")
        .update({
            Balance: updatedBalance
        })
        .eq("address", address);
    
        if (error) {
            return NextResponse.json({error: "Balance query error"}, {status:401});
        }
        return NextResponse.json({message: "updated user balance"}, {status:200});
    }
}

export async function GET(req: NextRequest) {
    const address = req.headers.get("x-address");
    if (!address) {
        return NextResponse.json({error: "Address not found"}, {status:404});
    }

    try {
        const {data, error} = await supabase
        .from("userwallet")
        .select("balance")
        .eq("address", address)
        .single();
    
        if (error) {
            console.log("Supabase error", error);
            return NextResponse.json({error}, {status: 500});
        }
    
        const balance = data?.balance;
        return NextResponse.json({balance}, {status: 200});
    }catch(error) {
        console.log("Balance error", error);
        return NextResponse.json({error}, {status: 500});
    }
}