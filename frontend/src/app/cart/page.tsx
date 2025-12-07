import { CartContent } from "@/components/cart/cart-content";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Your cart</h1>
        <p className="text-sm text-zinc-600">
          Items and totals are loaded securely from the backend. Adjust quantities or remove items to keep the MongoDB catalog and SQL order data in sync.
        </p>
      </header>
      <CartContent />
    </div>
  );
}
