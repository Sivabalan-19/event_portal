export type UserRole = "student" | "organizer" | "superadmin";

export const AUTH_TOKEN_KEY = "token";

function decodeBase64Url(value: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return window.atob(padded);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem(AUTH_TOKEN_KEY) ||
    window.sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
}

export function clearStoredToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getRoleFromToken(token?: string | null): UserRole | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const decodedPayload = decodeBase64Url(parts[1]);
  if (!decodedPayload) {
    return null;
  }

  try {
    const payload = JSON.parse(decodedPayload) as { role?: string };

    if (
      payload.role === "student" ||
      payload.role === "organizer" ||
      payload.role === "superadmin"
    ) {
      return payload.role;
    }

    return null;
  } catch {
    return null;
  }
}

export function getDefaultRouteForRole(role: UserRole) {
  if (role === "student") {
    return "/student/dashboard";
  }

  if (role === "organizer") {
    return "/faculty/dashboard";
  }

  return "/admin/dashboard";
}
