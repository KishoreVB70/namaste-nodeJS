import useUserBalanceStore from '@/lib/store'
import React from 'react'

function Funds() {
  const {balance} = useUserBalanceStore();
  return (
    <div className='m-5 flex flex-col justify-center items-center'>
      <h1 className='text-3xl'>Balance: {balance} USD</h1>
    </div>
  )
}

export default Funds