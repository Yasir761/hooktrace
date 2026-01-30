"use client";

import { apiFetch } from "@/lib/api";

export function ReplayButton({ eventId }: { eventId: number }) {
  const replay = async () => {
    console.log("ReplayButton received eventId:", eventId);

    if (!Number.isInteger(eventId)) {
      console.error("Replay called with invalid eventId", eventId);
      return;
    }

    await apiFetch(`/events/${eventId}/replay`, {
      method: "POST",
    });
  };

  return (
    <button
      onClick={replay}
      className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
    >
      Replay
    </button>
  );
}
