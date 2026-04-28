"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ActionPlan } from "@/components/dashboard/action-plan";
import { DebtPanel } from "@/components/dashboard/debt-panel";
import { InventoryPanel } from "@/components/dashboard/inventory-panel";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { Onboarding } from "@/components/dashboard/onboarding";
import { OperationDrawer } from "@/components/dashboard/operation-drawer";
import { ProfitFormula } from "@/components/dashboard/profit-formula";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ReportsPanel } from "@/components/dashboard/reports-panel";
import { SummaryPanel } from "@/components/dashboard/summary-panel";
import { TemplatePicker } from "@/components/dashboard/template-picker";
import { TopBar } from "@/components/dashboard/top-bar";
import { TransactionJournal } from "@/components/dashboard/transaction-journal";
import { Toast } from "@/components/ui/toast";
import {
  type ApiBusiness,
  type ApiDashboardSummary,
  type ApiDebt,
  type ApiProduct,
  type ApiTransaction,
  apiClient,
} from "@/lib/api-client";
import { clearActiveBusinessId, getActiveBusiness, setActiveBusinessId } from "@/lib/business-context";
import { quickActions, templates } from "@/lib/mock-data";
import type {
  BusinessProfile,
  CashflowItem,
  DashboardTotals,
  Debt,
  OperationDraft,
  OperationType,
  Product,
  TemplateKey,
  Transaction,
} from "@/lib/types";

const fallbackTotals: DashboardTotals = {
  revenue: 0,
  cost: 0,
  expenses: 0,
  receivable: 0,
  profit: 0,
  cash: 0,
  bank: 0,
  salesCount: 0,
  discount: 0,
};

const operationTypeMap: Record<OperationType, ApiTransaction["type"]> = {
  Savdo: "sale",
  Kirim: "income",
  Chiqim: "expense",
  Qarz: "debt",
  Ombor: "inventory",
};

const transactionTypeLabel: Record<ApiTransaction["type"], Transaction["type"]> = {
  sale: "Savdo",
  income: "Kirim",
  expense: "Chiqim",
  debt: "Kirim",
  inventory: "Kirim",
};

export function BusinessDashboard() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<TemplateKey | null>(null);
  const [summary, setSummary] = useState<ApiDashboardSummary | null>(null);
  const [journalItems, setJournalItems] = useState<Transaction[]>([]);
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);
  const [debtItems, setDebtItems] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOperationOpen, setIsOperationOpen] = useState(false);
  const [operationType, setOperationType] = useState<OperationType>("Savdo");
  const [toast, setToast] = useState<string | null>(null);
  const [isSetupMode, setIsSetupMode] = useState(false);

  const activeTemplateKey = selectedTemplateKey ?? normalizeTemplateKey(business?.template) ?? "minimarket";
  const activeTemplate = useMemo(
    () => templates.find((template) => template.key === activeTemplateKey) ?? templates[0],
    [activeTemplateKey],
  );

  const totals = useMemo(() => mapSummaryToTotals(summary, business), [business, summary]);
  const cashflow = useMemo(() => mapSummaryToCashflow(summary), [summary]);

  const loadBusinessData = useCallback(async (businessId: number) => {
    const [nextSummary, nextTransactions, nextProducts, nextDebts] = await Promise.all([
      apiClient.dashboardSummary(businessId),
      apiClient.transactions(businessId),
      apiClient.products(businessId),
      apiClient.debts(businessId),
    ]);

    setSummary(nextSummary);
    setJournalItems(nextTransactions.results.map(mapApiTransaction));
    setInventoryItems(nextProducts.results.map(mapApiProduct));
    setDebtItems(nextDebts.results.map(mapApiDebt));
  }, []);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (window.location.search.includes("setup=1")) {
        clearActiveBusinessId();
        window.history.replaceState(null, "", "/dashboard");
        setIsSetupMode(true);
        setBusiness(null);
        return;
      }

      const activeBusiness = await getActiveBusiness();
      setBusiness(activeBusiness);
      setSelectedTemplateKey(normalizeTemplateKey(activeBusiness?.template));

      if (activeBusiness) {
        await loadBusinessData(activeBusiness.id);
      }
    } catch {
      setError("Backend API bilan aloqa bo'lmadi. Server ishlayotganini tekshiring.");
    } finally {
      setIsLoading(false);
    }
  }, [loadBusinessData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInitialData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadInitialData]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function completeOnboarding(profile: BusinessProfile) {
    setError(null);

    try {
      const nextBusiness = await apiClient.createBusiness({
        name: profile.businessName,
        owner_name: profile.ownerName,
        template: profile.templateKey,
        currency: "UZS",
        starting_cash: profile.startingCash.replace(/\s/g, "") || "0",
        payment_methods: profile.paymentMethods,
      });
      setActiveBusinessId(nextBusiness.id);
      setBusiness(nextBusiness);
      setSelectedTemplateKey(profile.templateKey);
      await loadBusinessData(nextBusiness.id);
      window.history.replaceState(null, "", "/dashboard");
      setIsSetupMode(false);
      setToast("Biznes yaratildi");
    } catch {
      setError("Biznes yaratishda xatolik bo'ldi.");
    }
  }

  function openOperation(type: OperationType = "Savdo") {
    setOperationType(type);
    setIsOperationOpen(true);
  }

  function resetOnboarding() {
    clearActiveBusinessId();
    setBusiness(null);
    setSummary(null);
    setJournalItems([]);
    setInventoryItems([]);
    setDebtItems([]);
    setSelectedTemplateKey(null);
    setIsSetupMode(true);
  }

  async function saveOperation(operation: OperationDraft) {
    if (!business) {
      setError("Avval biznes yarating.");
      return;
    }

    try {
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

      setJournalItems((current) => [mapApiTransaction(created), ...current]);
      const nextSummary = await apiClient.dashboardSummary(business.id);
      setSummary(nextSummary);
      setToast(`${operation.title} backendga saqlandi`);
    } catch {
      setError("Operatsiyani saqlashda xatolik bo'ldi.");
    }
  }

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!business || isSetupMode) {
    return (
      <>
        <Onboarding onComplete={completeOnboarding} />
        {error ? <Toast message={error} onClose={() => setError(null)} /> : null}
      </>
    );
  }

  return (
    <AppShell onCreateOperation={() => openOperation("Savdo")}>
      <TopBar
        businessName={business.name}
        onCreateOperation={() => openOperation("Savdo")}
        onResetOnboarding={resetOnboarding}
      />

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <section className="space-y-5">
          <TemplatePicker templates={templates} activeKey={activeTemplateKey} onSelect={setSelectedTemplateKey} />
          <MetricsGrid totals={totals} />

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <TransactionJournal transactions={journalItems} />
            <ProfitFormula cashflow={cashflow} activeTemplate={activeTemplate} />
          </div>

          <InventoryPanel products={inventoryItems} />
        </section>

        <aside className="space-y-5">
          <SummaryPanel totals={totals} />
          <QuickActions actions={quickActions} onCreateOperation={openOperation} />
          <DebtPanel debts={debtItems} />
          <ReportsPanel />
          <ActionPlan />
        </aside>
      </div>

      <OperationDrawer
        key={`${operationType}-${isOperationOpen ? "open" : "closed"}`}
        isOpen={isOperationOpen}
        initialType={operationType}
        onClose={() => setIsOperationOpen(false)}
        onSave={saveOperation}
      />
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
      {error ? <Toast message={error} onClose={() => setError(null)} /> : null}
    </AppShell>
  );
}

function normalizeTemplateKey(value?: string): TemplateKey | null {
  if (value === "minimarket" || value === "cafe" || value === "service" || value === "wholesale") {
    return value;
  }

  return null;
}

function mapSummaryToTotals(summary: ApiDashboardSummary | null, business: ApiBusiness | null): DashboardTotals {
  if (!summary) {
    return fallbackTotals;
  }

  return {
    revenue: Number(summary.revenue),
    cost: 0,
    expenses: Number(summary.expenses),
    receivable: Number(summary.receivable),
    profit: Number(summary.profit_estimate),
    cash: Number(business?.starting_cash ?? 0),
    bank: 0,
    salesCount: summary.transactions_count,
    discount: 0,
  };
}

function mapSummaryToCashflow(summary: ApiDashboardSummary | null): CashflowItem[] {
  const revenue = Number(summary?.revenue ?? 0);
  const expenses = Number(summary?.expenses ?? 0);
  const profit = Number(summary?.profit_estimate ?? 0);

  return [
    { label: "Tushum", value: revenue, tone: "good" },
    { label: "Tannarx", value: 0, tone: "bad" },
    { label: "Xarajat", value: -expenses, tone: "bad" },
    { label: "Sof foyda", value: profit, tone: "neutral" },
  ];
}

function mapApiTransaction(item: ApiTransaction): Transaction {
  return {
    id: String(item.id),
    type: transactionTypeLabel[item.type],
    title: item.title,
    amount: Number(item.amount),
    method: item.payment_method || "Kiritilmagan",
    time: new Date(item.happened_at).toLocaleString("uz-UZ"),
    status: "Backend",
    linkedTo: item.linked_to || "Umumiy",
  };
}

function mapApiProduct(item: ApiProduct): Product {
  return {
    id: String(item.id),
    name: item.name,
    category: item.category || "Umumiy",
    stock: Number(item.stock),
    sold: 0,
    profit: Math.max(0, Number(item.sale_price) - Number(item.cost_price)),
    minStock: Number(item.min_stock),
  };
}

function mapApiDebt(item: ApiDebt): Debt {
  return {
    id: String(item.id),
    name: item.contact_name,
    amount: item.direction === "payable" ? -Number(item.amount) : Number(item.amount),
    due: item.due_date ? new Date(item.due_date).toLocaleDateString("uz-UZ") : "Muddat yo'q",
    direction: item.direction,
  };
}

function DashboardLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f5f2] px-4 text-[#17201b]">
      <div className="w-full max-w-sm rounded-lg border border-[#dfe4dc] bg-white p-4">
        <div className="h-4 w-32 rounded bg-[#e7ece4]" />
        <div className="mt-4 h-8 w-full rounded bg-[#eef2eb]" />
        <div className="mt-3 h-8 w-2/3 rounded bg-[#eef2eb]" />
      </div>
    </main>
  );
}
