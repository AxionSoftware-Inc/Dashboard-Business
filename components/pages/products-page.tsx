"use client";

import { Minus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/pages/page-header";
import { EmptyState, NoBusinessState, PageLoading } from "@/components/pages/page-state";
import { Toast } from "@/components/ui/toast";
import { apiClient, type ApiBusiness, type ApiProduct } from "@/lib/api-client";
import { getActiveBusiness } from "@/lib/business-context";

export function ProductsPage() {
  const [business, setBusiness] = useState<ApiBusiness | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low">("all");
  const [form, setForm] = useState({ name: "", category: "", stock: "", minStock: "", salePrice: "", costPrice: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !normalized ||
        [product.name, product.category, product.sku].some((value) => value.toLowerCase().includes(normalized));
      const matchesStock = stockFilter === "all" || product.is_low_stock;
      return matchesQuery && matchesStock;
    });
  }, [products, query, stockFilter]);

  const load = useCallback(async () => {
    const activeBusiness = await getActiveBusiness();
    setBusiness(activeBusiness);
    if (activeBusiness) {
      const response = await apiClient.products(activeBusiness.id);
      setProducts(response.results);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function addProduct() {
    if (!business || !form.name.trim()) {
      setToast("Mahsulot nomini kiriting");
      return;
    }

    const payload = {
      business: business.id,
      name: form.name.trim(),
      category: form.category.trim(),
      stock: form.stock || "0",
      min_stock: form.minStock || "0",
      sale_price: form.salePrice || "0",
      cost_price: form.costPrice || "0",
      unit: "dona",
    };

    const saved = editingId ? await apiClient.updateProduct(editingId, payload) : await apiClient.createProduct(payload);
    setProducts((current) => (editingId ? current.map((product) => (product.id === editingId ? saved : product)) : [saved, ...current]));
    setForm({ name: "", category: "", stock: "", minStock: "", salePrice: "", costPrice: "" });
    setEditingId(null);
    setToast(editingId ? "Mahsulot yangilandi" : "Mahsulot qo'shildi");
  }

  function startEdit(product: ApiProduct) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      stock: product.stock,
      minStock: product.min_stock,
      salePrice: product.sale_price,
      costPrice: product.cost_price,
    });
  }

  async function deleteProduct(id: number) {
    await apiClient.deleteProduct(id);
    setProducts((current) => current.filter((product) => product.id !== id));
    setToast("Mahsulot o'chirildi");
  }

  async function adjustStock(product: ApiProduct, delta: number) {
    const updated = await apiClient.adjustProductStock(product.id, String(delta));
    setProducts((current) => current.map((item) => (item.id === product.id ? updated : item)));
    setToast(delta > 0 ? "Qoldiq oshirildi" : "Qoldiq kamaytirildi");
  }

  if (isLoading) {
    return <PageLoading />;
  }

  if (!business) {
    return <NoBusinessState />;
  }

  return (
    <AppShell>
      <PageHeader eyebrow={business?.name ?? "Business Dashboard"} title="Ombor va mahsulotlar" />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <section className="rounded-lg border border-[#dfe4dc] bg-white p-4">
          <h2 className="text-lg font-semibold">{editingId ? "Mahsulotni tahrirlash" : "Mahsulot qo'shish"}</h2>
          <div className="mt-4 grid gap-3">
            <Input label="Nomi" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <Input label="Kategoriya" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Qoldiq" value={form.stock} onChange={(value) => setForm((current) => ({ ...current, stock: value }))} />
              <Input label="Min." value={form.minStock} onChange={(value) => setForm((current) => ({ ...current, minStock: value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Sotuv" value={form.salePrice} onChange={(value) => setForm((current) => ({ ...current, salePrice: value }))} />
              <Input label="Tannarx" value={form.costPrice} onChange={(value) => setForm((current) => ({ ...current, costPrice: value }))} />
            </div>
            <button onClick={addProduct} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#17201b] px-4 text-sm font-medium text-white">
              <Plus className="h-4 w-4" />
              {editingId ? "Yangilash" : "Saqlash"}
            </button>
            {editingId ? (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", category: "", stock: "", minStock: "", salePrice: "", costPrice: "" });
                }}
                className="h-10 rounded-lg border border-[#d9dfd6] px-4 text-sm font-medium hover:bg-[#f6f8f5]"
              >
                Bekor qilish
              </button>
            ) : null}
          </div>
        </section>

        <section className="rounded-lg border border-[#dfe4dc] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#e5e9e2] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Mahsulotlar</h2>
              <p className="text-sm text-[#69756c]">Backenddan kelayotgan ombor ro&apos;yxati.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#69756c]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 rounded-lg border border-[#d9dfd6] pl-9 pr-3 text-sm outline-none focus:border-[#17201b]" placeholder="Qidirish" />
              </label>
              <button onClick={() => setStockFilter((current) => (current === "all" ? "low" : "all"))} className="h-10 rounded-lg border border-[#d9dfd6] px-3 text-sm font-medium">
                {stockFilter === "all" ? "Hammasi" : "Kam qolgan"}
              </button>
            </div>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="p-4">
              <EmptyState title="Mahsulot yo&apos;q" text="Birinchi mahsulotni formadan qo&apos;shing." />
            </div>
          ) : (
            <div className="divide-y divide-[#edf0eb]">
              {filteredProducts.map((product) => (
                <div key={product.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto_auto_auto] sm:items-center">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-[#69756c]">{product.category || "Kategoriya yo'q"} / SKU: {product.sku || "-"}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <Stat label="Qoldiq" value={product.stock} danger={product.is_low_stock} />
                    <Stat label="Sotuv" value={product.sale_price} />
                    <Stat label="Tannarx" value={product.cost_price} />
                  </div>
                  <button onClick={() => void deleteProduct(product.id)} className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-700 hover:bg-rose-50" aria-label="Mahsulotni o'chirish">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => startEdit(product)} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#69756c] hover:bg-[#f0f3ef]" aria-label="Mahsulotni tahrirlash">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => void adjustStock(product, 1)} className="flex h-9 w-9 items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50" aria-label="Qoldiqni oshirish">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button onClick={() => void adjustStock(product, -1)} className="flex h-9 w-9 items-center justify-center rounded-lg text-amber-700 hover:bg-amber-50" aria-label="Qoldiqni kamaytirish">
                    <Minus className="h-4 w-4" />
                  </button>
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

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <p className="text-[#69756c]">{label}</p>
      <strong className={danger ? "text-rose-700" : "text-[#17201b]"}>{value}</strong>
    </div>
  );
}
