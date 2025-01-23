"use client"
import React from 'react'
import { fal } from "@fal-ai/client";
import Funds from '@/components/dashboard/Funds';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

fal.config({
  proxyUrl: "/api/fal",
});

function GenerateAISound() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async() => {
      await axios.put("/api/balance");
    },
    onSuccess: () => {
      console.log("On success");
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    }
  })

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
      console.log("Mutate going to be called");
      mutate();
      console.log("Mutate called");
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