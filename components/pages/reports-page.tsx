"use client";

import { CalendarDays } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/pages/page-header";
import { NoBusinessState, PageLoading } from "@/components/pages/page-state";
import { apiClient, type ApiBusiness, type ApiDashboardSummary } from "@/lib/api-client";
import { getActiveBusiness } from "@/lib/business-context";
import { formatMoney } from "@/lib/format";

type Period = "today" | "week" | "month";

const periods: Array<{ key: Period; label: string }> = [
  { key: "today", label: "Bugun" },
  { key: "week", label: "Hafta" },
  { key: "month", label: "Oy" },
];

export function ReportsPage() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [summary, setSummary] = useState<ApiDashboardSummary | null>(null);
  const [period, setPeriod] = useState<Period>("today");
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const activeBusiness = await getActiveBusiness();
    setBusiness(activeBusiness);
    if (activeBusiness) {
      setSummary(await apiClient.dashboardSummary(activeBusiness.id, getPeriodRange(period)));
    }
    setIsLoading(false);
  }, [period]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const breakdown = useMemo(() => {
    const revenue = Number(summary?.revenue ?? 0);
    const expenses = Number(summary?.expenses ?? 0);
    const receivable = Number(summary?.receivable ?? 0);
    const total = Math.max(revenue + expenses + receivable, 1);

    return [
      { label: "Tushum", value: revenue, width: `${Math.round((revenue / total) * 100)}%`, color: "bg-emerald-600" },
      { label: "Xarajat", value: expenses, width: `${Math.round((expenses / total) * 100)}%`, color: "bg-rose-600" },
      { label: "Qarz", value: receivable, width: `${Math.round((receivable / total) * 100)}%`, color: "bg-sky-600" },
    ];
  }, [summary]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!business) {
    return <NoBusinessState />;
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={business.name}
        title="Hisobotlar"
        action={
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#69756c]" />
            <div className="flex rounded-lg border border-[#d9dfd6] bg-white p-1">
              {periods.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setPeriod(item.key)}
                  className={`h-8 rounded-md px-3 text-sm font-medium ${
                    period === item.key ? "bg-[#17201b] text-white" : "text-[#69756c]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        }
      />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ReportCard label="Tushum" value={formatMoney(Number(summary?.revenue ?? 0))} />
          <ReportCard label="Xarajat" value={formatMoney(Number(summary?.expenses ?? 0))} />
          <ReportCard label="Taxminiy foyda" value={formatMoney(Number(summary?.profit_estimate ?? 0))} />
          <ReportCard label="Ochiq qarzlar" value={`${summary?.open_debts_count ?? 0} ta`} />
        </section>

        <aside className="rounded-lg border border-[#dfe4dc] bg-white p-4">
          <h2 className="text-lg font-semibold">Pul oqimi tarkibi</h2>
          <p className="mt-1 text-sm text-[#69756c]">Davr tanlovi UI tayyor, backend filter keyingi bosqichda ulanadi.</p>
          <div className="mt-5 space-y-4">
            {breakdown.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[#69756c]">{formatMoney(item.value)}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#edf0eb]">
                  <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function ReportCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-lg border border-[#dfe4dc] bg-white p-4">
      <p className="text-sm font-medium text-[#69756c]">{label}</p>
      <strong className="mt-2 block text-xl font-semibold">{value}</strong>
    </article>
  );
}

function getPeriodRange(period: Period) {
  const now = new Date();
  const end = toDateInput(now);
  const start = new Date(now);

  if (period === "week") {
    start.setDate(now.getDate() - 6);
  }

  if (period === "month") {
    start.setDate(1);
  }

  return {
    dateFrom: toDateInput(start),
    dateTo: end,
  };
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}
