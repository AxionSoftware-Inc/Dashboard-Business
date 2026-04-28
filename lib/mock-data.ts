import type {
  CashflowItem,
  DashboardTotals,
  Debt,
  Product,
  QuickAction,
  Template,
  Transaction,
} from "@/lib/types";

export const templates: Template[] = [
  {
    key: "minimarket",
    name: "Minimarket",
    label: "Savdo, ombor, qarz daftari",
    icon: "store",
    modules: ["Savdo", "Ombor", "Qarzlar", "Kassa"],
    accent: "bg-emerald-600",
  },
  {
    key: "cafe",
    name: "Kafe",
    label: "Tannarx, kunlik tushum, xarajat",
    icon: "receipt",
    modules: ["Menu", "Xarajat", "Foyda", "Yetkazuvchi"],
    accent: "bg-rose-600",
  },
  {
    key: "service",
    name: "Servis",
    label: "Buyurtma, ustalar, ehtiyot qism",
    icon: "settings",
    modules: ["Buyurtma", "Usta", "Detal", "To'lov"],
    accent: "bg-sky-600",
  },
  {
    key: "wholesale",
    name: "Ulgurji savdo",
    label: "Narx list, mijoz qarzi, ombor",
    icon: "boxes",
    modules: ["Narx list", "Mijozlar", "Ombor", "Hisobot"],
    accent: "bg-amber-600",
  },
];

export const totals: DashboardTotals = {
  revenue: 18_750_000,
  cost: 10_940_000,
  expenses: 2_360_000,
  receivable: 3_230_000,
  profit: 5_450_000,
  cash: 6_400_000,
  bank: 12_100_000,
  salesCount: 83,
  discount: 310_000,
};

export const transactions: Transaction[] = [
  {
    id: "trx-1",
    type: "Savdo",
    title: "Chakana savdo",
    amount: 4_280_000,
    method: "Naqd + karta",
    time: "Bugun, 10:42",
    status: "Hisoblandi",
    linkedTo: "Ombor va foyda",
  },
  {
    id: "trx-2",
    type: "Chiqim",
    title: "Yetkazib beruvchi to'lovi",
    amount: -1_750_000,
    method: "Bank",
    time: "Bugun, 09:20",
    status: "Omborga bog'landi",
    linkedTo: "Tannarx",
  },
  {
    id: "trx-3",
    type: "Kirim",
    title: "Mijoz qarzi yopildi",
    amount: 920_000,
    method: "Click",
    time: "Kecha, 18:10",
    status: "Qarzdan ayirildi",
    linkedTo: "Qarz daftari",
  },
  {
    id: "trx-4",
    type: "Chiqim",
    title: "Ijara va kommunal",
    amount: -680_000,
    method: "Naqd",
    time: "Kecha, 15:05",
    status: "Xarajatga kirdi",
    linkedTo: "Operatsion xarajat",
  },
];

export const debts: Debt[] = [
  { id: "debt-1", name: "Akmal market", amount: 2_450_000, due: "2 kun", direction: "receivable" },
  { id: "debt-2", name: "Nodira opa", amount: 780_000, due: "Bugun", direction: "receivable" },
  { id: "debt-3", name: "Best Plast", amount: -1_350_000, due: "5 kun", direction: "payable" },
];

export const products: Product[] = [
  { id: "prd-1", name: "Coca-Cola 1.5L", category: "Ichimlik", stock: 18, sold: 42, profit: 336_000, minStock: 10 },
  { id: "prd-2", name: "Un 5kg", category: "Oziq-ovqat", stock: 7, sold: 24, profit: 264_000, minStock: 12 },
  { id: "prd-3", name: "Shakar 1kg", category: "Oziq-ovqat", stock: 3, sold: 31, profit: 155_000, minStock: 10 },
  { id: "prd-4", name: "Yog' 1L", category: "Oziq-ovqat", stock: 12, sold: 19, profit: 228_000, minStock: 8 },
];

export const cashflow: CashflowItem[] = [
  { label: "Tushum", value: totals.revenue, tone: "good" },
  { label: "Tannarx", value: -totals.cost, tone: "bad" },
  { label: "Xarajat", value: -totals.expenses, tone: "bad" },
  { label: "Sof foyda", value: totals.profit, tone: "neutral" },
];

export const quickActions: QuickAction[] = [
  { label: "Savdo qo'shish", value: "Tovar, narx, to'lov turi", type: "Savdo" },
  { label: "Xarajat yozish", value: "Ijara, maosh, yetkazuvchi", type: "Chiqim" },
  { label: "Qarz yopish", value: "Mijoz yoki yetkazuvchi", type: "Qarz" },
  { label: "Ombor kirimi", value: "Tovar va tannarx", type: "Ombor" },
];
