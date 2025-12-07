"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/api";
import type { CartItem, CartSummary } from "@/lib/types";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type CartState = "idle" | "loading" | "ready" | "error" | "checkingOut";

type CheckoutResponse = {
  id: string;
  total: number;
};

export function CartContent() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [state, setState] = useState<CartState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(
    null
  );

  const fetchCart = useCallback(async () => {
    let apiBase: string;

    try {
      apiBase = getApiBaseUrl();
    } catch (envError) {
      setError((envError as Error).message);
      setState("error");
      return;
    }

    try {
      setState("loading");
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/cart`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load cart. Please sign in and try again.");
      }

      const payload = (await response.json()) as CartSummary;
      setCart(payload);
      setState("ready");
      setCheckoutResult(null);
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (quantity < 1) {
        return;
      }

      try {
        const apiBase = getApiBaseUrl();
        const response = await fetch(
          `${apiBase.replace(/\/$/, "")}/cart/${item.productId}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update cart. Please try again.");
        }

        const payload = (await response.json()) as CartSummary;
        setCart(payload);
      } catch (err) {
        setError((err as Error).message);
      }
    },
    []
  );

  const removeItem = useCallback(async (item: CartItem) => {
    try {
      const apiBase = getApiBaseUrl();
      const response = await fetch(
        `${apiBase.replace(/\/$/, "")}/cart/${item.productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item. Please try again.");
      }

      const payload = (await response.json()) as CartSummary;
      setCart(payload);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const checkout = useCallback(async () => {
    try {
      const apiBase = getApiBaseUrl();
      setState("checkingOut");
      const response = await fetch(`${apiBase.replace(/\/$/, "")}/checkout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Checkout failed. Please verify your cart and try again.");
      }

      const payload = (await response.json()) as CheckoutResponse;
      setCheckoutResult(payload);
      await fetchCart();
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }, [fetchCart]);

  const totalItems = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  if (state === "loading" || state === "idle") {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">
        Loading your cart…
      </div>
    );
  }

  if (state === "error" && error) {
    return (
      <div className="space-y-4 rounded-xl border border-red-200 bg-red-50 p-10 text-sm text-red-700">
        <p>{error}</p>
        <button
          type="button"
          onClick={fetchCart}
          className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
        Your cart is empty. Visit the products page to add items.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">SKU</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Quantity</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 text-sm text-zinc-700">
            {cart.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-medium text-zinc-900">{item.name}</td>
                <td className="px-6 py-4">{item.sku}</td>
                <td className="px-6 py-4">{currency.format(item.price)}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item, Number(event.target.value))}
                    className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-zinc-900">
                  {currency.format(item.price * item.quantity)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-sm text-zinc-600">
          <p>
            <span className="font-semibold text-zinc-900">Subtotal:</span> {currency.format(cart.subtotal)}
          </p>
          <p>
            <span className="font-semibold text-zinc-900">Tax:</span> {currency.format(cart.tax)}
          </p>
          <p className="text-base font-semibold text-zinc-900">
            Order total: {currency.format(cart.total)} for {totalItems} item{totalItems === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <button
            type="button"
            onClick={checkout}
            disabled={state === "checkingOut"}
            className="min-w-[12rem] rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "checkingOut" ? "Processing…" : "Checkout"}
          </button>
          {checkoutResult && (
            <p className="text-xs text-zinc-500">
              Order #{checkoutResult.id} confirmed for {currency.format(checkoutResult.total)}.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
