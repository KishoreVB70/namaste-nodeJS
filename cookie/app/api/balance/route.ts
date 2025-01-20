import supabase from "@/lib/supabase";
import { NextResponse, NextRequest } from "next/server";

async function createUser(address: string): Promise<void> {
    const {error} = await supabase
    .from("userwallet")
    .insert({
        "address": address
    })
    if (error) {
        throw error;
    }
}

export async function UPDATE(req: NextRequest) {
    const address = req.headers.get("x-address");
    const balance = req.headers.get("x-balance");

    // Get existing balance
    const {data, error} = await supabase
    .from("user_wallet")
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
        return NextResponse.json({}, {status:401});
    }
}

export async function GET(req: NextRequest) {
    try {
        const address = req.headers.get("x-address");
        if (!address) {
            return NextResponse.json({error: "Address not found"}, {status:404});
        }

        const {data, error} = await supabase
        .from("user_wallet")
        .select("balance")
        .eq("address", address)
        .single();
        
        if (error) {
            if (error.code != "PGRST116") {
                console.log("Supabase error", error);
                return NextResponse.json({error}, {status: 500});
            }

            // User hasn't been created in db
            void await createUser(address);
            return NextResponse.json({balance: 0}, {status: 200});
        }

        const balance = data?.balance;
        return NextResponse.json({balance}, {status: 200});
    }catch(error) {
        console.log("Balance error", error);
        return NextResponse.json({error}, {status: 500});
    }

}