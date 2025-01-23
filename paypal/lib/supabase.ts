import "server-only"
import { createClient } from '@supabase/supabase-js'
import { TransactionDetails } from './types';

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
    const userID: string = await getUserID(address);
    const {error} = await supabase
    .from('transactions')
    .insert({
        "user_id": userID,
        "transaction_mode": transactionDetails.mode,
        "amount": transactionDetails.amount,
        "transaction_type": transactionDetails.type
    });

    if (error) {
        console.log(error);
        throw new Error("Insert error");
    }
}