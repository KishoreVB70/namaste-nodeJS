import supabase, { getUserID } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const address = req.headers.get("x-address");
        if (!address) {
            return NextResponse.json({error: "Wrong address"}, {status: 400});
        }
        const userID: string = await getUserID(address);

        const {data, error} = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userID)

        if (error) {
            return NextResponse.json({error: "Transaction query error"}, {status: 500});
        }

        console.log(data);

        return NextResponse.json({data}, {status: 200});
    }catch(error) {
        console.log(error);
        return NextResponse.json({error}, {status: 500});
    }
}