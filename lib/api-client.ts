const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export type ApiUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type ApiBusiness = {
  id: number;
  name: string;
  owner_name: string;
  template: string;
  currency: string;
  starting_cash: string;
  payment_methods: string[];
  created_at: string;
  updated_at: string;
};

export type CreateBusinessPayload = {
  name: string;
  owner_name?: string;
  template: string;
  currency?: string;
  starting_cash?: string;
  payment_methods?: string[];
};

export type ApiProduct = {
  id: number;
  business: number;
  name: string;
  category: string;
  sku: string;
  unit: string;
  sale_price: string;
  cost_price: string;
  stock: string;
  min_stock: string;
  is_active: boolean;
  is_low_stock: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateProductPayload = {
  business: number;
  name: string;
  category?: string;
  sku?: string;
  unit?: string;
  sale_price?: string;
  cost_price?: string;
  stock?: string;
  min_stock?: string;
  is_active?: boolean;
};

export type ApiTransaction = {
  id: number;
  business: number;
  type: "sale" | "income" | "expense" | "debt" | "inventory";
  title: string;
  amount: string;
  payment_method: string;
  linked_to: string;
  note: string;
  happened_at: string;
  created_at: string;
  updated_at: string;
};

export type CreateTransactionPayload = {
  business: number;
  type: ApiTransaction["type"];
  title: string;
  amount: string;
  payment_method?: string;
  linked_to?: string;
  note?: string;
  happened_at: string;
};

export type ApiDebt = {
  id: number;
  business: number;
  contact_name: string;
  direction: "receivable" | "payable";
  amount: string;
  due_date: string | null;
  is_closed: boolean;
  note: string;
  created_at: string;
  updated_at: string;
};

export type CreateDebtPayload = {
  business: number;
  contact_name: string;
  direction: ApiDebt["direction"];
  amount: string;
  due_date?: string | null;
  is_closed?: boolean;
  note?: string;
};

export type ApiDashboardSummary = {
  revenue: number;
  expenses: number;
  profit_estimate: number;
  receivable: number;
  payable: number;
  transactions_count: number;
  open_debts_count: number;
  by_type: Record<string, number>;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type RequestOptions = RequestInit & {
  token?: string;
};

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const { token, headers, ...requestInit } = init;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...requestInit,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  register: (payload: { username: string; password: string; email?: string; first_name?: string }) =>
    request<ApiUser>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { username: string; password: string }) =>
    request<AuthTokens>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: (token: string) => request<ApiUser>("/auth/me/", { token }),
  businesses: (token: string) => request<PaginatedResponse<ApiBusiness>>("/businesses/", { token }),
  business: (businessId: number) => request<ApiBusiness>(`/businesses/${businessId}/`),
  createBusiness: (payload: CreateBusinessPayload) =>
    request<ApiBusiness>("/businesses/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateBusiness: (businessId: number, payload: Partial<CreateBusinessPayload>) =>
    request<ApiBusiness>(`/businesses/${businessId}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  publicBusinesses: () => request<PaginatedResponse<ApiBusiness>>("/businesses/"),
  products: (businessId: number) => request<PaginatedResponse<ApiProduct>>(`/products/?business=${businessId}`),
  createProduct: (payload: CreateProductPayload) =>
    request<ApiProduct>("/products/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateProduct: (id: number, payload: Partial<CreateProductPayload>) =>
    request<ApiProduct>(`/products/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteProduct: (id: number) =>
    request<void>(`/products/${id}/`, {
      method: "DELETE",
    }),
  adjustProductStock: (id: number, delta: string) =>
    request<ApiProduct>(`/products/${id}/adjust_stock/`, {
      method: "POST",
      body: JSON.stringify({ delta }),
    }),
  transactions: (businessId: number) => request<PaginatedResponse<ApiTransaction>>(`/transactions/?business=${businessId}`),
  createTransaction: (payload: CreateTransactionPayload) =>
    request<ApiTransaction>("/transactions/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateTransaction: (id: number, payload: Partial<CreateTransactionPayload>) =>
    request<ApiTransaction>(`/transactions/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteTransaction: (id: number) =>
    request<void>(`/transactions/${id}/`, {
      method: "DELETE",
    }),
  debts: (businessId: number) => request<PaginatedResponse<ApiDebt>>(`/debts/?business=${businessId}`),
  createDebt: (payload: CreateDebtPayload) =>
    request<ApiDebt>("/debts/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateDebt: (id: number, payload: Partial<CreateDebtPayload>) =>
    request<ApiDebt>(`/debts/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteDebt: (id: number) =>
    request<void>(`/debts/${id}/`, {
      method: "DELETE",
    }),
  dashboardSummary: (businessId: number, params?: { dateFrom?: string; dateTo?: string }) => {
    const searchParams = new URLSearchParams({ business: String(businessId) });
    if (params?.dateFrom) {
      searchParams.set("date_from", params.dateFrom);
    }
    if (params?.dateTo) {
      searchParams.set("date_to", params.dateTo);
    }
    return request<ApiDashboardSummary>(`/reports/dashboard/summary/?${searchParams.toString()}`);
  },
};
