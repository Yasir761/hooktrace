"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"

function SuccessContent() {
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

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="p-8">Signing you in...</p>}>
      <SuccessContent />
    </Suspense>
  )
}
