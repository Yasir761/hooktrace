"use client"

import { Copy } from "lucide-react"

export default function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
    >
      <Copy className="w-3.5 h-3.5" />
      Copy
    </button>
  )
}