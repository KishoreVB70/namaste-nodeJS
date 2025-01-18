import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
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