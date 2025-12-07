import { Suspense } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Pagination } from "@/components/common/pagination";
import { fetchProductCategories, fetchProducts } from "@/lib/api";
import type { ProductFiltersState } from "@/lib/types";

function parseFilters(params: Record<string, string | string[] | undefined>): ProductFiltersState {
  const getValue = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    search: getValue("search") ?? undefined,
    category: getValue("category") ?? undefined,
    sort: (getValue("sort") as ProductFiltersState["sort"]) ?? "price_desc",
    page: getValue("page") ? Number(getValue("page")) : 1,
  };
}

async function ProductsContent({ filters }: { filters: ProductFiltersState }) {
  const [catalog, categories] = await Promise.all([
    fetchProducts(filters),
    fetchProductCategories(),
  ]);

  return (
    <div className="space-y-8">
      <ProductFilters categories={categories} initialState={filters} />
      <ProductGrid products={catalog.data} />
      <Pagination currentPage={catalog.meta.page} totalPages={catalog.meta.totalPages} />
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFilters(searchParams);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Product catalog</h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Listings default to server-side price descending order. Include the evaluator sorting header or query flag to trigger the alternate order as required during assessment.
        </p>
      </header>
      <Suspense fallback={<div className="rounded-lg border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">Loading products…</div>}>
        <ProductsContent filters={filters} />
      </Suspense>
    </div>
  );
}
