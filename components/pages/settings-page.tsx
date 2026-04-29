"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/pages/page-header";
import { NoBusinessState, PageLoading } from "@/components/pages/page-state";
import { Toast } from "@/components/ui/toast";
import { apiClient, type ApiBusiness } from "@/lib/api-client";
import { clearActiveBusinessId, getActiveBusiness, setActiveBusinessId } from "@/lib/business-context";
import { templates } from "@/lib/mock-data";

const paymentOptions = ["Naqd", "Karta", "Click", "Payme", "Bank"];

export function SettingsPage() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [businesses, setBusinesses] = useState<ApiBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    template: "minimarket",
    startingCash: "",
    paymentMethods: [] as string[],
  });

  const load = useCallback(async () => {
    const activeBusiness = await getActiveBusiness();
    const allBusinesses = await apiClient.publicBusinesses();
    setBusinesses(allBusinesses.results);
    setBusiness(activeBusiness);
    if (activeBusiness) {
      setForm({
        name: activeBusiness.name,
        ownerName: activeBusiness.owner_name,
        template: activeBusiness.template,
        startingCash: activeBusiness.starting_cash,
        paymentMethods: activeBusiness.payment_methods,
      });
    }
    setIsLoading(false);
  }, []);

  async function switchBusiness(businessId: number) {
    setActiveBusinessId(businessId);
    const nextBusiness = await apiClient.business(businessId);
    setBusiness(nextBusiness);
    setForm({
      name: nextBusiness.name,
      ownerName: nextBusiness.owner_name,
      template: nextBusiness.template,
      startingCash: nextBusiness.starting_cash,
      paymentMethods: nextBusiness.payment_methods,
    });
    setToast("Active biznes almashtirildi");
  }

  function startNewBusiness() {
    clearActiveBusinessId();
    window.location.href = "/dashboard?setup=1";
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function togglePayment(method: string) {
    setForm((current) => {
      const exists = current.paymentMethods.includes(method);
      return {
        ...current,
        paymentMethods: exists
          ? current.paymentMethods.filter((item) => item !== method)
          : [...current.paymentMethods, method],
      };
    });
  }

  async function saveSettings() {
    if (!business || !form.name.trim()) {
      setToast("Biznes nomi kerak");
      return;
    }

    const updated = await apiClient.updateBusiness(business.id, {
      name: form.name.trim(),
      owner_name: form.ownerName.trim(),
      template: form.template,
      starting_cash: form.startingCash.replace(/\s/g, "") || "0",
      payment_methods: form.paymentMethods,
    });
    setBusiness(updated);
    setToast("Sozlamalar saqlandi");
  }

  if (isLoading) {
    return <PageLoading />;
  }

  if (!business) {
    return <NoBusinessState />;
  }

  return (
    <AppShell>
      <PageHeader eyebrow={business.name} title="Sozlamalar" />
      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
          <h2 className="text-lg font-semibold">Biznes profili</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Biznes nomi" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <Field label="Mas'ul" value={form.ownerName} onChange={(value) => setForm((current) => ({ ...current, ownerName: value }))} />
            <label className="grid gap-2">
              <span className="text-sm font-medium text-[#263027]">Template</span>
              <select
                value={form.template}
                onChange={(event) => setForm((current) => ({ ...current, template: event.target.value }))}
                className="h-10 rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc]"
              >
                {templates.map((template) => (
                  <option key={template.key} value={template.key}>{template.name}</option>
                ))}
              </select>
            </label>
            <Field label="Boshlang'ich kassa" value={form.startingCash} onChange={(value) => setForm((current) => ({ ...current, startingCash: value }))} />
            <div>
              <p className="text-sm font-medium text-[#263027]">To&apos;lov turlari</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {paymentOptions.map((method) => {
                  const active = form.paymentMethods.includes(method);
                  return (
                    <button
                      key={method}
                      onClick={() => togglePayment(method)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                        active ? "border-[#17201b] bg-[#17201b] text-white" : "border-[#d9dfd6] text-[#263027]"
                      }`}
                    >
                      {method}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={saveSettings} className="h-10 rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white">
              Saqlash
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
          <h2 className="text-lg font-semibold">Joriy holat</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <Row label="ID" value={String(business.id)} />
            <Row label="Valyuta" value={business.currency} />
            <Row label="Yaratilgan" value={new Date(business.created_at).toLocaleDateString("uz-UZ")} />
            <Row label="Yangilangan" value={new Date(business.updated_at).toLocaleDateString("uz-UZ")} />
          </dl>
          <div className="mt-5 border-t border-[#e5e9e2] pt-4">
            <h3 className="font-semibold">Biznes almashtirish</h3>
            <select
              value={business.id}
              onChange={(event) => void switchBusiness(Number(event.target.value))}
              className="mt-3 h-10 w-full rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm outline-none focus:border-[#17201b]"
            >
              {businesses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button onClick={startNewBusiness} className="mt-3 h-10 w-full rounded-lg border border-[#d9dfd6] px-4 text-sm font-medium hover:bg-[#f6f8f5]">
              Yangi biznes yaratish
            </button>
          </div>
        </section>
      </div>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </AppShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#263027]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-[#d9dfd6] px-3 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc]"
      />
    </label>
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
