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

async function getTunnels(): Promise<Tunnel[]> {
  const res = await fetch(`${process.env.API_URL}/tunnels`, {
    credentials: "include",
    cache: "no-store",
  })

  if (!res.ok) return []

  return res.json()
}

export default async function DevModePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const tunnels = await getTunnels()

  return <DevModeClient user={user} activeTunnels={tunnels} />
}