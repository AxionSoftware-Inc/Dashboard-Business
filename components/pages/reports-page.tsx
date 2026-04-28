"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/pages/page-header";
import { NoBusinessState, PageLoading } from "@/components/pages/page-state";
import { apiClient, type ApiBusiness, type ApiDashboardSummary } from "@/lib/api-client";
import { getActiveBusiness } from "@/lib/business-context";
import { formatMoney } from "@/lib/format";

export function ReportsPage() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [summary, setSummary] = useState<ApiDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    const activeBusiness = await getActiveBusiness();
    setBusiness(activeBusiness);
    if (activeBusiness) {
      setSummary(await apiClient.dashboardSummary(activeBusiness.id));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!business) {
    return <NoBusinessState />;
  }

  return (
    <AppShell>
      <PageHeader eyebrow={business?.name ?? "Business Dashboard"} title="Hisobotlar" />
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <ReportCard label="Tushum" value={formatMoney(Number(summary?.revenue ?? 0))} />
        <ReportCard label="Xarajat" value={formatMoney(Number(summary?.expenses ?? 0))} />
        <ReportCard label="Taxminiy foyda" value={formatMoney(Number(summary?.profit_estimate ?? 0))} />
        <ReportCard label="Ochiq qarzlar" value={`${summary?.open_debts_count ?? 0} ta`} />
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
