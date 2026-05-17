import { apiClient, type ApiUser, type AuthTokens } from "@/lib/api-client";

const accessTokenKey = "business-dashboard-access-token";
const refreshTokenKey = "business-dashboard-refresh-token";
const userStorageKey = "business-dashboard-user";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(accessTokenKey);
}

export function getStoredUser(): ApiUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(userStorageKey);
  return value ? (JSON.parse(value) as ApiUser) : null;
}

export function storeSession(tokens: AuthTokens, user?: ApiUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(accessTokenKey, tokens.access);
  window.localStorage.setItem(refreshTokenKey, tokens.refresh);
  if (user) {
    window.localStorage.setItem(userStorageKey, JSON.stringify(user));
  }
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(accessTokenKey);
  window.localStorage.removeItem(refreshTokenKey);
  window.localStorage.removeItem(userStorageKey);
  window.localStorage.removeItem("business-dashboard-active-business-id");
}

export async function login(username: string, password: string) {
  const tokens = await apiClient.login({ username, password });
  storeSession(tokens);
  const user = await apiClient.me(tokens.access);
  storeSession(tokens, user);
  return user;
}

export async function register(payload: { username: string; password: string; email?: string; first_name?: string }) {
  await apiClient.register(payload);
  return login(payload.username, payload.password);
}
