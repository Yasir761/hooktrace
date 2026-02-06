const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}





export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    return null; // ← KEY CHANGE
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}