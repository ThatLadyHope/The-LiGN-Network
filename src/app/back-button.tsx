"use client";

import { useRouter } from "next/navigation";

// Back chevron for drill-down screens (needs, rooms, profile, settings,
// auth helpers). Roots (discover, chat, signup) get none — they ARE home.
export default function BackButton() {
  const router = useRouter();
  function back() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/discover");
    }
  }
  return (
    <button type="button" className="lign-back" onClick={back} aria-label="Go back">
      ←
    </button>
  );
}
