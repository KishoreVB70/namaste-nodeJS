export type TransactionType = {
    id: number,
    time: string,
    amount: number,
    type: string,
    mode: string
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