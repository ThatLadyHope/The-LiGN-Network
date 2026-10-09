"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.localStorage.getItem("lign-theme") === "dark" ? "dark" : "light";
}

export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  window.localStorage.setItem("lign-theme", t);
}

// Mounted once in the root layout: restores the saved theme before paint.
export default function ThemeProvider() {
  const [, setTick] = useState(0);
  useEffect(() => {
    applyTheme(getTheme());
    setTick((t) => t + 1);
  }, []);
  return null;
}
