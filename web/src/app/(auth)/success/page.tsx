"use client"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token")

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
      router.replace("/dashboard")
    }
  }, [token, router])

  return <p className="p-8">Signing you in...</p>
}