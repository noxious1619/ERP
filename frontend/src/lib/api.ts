export const API_BASE_URL = "http://localhost:5000/api"

/**
 * Returns headers with the JWT token from localStorage.
 * Call this only inside client components / hooks.
 */

export function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}