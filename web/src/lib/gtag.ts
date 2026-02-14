export const GA_TRACKING_ID = "G-XXXXXXX"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
