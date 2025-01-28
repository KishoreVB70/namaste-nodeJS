"use server";

import { sBaseAddTransaction, sBaseUpdateBalance } from "@/lib/supabase";
import { generateAudioCost } from "@/lib/utils/constants";
import { TransactionDetails } from "@/lib/utils/types";

export async function updateUserBalance() {
  const address = "bot";
  if (!address)
    return {
      error: "Unauthenticated",
    };

  try {
    console.log("Address:", address);
    console.log("cost: ", -generateAudioCost);
    await sBaseUpdateBalance(-generateAudioCost, address);
    const transaction: TransactionDetails = {
      amount: generateAudioCost,
      type: "debit",
      mode: "stable_audio",
    };
    await sBaseAddTransaction(transaction, address);
  } catch (error) {
    console.log(error);
    return {
      error: "Unable to add data to DB",
    };
  }
}
