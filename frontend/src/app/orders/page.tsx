import { Suspense } from "react";
import { OrdersTable } from "@/components/orders/orders-table";
import { fetchOrders } from "@/lib/api";

async function OrdersContent() {
  try {
    const orders = await fetchOrders();
    return <OrdersTable orders={orders} />;
  } catch (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
        {(error as Error).message || "Failed to load orders. Please ensure you are logged in."}
      </div>
    );
  }
}

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Order history</h1>
        <p className="text-sm text-zinc-600">
          Review completed orders synced from the SQL database. Each line item reflects the price captured at checkout.
        </p>
      </header>
      <Suspense fallback={<div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">Loading orders…</div>}>
        <OrdersContent />
      </Suspense>
    </div>
  );
}
