"use client"
import React from 'react'
import { fal } from "@fal-ai/client";
import Funds from '@/components/dashboard/Funds';

fal.config({
  proxyUrl: "/api/fal",
});

function GenerateAISound() {

  async function generateSound() {
    const { data, requestId } = await fal.subscribe("fal-ai/stable-audio", {
      input: {
        prompt: "",
        ...(
        {
          seconds_start: 0,
          seconds_total: 15,
          steps: 120
        }
        )
      },
      logs: true,
      pollInterval:3000,
    });

    console.log(data);
    console.log(requestId);
  }


  return (
    <div className='flex flex-col items-center justify-center'>
      <Funds />
      <button 
          className='border border-white p-3 m-2 rounded-lg hover:text-black hover:bg-white'
          onClick={generateSound}  
        >
        Generate audio
      </button>
    </div>
  )
}

export default GenerateAISound