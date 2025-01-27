import { sBaseGetBalance } from '@/lib/supabase';
// import { cookies } from 'next/headers';
import React from 'react'

async function Funds() {
  // const cookieStore = cookies();
  // const address = cookieStore.get('address')?.value;
  const address = "bot";
  if (!address) {
    return;
  }
  const balance = await sBaseGetBalance(address);
  return (
    <div className='m-5 flex flex-col justify-center items-center'>
      <h1 className='text-3xl'>Balance: {balance} USD</h1>
    </div>
  )
}

export default Funds