import "server-only"
import { createClient } from '@supabase/supabase-js'
import { TransactionDetails } from '@/lib/utils/types';
import { transactionPageSize } from "./utils/constants";

const supabaseUrl = process.env.SUPABASE_URL as string;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, serviceRoleKey);
export default supabase;

export async function sBaseGetBalance(address: string) {
    const {data, error} = await supabase
    .from("user_wallet")
    .select("balance")
    .eq("address", address)
    .single();

    if (error) {
        throw new Error(error?.details);
    }

    return data.balance;
}

export async function sBaseGetUserID(address: string) {
    const {data, error}= await supabase
    .from("user_wallet")
    .select("user_id")
    .eq("address",address)
    .single();

    if (error) {
        console.log(error);
        throw new Error("Query error");
    }

    return data.user_id as string;
}

export async function sBaseUpdateBalance(amount: number, address: string) {
    // Get existing balance
    const {data, error} = await supabase
    .from("user_wallet")
    .select("balance")
    .eq("address", address)
    .single();

    if (error) {
        throw new Error("Balance query error");
    }

    const oldBalance = data.balance;
    const updatedBalance = oldBalance + amount;

    console.log("old", oldBalance)
    console.log("new", updatedBalance)
    {
        const {error} = await supabase
        .from("user_wallet")
        .update({
            balance: updatedBalance
        })
        .eq("address", address);
    
        if (error) {
            console.log(error);
            throw new Error("Balance Update error");
        }
    }
}

export async function sBaseAddTransaction(transactionDetails: TransactionDetails, address: string) {
    const userID: string = await sBaseGetUserID(address);
    const {error} = await supabase
    .from('transactions')
    .insert({
        "user_id": userID,
        "transaction_mode": transactionDetails.mode || null,
        "amount": transactionDetails.amount,
        "transaction_type": transactionDetails.type
    });

    if (error) {
        console.log("Supabase error: ", error);
        throw new Error("Insert error");
    }
}

export async function sBaseGetTransactions(page: number, address: string) {
    try {
        const userID: string = await sBaseGetUserID(address);
        const start = (page - 1) * transactionPageSize;
        const end = start + transactionPageSize - 1;
    
        const {data, error} = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userID)
        .range(start, end);
      
        if (error) {
          console.log("error: ", error);
          throw error;
        }

        return data;
    } catch(error) {
        console.log(error);
        throw error;
    }

}