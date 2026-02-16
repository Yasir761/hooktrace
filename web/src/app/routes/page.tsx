"use client"

import { useEffect, useState } from "react"

type Route = {
  id: number
  token: string
  route: string
  mode: string
  dev_target?: string
  prod_target?: string
  created_at: string
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [routeName, setRouteName] = useState("")

  const API = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchRoutes = async () => {
      const res = await fetch(`${API}/routes`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? ""}`,
        },
      })

      if (!res.ok) return

      const data = await res.json()
      setRoutes(data.items)
    }

    fetchRoutes()
  }, [])

  const createRoute = async () => {
    const res = await fetch(`${API}/routes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? ""}`,
      },
      body: JSON.stringify({ route: routeName }),
    })

    if (!res.ok) {
      alert("Failed")
      return
    }

    alert("Route created!")
    location.reload()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">Webhook Routes</h1>

      <div className="flex gap-3">
        <input
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          placeholder="order.created"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={createRoute}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      <div className="space-y-4">
        {routes.map((r) => (
          <div key={r.id} className="border p-4 rounded-lg space-y-2">
            <div className="font-medium">{r.route}</div>
            <div className="text-sm text-muted-foreground">
              Relay: <code>/r/{r.token}/{r.route}</code>
            </div>
            <div className="text-xs text-muted-foreground">
              Mode: {r.mode}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}