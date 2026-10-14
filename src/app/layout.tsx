import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "./nav";
import SkipLink from "./skip-link";
import ThemeProvider from "./theme-provider";
import "./globals.css";
import "./ui.css";

export const metadata: Metadata = {
  title: "LiGN — Platonic human connection",
  description: "Come as you are. Leave less alone. 1-on-1 connection, temporary spaces, and listener support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body>
        <ThemeProvider />
        <SkipLink />
        <Nav />
        <div id="main">{children}</div>
      </body>
    </html>
    </ClerkProvider>
  );
}
