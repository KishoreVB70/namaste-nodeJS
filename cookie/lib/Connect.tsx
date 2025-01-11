"use client"
import React, { useCallback, useEffect } from 'react'
import { appKit } from "@/lib/providers";
import { useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import axios from 'axios';
import Cookies from 'js-cookie';
import useStore from './store';

function Connect() {
  const [error, setError] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { hasCookie, setHasCookie }= useStore();

  const handleConnect = async (): Promise<void> => {
    setError(''); // Clear any previous errors
    try {
      Cookies.remove("userwallet");
      await appKit.open();
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Error connecting wallet');
    }
  };

  const checkCookie = useCallback(async() => {
    try {
      const cookie = await axios.get('/api/cookie');
      console.log(cookie);
      if (cookie) {
        console.log("cook");
        setHasCookie(true);
        return true;
      } 
      else {
        setHasCookie(false);
        return false;
      }
    }catch(error) {
      console.log(error);
      return false;
    }
  }, [setHasCookie]);

  const verifyAddress = useCallback(async() => {
    if (!address) return;
    setError(''); // Clear previous errors
    try {
      // Generate and sign a verification message
      const message = `Verify ownership of address ${address} at ${new Date().toISOString()}`;
      const signature = await signMessageAsync({ message });

      // Send the signed message and address to the API for verification
      const response = await axios.post('/api/login', {
        address,
        signature,
        message,
      });
      console.log('Verification response:', response.data);
    } catch (err) {
      console.error('Verification error:', err);
      setError(err instanceof Error ? err.message : 'Error verifying address');
    }
  }, [address, signMessageAsync])

  // Check for JWT and obtain JWT
  useEffect(() => {
    const hasCookieCheck = async () => {
      if (!isConnected || !address) return;
      if (hasCookie) return;
      const cookieCheck = checkCookie();
      if (!cookieCheck) {
        void verifyAddress();
      }
    }
    void hasCookieCheck();
  }, [address, hasCookie, isConnected, checkCookie, verifyAddress]);

  // ---------------------------------------------<UI>----------------------------------

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
        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}
    </div>

  )

}

export default Connect