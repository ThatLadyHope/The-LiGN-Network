import type { Metadata } from "next";
import Link from "next/link";
import SkipLink from "./skip-link";
import ThemeProvider from "./theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiGN — Get started",
  description: "Create your LiGN identity. Minimal setup, no pressure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider />
        <SkipLink />
        <nav className="lign-nav">
          <Link href="/discover">Discover</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/settings">Settings</Link>
        </nav>
        <div id="main">{children}</div>
      </body>
    </html>
  );
}
