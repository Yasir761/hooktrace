"use client";

import { useEffect, useState } from "react";

type Event = {
  id: number;
  status: string;
  attempt_count?: number | null;
};

export function EventLiveView({ event }: { event: Event }) {
  console.log("[EventLiveView] render", event.id);

  const [status, setStatus] = useState(event.status);
  const [attempt, setAttempt] = useState<number | null>(
    event.attempt_count ?? null
  );

  useEffect(() => {
    let alive = true;
    const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const wsUrl = `${apiUrl.replace(/^http/, "ws")}/ws/events`;
  const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (alive) console.log("[ws] connected");
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.event_id === event.id) {
        setStatus(data.status);
        setAttempt(data.attempt_count ?? null);
      }
    };

    ws.onerror = () => {
      // intentionally ignored (React dev mode causes noisy reconnects)
    };

    return () => {
      alive = false;
      ws.close();
      console.log("[ws] disconnected");
    };
  }, [event.id]);

  const color =
    status === "delivered"
      ? "bg-green-500"
      : status === "failed"
      ? "bg-red-500"
      : status === "retrying"
      ? "bg-orange-500"
      : "bg-yellow-500";

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 text-xs rounded text-white ${color}`}>
        {status}
      </span>

      {attempt !== null && (
        <span className="text-xs text-muted-foreground">
          attempt {attempt}
        </span>
      )}
    </div>
  );
}
