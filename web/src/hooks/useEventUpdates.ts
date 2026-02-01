"use client";

import { useEffect } from "react";

type EventUpdate = {
  event_id: number;
  status: string;
  attempt_count: number;
};

export function useEventUpdates(
  eventId: number,
  onUpdate: (update: EventUpdate) => void
) {
  useEffect(() => {
    if (!eventId) return;

    const ws = new WebSocket("ws://localhost:3001/ws/events");

    ws.onmessage = (e) => {
      try {
        const data: EventUpdate = JSON.parse(e.data);
        if (data.event_id === eventId) {
          onUpdate(data);
        }
      } catch {}
    };

    return () => ws.close();
  }, [eventId, onUpdate]);
}
