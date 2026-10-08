import type { Metadata } from "next";
import SkipLink from "./skip-link";

export const metadata: Metadata = {
  title: "LiGN — Get started",
  description: "Create your LiGN identity. Minimal setup, no pressure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#FAF7F2", color: "#2E2A26" }}>
        <SkipLink />
        <div id="main">{children}</div>
      </body>
    </html>
  );
}
