import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBalance = async () => {
  const { data } = await axios.get("/api/balance");
  return data.balance;
};

export const useBalance = () => {
  return useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
    staleTime: Infinity, // Prevents refetching
    gcTime: Infinity, // Keeps the data in cache
  });
};

export default useBalance;
