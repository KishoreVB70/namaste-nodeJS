"use client"
import { useEffect } from "react";
import balanceStore from "@/lib/state/balanceStore";
import { getBalance } from "@/lib/apiUtils";

function useBalance() {
  const { setBalance } = balanceStore();
  
  useEffect(() => {
    async function balance() {
      const balance = await getBalance();
      setBalance(balance);
    }
    balance();
  })

}
export default useBalance;