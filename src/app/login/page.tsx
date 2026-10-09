"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import "../onboarding/onboarding.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) throw new Error("Email or password did not match.");
      // Recovery by simply logging in: a pending deletion inside its window
      // is cancelled automatically; past it, the account is gone for good.
      const st = await fetch("/api/account/status").then((r) =>
        r.ok ? r.json().catch(() => null) : null,
      );
      if (st?.status?.pendingDeletionAt) {
        const rr = await fetch("/api/account/restore", { method: "POST" });
        if (rr.ok) {
          setStatus("Welcome back — your deletion request is cancelled.");
          setTimeout(() => router.push("/discover"), 1500);
          return;
        }
        await authClient.signOut();
        throw new Error("That account finished deleting. Join again to start fresh.");
      }
      router.push("/discover");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "something-went-wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="ob-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Welcome back</h1>
      <p className="ob-sub">No rush. Sign in whenever you are ready.</p>

      <label className="ob-label">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>
      <label className="ob-label">
        Password
        <span className="ob-password">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="ob-show" onClick={() => setShow((s) => !s)} aria-pressed={show}>
            {show ? "Hide" : "Show"}
          </button>
        </span>
      </label>

      <button className="ob-go" disabled={!email || !password || busy} onClick={submit}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="ob-alt">
        <Link href="/forgot-password">Forgot password?</Link>
      </p>
      <p className="ob-alt">
        New here? <Link href="/onboarding">Join LiGN</Link>
      </p>
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
