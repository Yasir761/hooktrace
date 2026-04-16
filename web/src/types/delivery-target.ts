export type DeliveryTarget = {
    id: string
    name: string
    type: string
    config: Record<string, unknown>
    enabled: boolean
    createdAt: string
    lastUsed: string
    successCount: number
    errorCount: number
    providers: string[]
  }