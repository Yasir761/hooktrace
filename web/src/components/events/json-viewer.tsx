"use client"

import { motion } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function JsonViewer({
  title,
  data,
}: {
  title: string
  data: Record<string, unknown>
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(
      JSON.stringify(data, null, 2)
    )

    setCopied(true)
    toast.success("JSON copied to clipboard")

    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {title}
        </h3>

        <Button
          size="sm"
          variant="ghost"
          onClick={copy}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* JSON Block */}
      <div className="relative rounded-xl border border-border bg-muted/40">
        <pre
          className="max-h-[420px] overflow-auto p-4 text-xs leading-relaxed
                     font-mono text-foreground"
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </motion.div>
  )
}
