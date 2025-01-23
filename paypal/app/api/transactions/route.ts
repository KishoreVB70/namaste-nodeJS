import { transactionPageSize } from "@/lib/utils/constants";
import supabase, { sBaseGetUserID } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const start = (page - 1) * transactionPageSize;
        const end = start + transactionPageSize - 1;

        const address = req.headers.get("x-address");
        if (!address) {
            return NextResponse.json({error: "Wrong address"}, {status: 400});
        }
        const userID: string = await sBaseGetUserID(address);

        const {data, error} = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userID)
        .range(start, end);

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