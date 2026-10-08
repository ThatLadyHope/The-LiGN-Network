"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import "../onboarding/onboarding.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setStatus(null);
    try {
      await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
      // Same message either way: never reveal whether an account exists.
      setStatus("If an account uses that email, a reset link is on its way.");
    } catch {
      setStatus("If an account uses that email, a reset link is on its way.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="ob-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Forgot password?</h1>
      <p className="ob-sub">Enter your email. The reset link itself verifies your inbox.</p>

      <label className="ob-label">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>

      <button className="ob-go" disabled={!/.+@.+\..+/.test(email) || busy} onClick={submit}>
        {busy ? "Sending…" : "Send reset link"}
      </button>
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
