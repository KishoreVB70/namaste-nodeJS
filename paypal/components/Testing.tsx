"use client"
import { updateUserBalance } from '@/app/actions'
import React from 'react'

const Testing = () => {
  return (
    <button  className='p-5 m-auto border-white border w-52'
    onClick={() => updateUserBalance()}>Test</button>
  )
}

export default Testing