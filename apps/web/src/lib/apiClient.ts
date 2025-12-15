import { getToken } from "./authStorage"

//***************************************
// Files for centralized API client management
// - AuthClient for authenticated requests (protected routes)
// - ApiClient for public requests
//***************************************
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiError extends Error {
  status: number;
  data: unknown;
}

/******************************************
 * Function to make API requests
 * @param path - API endpoint path
 * @param options - Request options
 * @param withAuth - Indicates if the request requires authentication
 * @return Response data
 ******************************************/
async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  // Configuration des en-têtes
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (withAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || `HTTP Error: ${res.status}`) as ApiError;
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(
      path,
      {
      method: "POST",
      body: JSON.stringify(body),
      }),
};

export const authClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }, true),
  post: <T>(path: string, body: unknown) =>
    request<T>(
      path,
      {
        method: "POST",
        body: JSON.stringify(body)
      },
      true
    ),
};
