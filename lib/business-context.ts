import { apiClient, type ApiBusiness } from "@/lib/api-client";

const activeBusinessStorageKey = "business-dashboard-active-business-id";

export function getActiveBusinessId() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(activeBusinessStorageKey);
  return value ? Number(value) : null;
}

export function setActiveBusinessId(businessId: number) {
  window.localStorage.setItem(activeBusinessStorageKey, String(businessId));
}

export function clearActiveBusinessId() {
  window.localStorage.removeItem(activeBusinessStorageKey);
}

export async function getActiveBusiness(): Promise<ApiBusiness | null> {
  const businessId = getActiveBusinessId();
  if (!businessId) {
    return null;
  }

  try {
    return await apiClient.business(businessId);
  } catch {
    clearActiveBusinessId();
    return null;
  }
}
