"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/onboarding", "/forgot-password", "reset-password"];

export default function Nav() {
  const path = usePathname();
  if (AUTH_ROUTES.some((r) => path === r || path.startsWith(r + "/"))) return null;
  return (
    <nav className="lign-nav">
      <Link href="/discover">Discover</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}
