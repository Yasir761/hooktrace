// "use client";

// import { apiFetch } from "@/lib/api";

// export function ReplayButton({ eventId }: { eventId: number }) {
//   const replay = async () => {
//     console.log("ReplayButton received eventId:", eventId);

//     if (!Number.isInteger(eventId)) {
//       console.error("Replay called with invalid eventId", eventId);
//       return;
//     }

//     await apiFetch(`/events/${eventId}/replay`, {
//       method: "POST",
//     });
//   };

//   return (
//     <button
//       onClick={replay}
//       className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
//     >
//       Replay
//     </button>
//   );
// }






"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export function ReplayButton({ eventId }: { eventId: number }) {
  const [loading, setLoading] = useState(false);

  async function handleReplay() {
    console.log("ReplayButton received eventId:", eventId);

    setLoading(true);
    try {
      await apiFetch(`/events/${eventId}/replay`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Replay failed", err);
      alert("Replay failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReplay}
      disabled={loading}
      className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Replaying…" : "Replay Event"}
    </button>
  );
}
