"server only"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, serviceRoleKey);
export default supabase;

export async function updateBalance(amount: number, address: string) {
    // Get existing balance
    const {data, error} = await supabase
    .from("userwallet")
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
        .from("userwallet")
        .update({
            Balance: updatedBalance
        })
        .eq("address", address);
    
        if (error) {
            throw new Error("Balance query error");
        }
    }
}