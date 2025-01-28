import "server-only";

import  { sBaseGetTransactions } from '@/lib/supabase';
import Link from 'next/link';
import React from 'react';
import TransactionTable from "@/components/dashboard/TransactionTable";


async function Transactions({page}: {page: number}) {

  // const cookieStore = cookies();
  // const address = cookieStore.get('address')?.value;

  const address = "bot"
  const transactions = await sBaseGetTransactions(page, address);

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