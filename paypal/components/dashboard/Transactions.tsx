"use client";
import React, { useState } from 'react'
import TransactionTable from "@/components/dashboard/TransactionTable";
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/lib/apiUtils';

function Transactions() {
  const [page, setPage] = useState(1);
  const { data: transactions, isLoading} = useQuery({
    queryKey: ["transactions", page],
    queryFn: async () => {
      return getTransactions(page);
    },
    staleTime: Infinity
  })

  const nextPage = async() => {
    setPage(page => page + 1);
    getTransactions(page + 1);
  }

  const previousPage = async() => {
    setPage(page => page - 1);
    getTransactions(page - 1);
  }

  if (isLoading) {
    return <p>Loading</p>
  }

  if (transactions) {
    return (
      <div className='flex flex-col items-center m-5'>
        <h1 className='font-bold text-3xl'>Transactions</h1>
        <TransactionTable transactions={transactions} />
        {transactions.length === 10 && (
          <button 
            className='border border-white p-3 m-2 hover:text-black hover:bg-white'
            onClick={nextPage}  
          >
            Next page
          </button>
        )}
  
        {page >  1 && (
          <button 
            className='border border-white p-3 m-2 hover:text-black hover:bg-white'
            onClick={previousPage}  
          >
            Previous page
          </button>
        )}
  
      </div>
    )
  }

}

export default Transactions
