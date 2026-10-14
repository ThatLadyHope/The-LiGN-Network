"use client";

import { useEffect } from "react";

// Registers the service worker once. Data routes are network-only inside
// the worker itself — registration here is unconditional and safe.
export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => null);
      });
    }
  }, []);
  return null;
}
