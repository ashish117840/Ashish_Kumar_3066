"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages = useMemo(() => {
    const visible: number[] = [];
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
        visible.push(page);
      }
    }
    return visible;
  }, [currentPage, totalPages]);

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: true });
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-8 flex items-center justify-between">
      <button
        type="button"
        onClick={() => updatePage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Previous
      </button>
      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const shouldRenderEllipsis =
            previousPage && page - previousPage > 1;

          return (
            <span key={page} className="flex items-center gap-2">
              {shouldRenderEllipsis && <span className="text-sm text-zinc-400">…</span>}
              <button
                type="button"
                onClick={() => updatePage(page)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  page === currentPage
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                {page}
              </button>
            </span>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Next
      </button>
    </nav>
  );
}
