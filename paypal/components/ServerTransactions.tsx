import "server-only";

import supabase, { sBaseGetUserID } from '@/lib/supabase';
import { transactionPageSize } from '@/lib/utils/constants';
import Link from 'next/link';
import React from 'react';
import TransactionTable from "@/components/dashboard/TransactionTable";


async function Transactions({page}: {page: number}) {

  // const cookieStore = cookies();
  // const address = cookieStore.get('address')?.value;
  const start = (page - 1) * transactionPageSize;
  const end = start + transactionPageSize - 1;

  const address = "bot"
  const userID: string = await sBaseGetUserID(address);

  const {data: transactions, error} = await supabase
  .from("transactions")
  .select("*")
  .eq("user_id", userID)
  .range(start, end);

  if (error) {
    console.log("error: ", error);
    return
  }
  console.log(transactions);

  if (transactions) {
    return (
      <div className='flex flex-col items-center m-5'>
        <h1 className='font-bold text-3xl'>Transactions</h1>
        <TransactionTable transactions={transactions} />

        {page >  1 && (
          <Link 
            className='border border-white p-3 m-2 hover:text-black hover:bg-white'
            href={`/transactions/${page-1}`} 
          >
            Previous page
          </Link>
        )}
  
        {transactions.length === 10 && (
          <Link 
            className='border border-white p-3 m-2 hover:text-black hover:bg-white'
            href={`/transactions/${page+1}`}   
          >
            Next page
          </Link>
        )}
  

      </div>
    )
  }
  
}

export default Transactions