"use client"
import React from 'react'
import { appKit } from "@/lib/providers";
import { useState } from "react";
import { useAccount, useDisconnect } from 'wagmi';

function Connect() {
  const [error, setError] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const handleConnect = async (): Promise<void> => {
    setError(''); // Clear any previous errors
    try {
      await appKit.open();
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Error connecting wallet');
    }
  };  

  if (!isConnected) return (
    <div>
        <button
          onClick={handleConnect}
          className="w-full bg-white text-black py-3 px-6  font-medium mb-6 hover:bg-gray-400 transition-colors disabled:opacity-50"
        >
          CONNECT
        </button>
        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
    </div>
  )

  if(isConnected) return (
    <div>
        <p>Address: {address}</p>
        <button
        onClick={() => disconnect()}
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
            Disconnect Wallet
        </button>
    </div>

  )

}

export default Connect