"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ReplayButton({ eventId }: { eventId: number }) {
  const [loading, setLoading] = useState(false);

  async function replay() {
    setLoading(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/replay`,
        { method: "POST" }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={replay}
      disabled={loading}
    >
      Replay
    </Button>
  );
}
