export type TransactionType = {
    transaction_id: number,
    transaction_date: string,
    amount: number,
    transaction_type: string,
    transaction_mode: string
}
export type TransactionDetails = {
    amount: number,
    type: string,
    mode: string
}

export type TransactionPayload = {
    userID: string,
    amount: number,
    type: string,
    mode: string
}