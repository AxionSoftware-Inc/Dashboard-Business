export type TemplateKey = "minimarket" | "cafe" | "service" | "wholesale";

export type Template = {
  key: TemplateKey;
  name: string;
  label: string;
  icon: "store" | "receipt" | "settings" | "boxes";
  modules: string[];
  accent: string;
};

export type TransactionType = "Kirim" | "Chiqim" | "Savdo";
export type OperationType = TransactionType | "Qarz" | "Ombor";

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  method: string;
  time: string;
  status: string;
  linkedTo: string;
};

export type Debt = {
  id: string;
  name: string;
  amount: number;
  due: string;
  direction: "receivable" | "payable";
};

export type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  sold: number;
  profit: number;
  minStock: number;
};

export type CashflowItem = {
  label: string;
  value: number;
  tone: "good" | "bad" | "neutral";
};

export type DashboardTotals = {
  revenue: number;
  cost: number;
  expenses: number;
  receivable: number;
  profit: number;
  cash: number;
  bank: number;
  salesCount: number;
  discount: number;
};

export type QuickAction = {
  label: string;
  value: string;
  type: OperationType;
  defaultTitle?: string;
  defaultLink?: string;
};

export type BusinessProfile = {
  businessName: string;
  ownerName: string;
  templateKey: TemplateKey;
  startingCash: string;
  paymentMethods: string[];
};

export type OperationDraft = {
  type: OperationType;
  title: string;
  amount: number;
  method: string;
  link: string;
  date: string;
  note: string;
};
