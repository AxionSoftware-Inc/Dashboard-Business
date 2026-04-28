"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/pages/page-header";
import { NoBusinessState, PageLoading } from "@/components/pages/page-state";
import type { ApiBusiness } from "@/lib/api-client";
import { getActiveBusiness } from "@/lib/business-context";

export function SettingsPage() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setBusiness(await getActiveBusiness());
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
      <PageHeader eyebrow={business?.name ?? "Business Dashboard"} title="Sozlamalar" />
      <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
          <h2 className="text-lg font-semibold">Biznes profili</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <Row label="Nomi" value={business?.name ?? "-"} />
            <Row label="Mas'ul" value={business?.owner_name || "-"} />
            <Row label="Template" value={business?.template ?? "-"} />
            <Row label="Valyuta" value={business?.currency ?? "UZS"} />
            <Row label="To'lov turlari" value={business?.payment_methods?.join(", ") || "-"} />
          </dl>
        </section>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f6f8f5] px-3 py-2">
      <dt className="text-[#69756c]">{label}</dt>
      <dd className="font-medium text-[#17201b]">{value}</dd>
    </div>
  );
}
