import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiGN — Get started",
  description: "Create your LiGN identity. Minimal setup, no pressure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#FAF7F2", color: "#2E2A26" }}>
        <a
          href="#main"
          style={{
            position: "absolute",
            left: "-9999px",
          }}
          onFocus={(e) => {
            e.currentTarget.style.left = "12px";
            e.currentTarget.style.top = "12px";
            e.currentTarget.style.zIndex = "100";
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.padding = "8px 16px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.left = "-9999px";
          }}
        >
          Skip to content
        </a>
        <div id="main">{children}</div>
      </body>
    </html>
  );
}
