import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "./nav";
import SkipLink from "./skip-link";
import ThemeProvider from "./theme-provider";
import "./globals.css";
import "./ui.css";

export const metadata: Metadata = {
  title: "LiGN — Get started",
  description: "Create your LiGN identity. Minimal setup, no pressure.",
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
