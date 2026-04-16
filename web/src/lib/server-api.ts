import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function serverApiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {

  const cookieStore = cookies()
  const accessToken = (await cookieStore).get("access_token")?.value

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Cookie: `access_token=${accessToken}` } : {}),
      ...(options?.headers || {}),
    },
    cache: "no-store",
  })

  const text = await res.text()

  if (res.status === 404) return null

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${text}`)
  }

  return JSON.parse(text)
}