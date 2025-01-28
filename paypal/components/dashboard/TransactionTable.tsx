import React from "react";
import TableHead from "./table/TableHead";
import TableBody from "./table/TableBody";
import { TransactionType } from "@/lib/utils/types";

//https://tw-elements.com/docs/standard/data/tables/
function TransactionTable({
  transactions,
}: {
  transactions: TransactionType[];
}) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light text-surface dark:text-white border border-neutral-200 dark:border-white">
              <TableHead />
              <TableBody transactions={transactions} />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
