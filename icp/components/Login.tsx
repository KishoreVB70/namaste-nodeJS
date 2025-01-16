"use client"
import { useAuth } from '@/lib /context/AuthContext';
import useICPAuth from '@/lib /hooks/useICPAuth'
import React from 'react'
import { AccountIdentifier, LedgerCanister } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import { createAgent } from "@dfinity/utils";


function Login() {
  const {loginWithInternetIdentity, logout } = useICPAuth();
  const {principal, userActor} = useAuth();

  async function pay() {
    if (!userActor || !principal) return;
    try {
      const agent = await createAgent({
        identity: userActor,
        host: "https://ic0.app",
      });
    
      const ledgerCanister: LedgerCanister = LedgerCanister.create({
        agent,
        canisterId:  Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai'), // Mainnet Ledger Canister ID
      })
  
      const account: AccountIdentifier = AccountIdentifier.fromPrincipal({principal});
      const amountInE8s = BigInt(1 * 1e8);
  
      const transferResult = await ledgerCanister.transfer({
        to: account,
        amount: amountInE8s,
      });
  
      console.log(transferResult);
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col'>
      {principal != null && <p>Principal: {principal.toString()}</p>}
      <button className='p-5 m-5 w-[30vw] border-white border hover:bg-green-700' onClick={loginWithInternetIdentity}>Login</button>
      <button className='p-5 m-5 border-white border hover:bg-red-400' onClick={logout}>Logout</button>
      <button className='p-5 m-5 border-white border hover:bg-blue-400' onClick={pay}>Pay</button>
    </div>
  )
}

export default Login