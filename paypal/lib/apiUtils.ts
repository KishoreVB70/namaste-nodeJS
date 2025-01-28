import axios from "axios";
import { TransactionType } from "./utils/types";

export async function getTransactions(page: number) {
  const response = await axios.get(`/api/transactions/?page=${page}`);
  return response.data.data as TransactionType[];
}
