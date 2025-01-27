"use client"
import React from 'react'
import { fal } from "@fal-ai/client";
import Funds from '@/components/dashboard/Funds';
import { useQueryClient } from '@tanstack/react-query';
import { updateUserBalance } from '@/app/actions';
import { error } from 'console';

fal.config({
  proxyUrl: "/api/fal",
});

function GenerateAISound() {
  const queryClient = useQueryClient();

  async function generateSound() {
    try {
      const { data, requestId } = await fal.subscribe("fal-ai/stable-audio", {
        input: {
          prompt: "small audio",
          ...(
            {
              seconds_start: 0,
              seconds_total: 3,
              steps: 100
            }
          )
        },
        logs: true,
        pollInterval:3000,
      });
      console.log(data, requestId);
      // Server action
      const updateResult = await updateUserBalance();
      if (updateResult?.error) console.log(error);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    } catch(error) {
      console.log(error);
    }
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