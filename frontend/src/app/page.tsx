const HIGHLIGHTS = [
  {
    title: "Unified Product Catalog",
    description:
      "Browse the MongoDB-powered catalog with server-side sorting, search, and category filters that adapt to evaluator flags.",
  },
  {
    title: "Secure Checkout",
    description:
      "JWT-protected cart and order flow that persists to SQL with Prisma, ensuring totals are calculated on the server.",
  },
  {
    title: "Actionable Insights",
    description:
      "Side-by-side SQL and MongoDB reports surface revenue trends and category performance in near real time.",
  },
];

export default function Home() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
      <section className="space-y-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-600">
          E-Commerce Development Exam Project
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Production-ready storefront built with Next.js 14 and a secure Node.js backend.
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600">
          This frontend is wired for a multi-database commerce stack: PostgreSQL handles orders, MongoDB powers rich product discovery, and JWT auth keeps sessions secure. Use the navigation to explore the live product catalog, manage your cart, review orders, and inspect analytics reports.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/products"
            className="rounded-md bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:bg-zinc-800"
          >
            Start shopping
          </a>
          <a
            href="/reports"
            className="rounded-md border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900"
          >
            View reports
          </a>
        </div>
      </section>
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-zinc-800">
            What you&apos;ll find inside
          </h2>
          <ul className="space-y-5">
            {HIGHLIGHTS.map((item) => (
              <li key={item.title} className="space-y-2">
                <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                <p className="text-sm text-zinc-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
