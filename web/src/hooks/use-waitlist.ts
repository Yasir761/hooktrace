"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useWaitlist() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCount() {
      const { count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true })

      setCount(count || 0)
      setLoading(false)
    }

    fetchCount()

    const channel = supabase
      .channel("waitlist-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "waitlist" },
        () => {
          setCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function join(email: string) {
    const { error } = await supabase
      .from("waitlist")
      .insert([{ email }])

    if (error) throw error
  }

  return { count, loading, join }
}
