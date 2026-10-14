import type { Metadata } from "next";
import Link from "next/link";
import "../onboarding/onboarding.css";

// Fully static: no session, no Clerk, no fetching — safe to serve offline
// from the service worker cache.
export const metadata: Metadata = {
  title: "LiGN is offline",
};

export default function OfflinePage() {
  return (
    <main className="ob-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>You are offline</h1>
      <p className="ob-sub">
        LiGN needs a connection to connect you — fitting, we know. Your words are safe; nothing
        was lost.
      </p>
      <Link className="ob-go ui-btn" href="/">
        Try again
      </Link>
      <p className="ob-hint">Check your connection, then tap Try again.</p>
    </main>
  );
}
