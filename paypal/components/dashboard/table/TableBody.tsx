import { TransactionType } from '@/lib/types'
import React from 'react'

function TableBody({transactions}: {transactions: [TransactionType]}) {
  return (
    <tbody>
      {transactions.map(transaction => 
        <tr
          className="border-b border-neutral-200 dark:border-white/10"
          key={transaction.id}
        >
          <td className="whitespace-nowrap px-6 py-4">{transaction.time}</td>
          <td className="whitespace-nowrap px-6 py-4">{transaction.amount}</td>
          <td className="whitespace-nowrap px-6 py-4">{transaction.type}</td>
          <td className="whitespace-nowrap px-6 py-4">{transaction.mode}</td>
        </tr>
      )}
    </tbody>
  )
}

export default TableBody