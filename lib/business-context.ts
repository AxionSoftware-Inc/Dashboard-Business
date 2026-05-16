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
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(activeBusinessStorageKey, String(businessId));
}

export function clearActiveBusinessId() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(activeBusinessStorageKey);
}

export async function getActiveBusiness(): Promise<ApiBusiness | null> {
  const businessId = getActiveBusinessId();

  if (businessId) {
    try {
      return await apiClient.business(businessId);
    } catch {
      clearActiveBusinessId();
    }
  }

  const businesses = await apiClient.publicBusinesses();
  const firstBusiness = businesses.results[0] ?? null;

  if (firstBusiness) {
    setActiveBusinessId(firstBusiness.id);
  }

  return firstBusiness;
}

export async function createAndActivateBusiness(payload: Parameters<typeof apiClient.createBusiness>[0]) {
  const business = await apiClient.createBusiness(payload);
  setActiveBusinessId(business.id);
  return business;
}

export async function switchActiveBusiness(businessId: number): Promise<ApiBusiness | null> {
  if (!businessId) {
    return null;
  }

  const business = await apiClient.business(businessId);
  setActiveBusinessId(business.id);
  return business;
}
