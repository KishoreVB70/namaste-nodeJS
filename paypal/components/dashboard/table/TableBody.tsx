import { TransactionType } from '@/lib/types'
import React from 'react'

function TableBody({transactions}: {transactions: TransactionType[]}) {z
  return (
    <tbody>
      {transactions.map(transaction => 
        <tr
          className="border-b border-neutral-200 dark:border-white"
          key={transaction.transaction_id}
        >
          <td className="whitespace-nowrap px-6 py-4">{transaction.transaction_date}</td>
          <td className="whitespace-nowrap px-6 py-4">{transaction.amount} USD</td>
          <td className="whitespace-nowrap px-6 py-4">{transaction.transaction_type}</td>
          <td className="whitespace-nowrap px-6 py-4">{transaction.transaction_mode}</td>
        </tr>
      )}
    </tbody>
  )
}

export default TableBody