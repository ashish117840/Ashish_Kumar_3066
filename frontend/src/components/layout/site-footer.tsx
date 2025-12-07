export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} CommerceCraft. All rights reserved.</p>
        <p className="text-xs">Built with Next.js 14, Tailwind CSS, and your custom commerce backend.</p>
      </div>
    </footer>
  );
}
