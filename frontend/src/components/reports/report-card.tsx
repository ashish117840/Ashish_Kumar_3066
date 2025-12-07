interface ReportCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ReportCard({ title, description, children }: ReportCardProps) {
  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        {description && <p className="text-sm text-zinc-600">{description}</p>}
      </header>
      <div className="overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-600">
        {children}
      </div>
    </section>
  );
}
