"use client";
import React, { useCallback, useEffect, useState } from 'react'
import TransactionTable from "@/components/dashboard/TransactionTable";
import { TransactionType } from '@/lib/types';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [page, setPage] = useState(1);

  const getTransactions = useCallback(async(page: number) => {
    try {
      const transactions = await axios.get(`/api/transactions/?page=${page}`);
      console.log(transactions.data.data);
      setTransactions(transactions.data.data);
    } catch(error) {
      console.log(error);
    }
  }, [])

  const nextPage = async() => {
    setPage(page => page + 1);
    getTransactions(page + 1);
  }

  const previousPage = async() => {
    setPage(page => page - 1);
    getTransactions(page - 1);
  }

  useEffect(() => {
    getTransactions(1);
  }, [getTransactions])
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

export default Transactions
