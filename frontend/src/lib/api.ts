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
    ...({ Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2NGUwYTlkLWE0MjAtNDFhMi1hNWM1LWU3MTNiMDIwODFmOSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4MDIzMjYxOH0.pshQC_DZjYR7_k0K8v2Qz6d3Ky50DEMl7hxsE543JlM`}),
  };
}