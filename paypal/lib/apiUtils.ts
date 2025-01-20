import axios from "axios";

export async function getBalance() {
    const response = await axios.get("/api/balance");
    return response.data.balance;
}