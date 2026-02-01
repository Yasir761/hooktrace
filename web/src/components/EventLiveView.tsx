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
    const ws = new WebSocket("ws://localhost:3001/ws/events");

    ws.onopen = () => {
      console.log("[ws] connected");
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        if (data.event_id !== event.id) return;

        console.log("[ws:update]", data);

        if (data.status) setStatus(data.status);
        if (typeof data.attempt_count === "number") {
          setAttempt(data.attempt_count);
        }
      } catch (err) {
        console.error("[ws] invalid message", err);
      }
    };

    ws.onerror = (err) => {
      console.error("[ws] error", err);
    };

    return () => {
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
