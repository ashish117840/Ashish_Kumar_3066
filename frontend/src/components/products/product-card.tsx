import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {product.category}
        </p>
        <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-3 text-sm text-zinc-600">{product.description}</p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-zinc-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-zinc-500">SKU: {product.sku}</span>
        </div>
      </div>
      {onAddToCart && (
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Add to cart
        </button>
      )}
    </article>
  );
}
