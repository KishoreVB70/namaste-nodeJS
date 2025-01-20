"use client";
import React, { useEffect, useState } from 'react'
import TransactionTable from "@/components/dashboard/TransactionTable";
import { TransactionType } from '@/lib/types';
import axios from 'axios';

const trans: TransactionType = {
  id: 1,
  time: "20-7-25",
  amount:2,
  type: "Input",
  mode: "Paypal"
}

function Transactions() {
  const [transactions, setTransactions] = useState<[TransactionType]>([trans]);

  const getTransactions = async() => {
    try {
      const transactions = await axios.get("/api/transactions");
      console.log(transactions.data.data);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTransactions();
    setTransactions([trans]);
  }, [])
  return (
    <div className='flex flex-col items-center m-5'>
      <h1 className='font-bold text-3xl'>Transactions</h1>
      <TransactionTable transactions={transactions} />
      <button className='border border-white p-3 m-2 hover:text-black hover:bg-white'>Load more</button>
    </div>
  )
}

export default Transactions
