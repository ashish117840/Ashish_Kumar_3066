"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductFiltersState } from "@/lib/types";

interface ProductFiltersProps {
  categories: string[];
  initialState: ProductFiltersState;
}

const SORT_LABELS: Record<Exclude<ProductFiltersState["sort"], undefined>, string> = {
  price_desc: "Price: High to Low",
  price_asc: "Price: Low to High",
};

export function ProductFilters({ categories, initialState }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialState.search ?? "");
  const [category, setCategory] = useState(initialState.category ?? "");
  const [sort, setSort] = useState(initialState.sort ?? "price_desc");

  useEffect(() => {
    setSearch(initialState.search ?? "");
  }, [initialState.search]);

  const sortedCategories = useMemo(() => {
    return ["", ...categories].filter((value, index, self) => self.indexOf(value) === index);
  }, [categories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateQuery({ search });
    }, 350);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const updateQuery = (next: Partial<ProductFiltersState>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }
      params.set(key, String(value));
    });

    params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    updateQuery({ category: value });
  };

  const handleSortChange = (value: ProductFiltersState["sort"]) => {
    setSort(value);
    updateQuery({ sort: value });
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSort("price_desc");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="product-search" className="text-xs font-semibold uppercase text-zinc-500">
            Search products
          </label>
          <input
            id="product-search"
            type="search"
            value={search}
            placeholder="Search by name or SKU"
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="product-category" className="text-xs font-semibold uppercase text-zinc-500">
            Category
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="min-w-[12rem] rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          >
            {sortedCategories.map((value) => (
              <option key={value || "all"} value={value}>
                {value ? value : "All categories"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="product-sort" className="text-xs font-semibold uppercase text-zinc-500">
            Sort by
          </label>
          <select
            id="product-sort"
            value={sort}
            onChange={(event) => handleSortChange(event.target.value as ProductFiltersState["sort"])}
            className="min-w-[12rem] rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="h-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reset filters
        </button>
      </div>
      {isPending && (
        <p className="mt-3 text-xs text-zinc-400">Updating results…</p>
      )}
    </section>
  );
}
