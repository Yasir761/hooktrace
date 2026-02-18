"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function SuccessPage() {
  const params = useSearchParams()
  const token = params.get("token")

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
      window.location.href = "/dashboard"
    }
  }, [token])

  return <p className="p-8">Signing you in...</p>
}