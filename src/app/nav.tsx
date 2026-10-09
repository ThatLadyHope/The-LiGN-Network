"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AUTH_ROUTES = ["/login", "/onboarding", "/forgot-password", "reset-password"];

export default function Nav() {
  const path = usePathname();
  if (AUTH_ROUTES.some((r) => path === r || path.startsWith(r + "/"))) return null;
  // Settings lives in the Discover side menu — the top bar stays lean and
  // underlines whichever page the user is on.
  const links = [
    ["Discover", "/discover"],
    ["Chat", "/chat"],
  ];
  return (
    <nav className="lign-nav">
      {links.map(([label, href]) => {
        const active = path === href || path.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={active ? "on" : ""}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
