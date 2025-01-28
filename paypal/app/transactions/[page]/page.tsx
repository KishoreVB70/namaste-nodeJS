import Transactions from "@/components/ServerTransactions";
import { Suspense } from "react";

export default function Page({ params }: { params: { page: string } }) {
  const page = parseInt(params.page, 10) || 1;

  return (
    <Suspense fallback={<p>Loading</p>}>
      <Transactions page={page} />
    </Suspense>
  );
}
