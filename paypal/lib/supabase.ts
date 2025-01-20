"server only"
import { createClient } from '@supabase/supabase-js'
import { TransactionDetails, TransactionPayload } from './types';

const supabaseUrl = process.env.SUPABASE_URL as string;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, serviceRoleKey);
export default supabase;

export async function updateBalance(amount: number, address: string) {
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
            Balance: updatedBalance
        })
        .eq("address", address);
    
        if (error) {
            throw new Error("Balance query error");
        }
    }
}

export async function addTransaction(transactionDetails: TransactionDetails, address: string) {
    const {data, error}= await supabase
    .from("user_wallet")
    .select("user_id")
    .eq("address",address)
    .single();

    if (error) {
        console.log(error);
        throw new Error("Query error");
    }

    const userID: string = data.user_id;
    const transactionPayload: TransactionPayload = {...transactionDetails, userID};
    {
        const {error} = await supabase
        .from('transactions')
        .insert({transactionPayload});

        if (error) {
            console.log(error);
            throw new Error("Insert error");
        }
    }





  
}