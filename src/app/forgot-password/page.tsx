"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { DISPOSABLE_EMAIL_MESSAGE, isDisposableEmail } from "@/lib/email-policy";
import "../onboarding/onboarding.css";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      if (isDisposableEmail(email)) {
        setSent(false);
        setStatus(DISPOSABLE_EMAIL_MESSAGE);
        return;
      }
      await signIn.create({ strategy: "reset_password_email_code", identifier: email.trim() });
      // Same message either way: never reveal whether an account exists.
      setSent(true);
      setStatus("If an account uses that email, a reset code is on its way.");
    } catch {
      setSent(true);
      setStatus("If an account uses that email, a reset code is on its way.");
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
      <p className="ob-sub">Enter your email. The code itself verifies your inbox.</p>

      <label className="ob-label">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>

      <button className="ob-go" disabled={!/.+@.+\..+/.test(email) || busy} onClick={submit}>
        {busy ? "Sending…" : "Send reset code"}
      </button>
      {sent && (
        <p className="ob-hint">
          Code requested for {email} — <a href="/reset-password">enter it here</a>.
        </p>
      )}
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
