import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "./nav";
import SkipLink from "./skip-link";
import ThemeProvider from "./theme-provider";
import SwRegister from "./sw-register";
import "./globals.css";
import "./ui.css";

export const metadata: Metadata = {
  title: "LiGN — Platonic human connection",
  description: "Come as you are. Leave less alone. 1-on-1 connection, temporary spaces, and listener support.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "LiGN",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body>
        <ThemeProvider />
        <SwRegister />
        <SkipLink />
        <Nav />
        <div id="main">{children}</div>
      </body>
    </html>
    </ClerkProvider>
  );
}
