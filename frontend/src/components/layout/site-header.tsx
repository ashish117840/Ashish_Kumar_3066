import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "./user-menu";

const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/reports", label: "Reports" },
];

export function SiteHeader() {
  return ( 
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-zinc-900">
          CommerceCraft
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-zinc-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="text-sm text-zinc-500">Loading...</div>}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
