"use client"

import { useEffect, useState } from "react"

export function WaitlistCounter() {
  const [count, setCount] = useState(148)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 2))
    }, 9000)

    return () => clearInterval(interval)
  }, [])

  return (
    <p className="mt-6 text-sm text-muted-foreground">
      <span className="text-primary font-semibold">
        {count}
      </span>{" "}
      users already joined
    </p>
  )
}
