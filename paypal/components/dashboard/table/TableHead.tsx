import React from "react";

function TableHead() {
  return (
    <thead className="border-b border-neutral-200 font-medium dark:border-white">
      <tr>
        <th scope="col" className="px-6 py-4">
          Date
        </th>
        <th scope="col" className="px-6 py-4">
          Amount
        </th>
        <th scope="col" className="px-6 py-4">
          Type
        </th>
        <th scope="col" className="px-6 py-4">
          Mode
        </th>
      </tr>
    </thead>
  );
}

export default TableHead;
