"use client";
import React, { useEffect, useState } from 'react'
import TransactionTable from "@/components/dashboard/TransactionTable";
import { TransactionType } from '@/lib/types';

const trans: TransactionType = {
  id: 1,
  time: "20",
  amount:2,
  type: "Input",
  mode: "Paypal"
}

function Transactions() {
  const [transactions, setTransactions] = useState<[TransactionType]>([trans]);

  useEffect(() => {
    setTransactions([trans]);
  }, [])
  return (
    <div>
      <TransactionTable transactions={transactions} />
    </div>
  )
}

export default Transactions
