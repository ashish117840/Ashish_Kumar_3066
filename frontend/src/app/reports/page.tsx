import { Suspense } from "react";
import { ReportCard } from "@/components/reports/report-card";
import { fetchReports } from "@/lib/api";

function renderData(data: unknown): React.ReactNode {
  if (data === null || data === undefined) {
    return <p className="text-sm text-zinc-500">No data available.</p>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <p className="text-sm text-zinc-500">No results returned.</p>;
    }

    if (typeof data[0] === "object" && data[0] !== null && !Array.isArray(data[0])) {
      const columns = Array.from(
        data.reduce<Set<string>>((set, row) => {
          Object.keys(row as Record<string, unknown>).forEach((key) => set.add(key));
          return set;
        }, new Set<string>())
      );

      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-xs text-zinc-600">
            <thead className="bg-white text-[11px] uppercase tracking-wide text-zinc-500">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-3 py-2 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column} className="px-3 py-2">
                      {formatValue((row as Record<string, unknown>)[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600">
        {data.map((value, index) => (
          <li key={index}>{formatValue(value)}</li>
        ))}
      </ul>
    );
  }

  if (typeof data === "object") {
    return (
      <dl className="grid gap-3">
        {Object.entries(data as Record<string, unknown>).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {key}
            </dt>
            <dd className="rounded-md bg-white px-3 py-2 text-sm text-zinc-600">
              {formatValue(value)}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return <p className="text-sm text-zinc-600">{formatValue(data)}</p>;
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "–";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "string") {
    const maybeDate = Date.parse(value);
    if (!Number.isNaN(maybeDate) && value.includes("T")) {
      return new Date(maybeDate).toLocaleString();
    }
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

async function ReportsContent() {
  try {
    const data = await fetchReports();

    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">
          Reports are not available yet. Trigger the aggregations on the backend and refresh this page.
        </div>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {Object.entries(data).map(([key, value]) => (
          <ReportCard
            key={key}
            title={formatTitle(key)}
            description={key.toLowerCase().includes("sql") ? "Powered by your SQL database aggregation." : "Powered by your MongoDB aggregation."}
          >
            {renderData(value)}
          </ReportCard>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-sm text-red-700">
        {(error as Error).message || "Failed to load reports. Ensure the backend endpoint is reachable."}
      </div>
    );
  }
}

function formatTitle(raw: string) {
  return raw
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Performance reports</h1>
        <p className="text-sm text-zinc-600">
          Compare SQL revenue metrics with MongoDB catalog insights. Each card renders directly from the backend aggregations so evaluators can validate end-to-end data flow.
        </p>
      </header>
      <Suspense fallback={<div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">Loading reports…</div>}>
        <ReportsContent />
      </Suspense>
    </div>
  );
}
