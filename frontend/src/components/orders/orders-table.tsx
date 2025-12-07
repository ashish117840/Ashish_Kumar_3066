import type { OrderSummary } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function OrdersTable({ orders }: { orders: OrderSummary[] }) {
  if (!orders.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
        No orders found yet. Complete a checkout to see your history here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th className="px-6 py-3 font-medium">Order ID</th>
            <th className="px-6 py-3 font-medium">Created</th>
            <th className="px-6 py-3 font-medium">Items</th>
            <th className="px-6 py-3 font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 text-sm text-zinc-700">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 font-semibold text-zinc-900">{order.id}</td>
              <td className="px-6 py-4">{dateFormatter.format(new Date(order.createdAt))}</td>
              <td className="px-6 py-4">
                <ul className="space-y-1 text-xs text-zinc-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} × {item.name} @ {currency.format(item.priceAtPurchase)}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-6 py-4 font-semibold text-zinc-900">{currency.format(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
