import { Badge } from "@/components/ui/badge";

type Status = "pending" | "delivered" | "failed";

export function StatusBadge({ status }: { status: Status }) {
  const variant =
    status === "delivered"
      ? "default"
      : status === "failed"
      ? "destructive"
      : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
}
