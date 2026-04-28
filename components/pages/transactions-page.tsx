"use client";

import { Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { OperationDrawer } from "@/components/dashboard/operation-drawer";
import { PageHeader } from "@/components/pages/page-header";
import { EmptyState, NoBusinessState, PageLoading } from "@/components/pages/page-state";
import { Toast } from "@/components/ui/toast";
import { apiClient, type ApiBusiness, type ApiTransaction } from "@/lib/api-client";
import { getActiveBusiness } from "@/lib/business-context";
import { formatMoney } from "@/lib/format";
import type { OperationDraft, OperationType } from "@/lib/types";

const operationTypeMap: Record<OperationType, ApiTransaction["type"]> = {
  Savdo: "sale",
  Kirim: "income",
  Chiqim: "expense",
  Qarz: "debt",
  Ombor: "inventory",
};

export function TransactionsPage() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [operationType, setOperationType] = useState<OperationType>("Savdo");
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | ApiTransaction["type"]>("all");

  const filteredTransactions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return transactions.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.title, item.payment_method, item.linked_to, item.note].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      const matchesType = type === "all" || item.type === type;
      return matchesQuery && matchesType;
    });
  }, [query, transactions, type]);

  const load = useCallback(async () => {
    const activeBusiness = await getActiveBusiness();
    setBusiness(activeBusiness);
    if (activeBusiness) {
      const response = await apiClient.transactions(activeBusiness.id);
      setTransactions(response.results);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function openDrawer(type: OperationType = "Savdo") {
    setOperationType(type);
    setIsDrawerOpen(true);
  }

  async function saveOperation(operation: OperationDraft) {
    if (!business) {
      return;
    }

    const created = await apiClient.createTransaction({
      business: business.id,
      type: operationTypeMap[operation.type],
      title: operation.title,
      amount: String(operation.amount),
      payment_method: operation.method,
      linked_to: operation.link,
      note: operation.note,
      happened_at: new Date().toISOString(),
    });
    setTransactions((current) => [created, ...current]);
    setToast("Operatsiya saqlandi");
  }

  async function deleteTransaction(id: number) {
    await apiClient.deleteTransaction(id);
    setTransactions((current) => current.filter((item) => item.id !== id));
    setToast("Operatsiya o'chirildi");
  }

  if (isLoading) {
    return <PageLoading />;
  }

  if (!business) {
    return <NoBusinessState />;
  }

  return (
    <AppShell onCreateOperation={() => openDrawer("Savdo")}>
      <PageHeader
        eyebrow={business?.name ?? "Business Dashboard"}
        title="Operatsiyalar"
        action={
          <button onClick={() => openDrawer("Savdo")} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#17201b] px-3 text-sm font-medium text-white">
            <Plus className="h-4 w-4" />
            Operatsiya
          </button>
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[#dfe4dc] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#e5e9e2] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Jurnal</h2>
              <p className="text-sm text-[#69756c]">Backenddagi barcha kirim, chiqim va savdo yozuvlari.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#69756c]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 rounded-lg border border-[#d9dfd6] pl-9 pr-3 text-sm outline-none focus:border-[#17201b]" placeholder="Qidirish" />
              </label>
              <select value={type} onChange={(event) => setType(event.target.value as "all" | ApiTransaction["type"])} className="h-10 rounded-lg border border-[#d9dfd6] bg-white px-3 text-sm">
                <option value="all">Hammasi</option>
                <option value="sale">Savdo</option>
                <option value="income">Kirim</option>
                <option value="expense">Chiqim</option>
                <option value="debt">Qarz</option>
                <option value="inventory">Ombor</option>
              </select>
            </div>
          </div>
          {filteredTransactions.length === 0 ? (
            <div className="p-4">
              <EmptyState title="Operatsiya yo'q" text="Birinchi kirim yoki chiqimni qo'shing." />
            </div>
          ) : (
            <div className="divide-y divide-[#edf0eb]">
              {filteredTransactions.map((item) => (
                <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{item.title}</h3>
                      <span className="rounded-md bg-[#f0f3ef] px-2 py-1 text-xs font-medium text-[#5d675f]">{item.type}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#69756c]">{item.payment_method || "-"} / {item.linked_to || "Umumiy"} / {new Date(item.happened_at).toLocaleString("uz-UZ")}</p>
                  </div>
                  <strong className={Number(item.amount) < 0 ? "text-rose-700" : "text-emerald-700"}>{formatMoney(Number(item.amount))}</strong>
                  <button onClick={() => void deleteTransaction(item.id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-700 hover:bg-rose-50" aria-label="Operatsiyani o'chirish">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <OperationDrawer key={`${operationType}-${isDrawerOpen}`} isOpen={isDrawerOpen} initialType={operationType} onClose={() => setIsDrawerOpen(false)} onSave={saveOperation} />
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </AppShell>
  );
}
