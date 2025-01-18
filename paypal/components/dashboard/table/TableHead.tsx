import React from 'react'

function TableHead() {
  return (
    <thead
        className="border-b border-neutral-200 font-medium dark:border-white/10"
    >
        <tr>
            <th scope="col" className="px-6 py-4">#</th>
            <th scope="col" className="px-6 py-4">First</th>
            <th scope="col" className="px-6 py-4">Last</th>
            <th scope="col" className="px-6 py-4">Handle</th>
        </tr>
    </thead>
  )
}

export default TableHead