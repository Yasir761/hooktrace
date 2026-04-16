


"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Send,
  CheckCircle2,
  Clock,
  Settings,
  Trash2,
  Power,
  PowerOff,
  ExternalLink,
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { DeliveryTarget } from "@/types/delivery-target"

type TargetType = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  configFields: {
    name: string
    label: string
    type: string
    placeholder?: string
    options?: string[]
    required: boolean
  }[]
}

type User = {
  email: string
  avatar_url?: string
}

export default function DeliveryTargetsClient({
  user,
  deliveryTargets: initialTargets,
  targetTypes,
}: {
  user: User
  deliveryTargets: DeliveryTarget[]
  targetTypes: TargetType[]
}) {
  const [targets, setTargets] = useState(initialTargets)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  
  const handleToggle = async (id: string) => {
    const target = targets.find(t => t.id === id)
    if (!target) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-targets/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !target.enabled })
      })

      setTargets(
        targets.map((t) =>
          t.id === id ? { ...t, enabled: !t.enabled } : t
        )
      )
    } catch (error) {
      console.error('Toggle failed:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this target?")) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-targets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      setTargets(targets.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleCreate = async (newTarget: DeliveryTarget) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-targets`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTarget)
      })

      const created = await res.json()
      setTargets([created, ...targets])
      return created
    } catch (error) {
      console.error('Create failed:', error)
      throw error
    }
  }

  const filteredTargets = targets.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Delivery Targets</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserNav user={user} />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-10 p-2 border rounded-md"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List */}
        {filteredTargets.map((target) => (
          <div key={target.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{target.name}</h3>
                <p className="text-sm text-muted-foreground">{target.type}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleToggle(target.id)}>
                  {target.enabled ? <PowerOff /> : <Power />}
                </button>
                <button onClick={() => handleDelete(target.id)}>
                  <Trash2 />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded"
        >
          <Plus className="w-4 h-4" />
          Create Target
        </button>

        {/* Example Create */}
        {showCreateModal && (
          <button
            onClick={() =>
              handleCreate({
                id: Date.now().toString(),
                name: "New Target",
                type: "webhook",
                config: {},
                enabled: true,
                createdAt: new Date().toISOString(),
                lastUsed: new Date().toISOString(),
                successCount: 0,
                errorCount: 0,
                providers: [],
              })
            }
          >
            Confirm Create
          </button>
        )}
      </div>
    </div>
  )
}