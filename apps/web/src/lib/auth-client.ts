/**
 * Auth client helpers
 */

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("token");
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

export function clearAuth(): void {
  setToken(null);
}

