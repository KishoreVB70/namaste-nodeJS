import React from 'react'

function TableBody() {
  return (
    <tbody>
        <tr className="border-b border-neutral-200 dark:border-white/10">
            <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
            <td className="whitespace-nowrap px-6 py-4">Mark</td>
            <td className="whitespace-nowrap px-6 py-4">Otto</td>
            <td className="whitespace-nowrap px-6 py-4">@mdo</td>
        </tr>
        <tr className="border-b border-neutral-200 dark:border-white/10">
            <td className="whitespace-nowrap px-6 py-4 font-medium">2</td>
            <td className="whitespace-nowrap px-6 py-4">Jacob</td>
            <td className="whitespace-nowrap px-6 py-4">Thornton</td>
            <td className="whitespace-nowrap px-6 py-4">@fat</td>
        </tr>
        <tr className="border-b border-neutral-200 dark:border-white/10">
            <td className="whitespace-nowrap px-6 py-4 font-medium">3</td>
            <td className="whitespace-nowrap px-6 py-4">Larry</td>
            <td className="whitespace-nowrap px-6 py-4">Wild</td>
            <td className="whitespace-nowrap px-6 py-4">@twitter</td>
        </tr>
    </tbody>
  )
}

export default TableBody