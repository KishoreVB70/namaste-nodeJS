"use client"
import React, { useState } from 'react'
import Paypal from "@/components/dashboard/Paypal";
function Dashboard() {
  const [quantity, setQuantity] = useState<number>(1);
  function handleQuantityChange(value: string) {
    let int = parseInt(value, 10);
    if (isNaN(int)) {
        int = 0;
    }
    setQuantity(int);
  }

  return (
    <div className='flex flex-col justify-center items-center'>
        <p>Enter Amount</p>
        <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="text-black m-5 p-5"
            min="1"
        />
        <Paypal quantity={quantity}/>

    </div>
  )
}

export default Dashboard