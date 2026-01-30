
"use client";

import { useEffect } from "react";

export function useEventUpdates(
  eventId: number,
  onUpdate: (data: unknown) => void
) {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/ws/events");

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.event_id === eventId) {
        onUpdate(data);
      }
    };

    return () => ws.close();
  }, [eventId, onUpdate]);
}
