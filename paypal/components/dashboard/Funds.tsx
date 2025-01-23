"use client"
import useBalance from '@/lib/hooks/useBalance';
import React from 'react'

function Funds() {
  const { data: balance } = useBalance();
  return (
    <div className='m-5 flex flex-col justify-center items-center'>
      <h1 className='text-3xl'>Balance: {balance} USD</h1>
    </div>
  )
}

export default Funds