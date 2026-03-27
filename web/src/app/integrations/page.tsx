import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import IntegrationsClient from "@/app/integrations/integrations-client"

type Provider = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  webhooks: string[]
  status: "active" | "available" | "coming_soon"
}

// Provider metadata
const PROVIDERS: Provider[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage subscriptions",
    icon: "💳",
    color: "bg-purple-500",
    category: "payments",
    webhooks: ["payment_intent.succeeded", "customer.created", "charge.failed"],
    status: "active", // active | available | coming_soon
  },
  {
    id: "github",
    name: "GitHub",
    description: "Track repository events and actions",
    icon: "🐙",
    color: "bg-gray-900 dark:bg-gray-700",
    category: "developer",
    webhooks: ["push", "pull_request", "issues"],
    status: "active",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Monitor store orders and inventory",
    icon: "🛍️",
    color: "bg-emerald-600",
    category: "ecommerce",
    webhooks: ["orders/create", "products/update", "customers/create"],
    status: "active",
  },
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Track payments and refunds",
    icon: "💰",
    color: "bg-blue-600",
    category: "payments",
    webhooks: ["payment.captured", "payment.failed", "refund.created"],
    status: "active",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Receive workspace events and messages",
    icon: "💬",
    color: "bg-purple-600",
    category: "communication",
    webhooks: ["message.channels", "app_mention", "reaction_added"],
    status: "active",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Monitor server events and messages",
    icon: "🎮",
    color: "bg-indigo-600",
    category: "communication",
    webhooks: ["message.create", "guild.member.add", "interaction.create"],
    status: "active",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Track page and database changes",
    icon: "📝",
    color: "bg-gray-800 dark:bg-gray-600",
    category: "productivity",
    webhooks: ["page.created", "database.updated", "block.updated"],
    status: "active",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Monitor database and auth events",
    icon: "⚡",
    color: "bg-emerald-500",
    category: "database",
    webhooks: ["db.insert", "db.update", "auth.user.created"],
    status: "active",
  },
]

export default async function IntegrationsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  // In production, fetch user's connected integrations from DB
  // For now, using mock data
  const connectedIntegrations = ["stripe", "github"]

  return (
    <IntegrationsClient
      providers={PROVIDERS}
      connectedIntegrations={connectedIntegrations}
      user={user}
    />
  )
}