"use client";

import { useEffect } from "react";

// Registers the service worker immediately (not on window load — auditors
// and slow networks otherwise conclude none exists). Data routes are
// network-only inside the worker itself, so this is safe on every page.
export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => null);
    }
  }, []);
  return null;
}
