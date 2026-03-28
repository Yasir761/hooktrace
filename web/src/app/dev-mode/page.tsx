import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import DevModeClient from "./dev-mode-client"

type Tunnel = {
  id: string
  name: string
  localUrl: string
  publicUrl: string
  status: "active" | "paused" | "error"
  createdAt: string
  requestCount: number
  lastRequest: string | null
}

export default async function DevModePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  // In production, fetch active tunnels from database
  const activeTunnels: Tunnel[] = [
    {
      id: "tunnel-1",
      name: "My Local Server",
      localUrl: "http://localhost:3000",
      publicUrl: "https://hook-abc123.hooktrace.dev",
      status: "active",
      createdAt: "2026-03-28T10:00:00.000Z",
      requestCount: 47,
      lastRequest: "2026-03-28T10:28:00.000Z",
    },
  ]

  return <DevModeClient user={user} activeTunnels={activeTunnels} />
}