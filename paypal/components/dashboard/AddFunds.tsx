"use client";
import React, { useState } from "react";
import Paypal from "./Paypal";
import IcpPayment from "./IcpPayment";

function AddFunds() {
  const [quantity, setQuantity] = useState<number>(1);
  function handleQuantityChange(value: string) {
    let int = parseInt(value, 10);
    if (isNaN(int)) {
      int = 0;
    }
    setQuantity(int);
  }

  return (
    <div className="flex flex-col items-center justify-center p-5 m-5 border border-white">
      <h1 className="text-3xl">Add Funds</h1>
      <p className="mt-3">Enter Amount</p>
      <input
        type="number"
        placeholder="Enter Quantity"
        value={quantity}
        onChange={(e) => handleQuantityChange(e.target.value)}
        className="text-black m-3 p-5"
        min="1"
      />
      {/* <button
          className='m-2 p-3 border border-blue-400 rounded-full text-white'
      >
        Pay with Paypal
      </button> */}

      <Paypal quantity={quantity} />
      <p>Login with ICP to pay with ICP</p>
      <IcpPayment />
    </div>
  );
}

export default AddFunds;
