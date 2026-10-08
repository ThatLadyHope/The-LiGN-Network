"use client";

export default function SkipLink() {
  return (
    <a
      href="#main"
      style={{ position: "absolute", left: "-9999px" }}
      onFocus={(e) => {
        const s = e.currentTarget.style;
        s.left = "12px";
        s.top = "12px";
        s.zIndex = "100";
        s.background = "#fff";
        s.padding = "8px 16px";
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = "-9999px";
      }}
    >
      Skip to content
    </a>
  );
}
