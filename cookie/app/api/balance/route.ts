import supabase from "@/lib/supabase";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        console.log("in balance");
        const address = req.headers.get("x-address");
        console.log("add", address);
        if (!address) {
            return NextResponse.json({error: "Address not found"}, {status:404});
        }

        const {data, error} = await supabase
        .from("userwallet")
        .select("balance")
        .eq("address", address)
        .single();
        
        if (error) {
            throw new Error(error.message);
        }
        const balance = data?.balance;
        return NextResponse.json({balance})
    }catch(error) {
        NextResponse.json({error}, {status: 500});
    }

}