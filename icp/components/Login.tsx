"use client"
import { useAuth } from '@/lib /context/AuthContext';
import useICPAuth from '@/lib /hooks/useICPAuth'
import React from 'react'

function Login() {
  const {loginWithInternetIdentity, logout} = useICPAuth();
  const {principal} = useAuth();
  return (
    <div className='flex flex-col'>
      {principal != null && <p>Principal: {principal.toString()}</p>}
      <button className='' onClick={loginWithInternetIdentity}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Login