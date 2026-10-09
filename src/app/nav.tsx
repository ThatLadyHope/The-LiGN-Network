"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/onboarding", "/forgot-password", "reset-password"];

export default function Nav() {
  const path = usePathname();
  if (AUTH_ROUTES.some((r) => path === r || path.startsWith(r + "/"))) return null;
  // Discover carries its own side menu (Profile + Settings): the top bar
  // stays to Discover + Chat only, so Settings is not duplicated.
  const links =
    path === "/discover" || path.startsWith("/discover/")
      ? [
          ["Discover", "/discover"],
          ["Chat", "/chat"],
        ]
      : [
          ["Discover", "/discover"],
          ["Chat", "/chat"],
          ["Settings", "/settings"],
        ];
  return (
    <nav className="lign-nav">
      {links.map(([label, href]) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
