"use client"
import { useEffect } from "react";
import balanceStore from "@/lib/state/balanceStore";
// import { getBalance } from "@/lib/apiUtils";
import axios from "axios";

function useBalance() {
  const { setBalance } = balanceStore();
  
  useEffect(() => {
    async function getBalance() {
      const response = await axios.get("/api/balance");
      return response.data.balance;
    }
    async function balance() {
      const balance = await getBalance();
      setBalance(balance);
    }
    balance();
  })

}
export default useBalance;