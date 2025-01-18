"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Funds() {
  const [balance, setBalance] = useState(0);
  const fetchFunds = async() => {
    try {
      const response = await axios.get("/api/balance");
      const {balance} = response.data;
      console.log(balance);
      setBalance(balance);

    }catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchFunds();
  },[])
  return (
    <div className='m-5 flex flex-col justify-center items-center'>
      <h1 className='text-3xl'>Balance: {balance} USD</h1>
    </div>
  )
}

export default Funds