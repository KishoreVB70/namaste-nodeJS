"use client"
import React from 'react'
import Funds from '@/components/dashboard/Funds';
import Transactions from '@/components/dashboard/Transactions';
import AddFunds from '@/components/dashboard/AddFunds';
function Dashboard() {

  return (
    <div className='flex flex-col justify-center items-center'>
      <Funds />
      <AddFunds/>
      <Transactions />
    </div>
  )
}

export default Dashboard