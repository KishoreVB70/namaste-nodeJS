"use client"
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi';

function Balance() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance ] = useState(0);

  const getBalance = useCallback(async() => {
    try {
      const response = await axios.get("/api/balance");
      setBalance(response.data.balance);
    } catch(error) {
        console.log(error);
    }
  }, []);
  
  useEffect(() => {
    if (!isConnected || !address) return;
    getBalance();
  }, [isConnected, address, getBalance]);

  return (
    <div>Balance: {balance}</div>
  )
}

export default Balance