"use client";

import { Check, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/pages/page-header";
import { EmptyState, NoBusinessState, PageLoading } from "@/components/pages/page-state";
import { Toast } from "@/components/ui/toast";
import { apiClient, type ApiBusiness, type ApiDebt } from "@/lib/api-client";
import { getActiveBusiness } from "@/lib/business-context";
import { formatMoney } from "@/lib/format";

export function DebtsPage() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [debts, setDebts] = useState<ApiDebt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<"all" | ApiDebt["direction"]>("all");
  const [form, setForm] = useState({ name: "", amount: "", direction: "receivable" as ApiDebt["direction"] });

  const filteredDebts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return debts.filter((debt) => {
      const matchesQuery = !normalized || debt.contact_name.toLowerCase().includes(normalized);
      const matchesDirection = direction === "all" || debt.direction === direction;
      return matchesQuery && matchesDirection;
    });
  }, [debts, direction, query]);

  const load = useCallback(async () => {
    const activeBusiness = await getActiveBusiness();
    setBusiness(activeBusiness);
    if (activeBusiness) {
      const response = await apiClient.debts(activeBusiness.id);
      setDebts(response.results);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function addDebt() {
    if (!business || !form.name.trim() || !form.amount.trim()) {
      setToast("Ism va summa kerak");
      return;
    }

    const created = await apiClient.createDebt({
      business: business.id,
      contact_name: form.name.trim(),
      amount: form.amount.replace(/\s/g, ""),
      direction: form.direction,
      is_closed: false,
    });
    setDebts((current) => [created, ...current]);
    setForm({ name: "", amount: "", direction: "receivable" });
    setToast("Qarz qo'shildi");
  }

  async function closeDebt(id: number) {
    const updated = await apiClient.updateDebt(id, { is_closed: true });
    setDebts((current) => current.map((debt) => (debt.id === id ? updated : debt)).filter((debt) => !debt.is_closed));
    setToast("Qarz yopildi");
  }

  async function deleteDebt(id: number) {
    await apiClient.deleteDebt(id);
    setDebts((current) => current.filter((debt) => debt.id !== id));
    setToast("Qarz o'chirildi");
  }

  if (isLoading) {
    return <PageLoading />;
  }

  if (!business) {
    return <NoBusinessState />;
  }

  return (
    <AppShell>
      <PageHeader eyebrow={business?.name ?? "Business Dashboard"} title="Qarz daftari" />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
          <h2 className="text-lg font-semibold">Qarz qo&apos;shish</h2>
          <div className="mt-4 grid gap-3">
            <Input label="Mijoz/yetkazuvchi" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <Input label="Summa" value={form.amount} onChange={(value) => setForm((current) => ({ ...current, amount: value }))} />
            <select value={form.direction} onChange={(event) => setForm((current) => ({ ...current, direction: event.target.value as ApiDebt["direction"] }))} className="h-10 rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm">
              <option value="receivable">Biz olamiz</option>
              <option value="payable">Biz beramiz</option>
            </select>
            <button onClick={addDebt} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white">
              <Plus className="h-4 w-4" />
              Saqlash
            </button>
          </div>
        </section>
        <section className="rounded-lg border border-[#dfe4dc] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#e5e9e2] p-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-lg font-semibold">Ochiq qarzlar</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#69756c]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 rounded-lg border border-[#d9dfd6] pl-9 pr-3 text-sm outline-none focus:border-[#17201b]" placeholder="Qidirish" />
              </label>
              <select value={direction} onChange={(event) => setDirection(event.target.value as "all" | ApiDebt["direction"])} className="h-10 rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm">
                <option value="all">Hammasi</option>
                <option value="receivable">Biz olamiz</option>
                <option value="payable">Biz beramiz</option>
              </select>
            </div>
          </div>
          {filteredDebts.length === 0 ? (
            <div className="p-4"><EmptyState title="Qarz yo&apos;q" text="Qarz yozuvlari shu yerda chiqadi." /></div>
          ) : (
            <div className="divide-y divide-[#edf0eb]">
              {filteredDebts.map((debt) => (
                <div key={debt.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <h3 className="font-medium">{debt.contact_name}</h3>
                    <p className="text-sm text-[#69756c]">{debt.direction === "receivable" ? "Biz olamiz" : "Biz beramiz"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong className={debt.direction === "receivable" ? "text-emerald-700" : "text-rose-700"}>{formatMoney(Number(debt.amount))}</strong>
                    <button onClick={() => void closeDebt(debt.id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50" aria-label="Qarzni yopish">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => void deleteDebt(debt.id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-700 hover:bg-rose-50" aria-label="Qarzni o'chirish">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </AppShell>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#263027]">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-lg border border-[#d9dfd6] px-3 text-sm outline-none focus:border-[#17201b] focus:ring-2 focus:ring-[#dbe8dc]" />
    </label>
  );
}
