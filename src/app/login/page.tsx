"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import "../onboarding/onboarding.css";

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) router.push("/discover");
  }, [isSignedIn, router]);

  async function submit() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await signIn.create({ identifier: email.trim(), password });
      if (res.status !== "complete") throw new Error("Email or password did not match.");
      await setActive({ session: res.createdSessionId });
      // Recovery by simply logging in + outdated-agreement routing, as before.
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
        throw new Error("That account finished deleting. Join again to start fresh.");
      }
      // No local profile yet (Clerk user, never onboarded) or outdated
      // agreement: route accordingly instead of dropping into the app.
      if (!st?.status) {
        router.push("/onboarding/needs");
        return;
      }
      const { AGREEMENT_VERSION } = await import("@/lib/agreement");
      if (st.status.agreementVersion !== AGREEMENT_VERSION) {
        router.push("/agreement");
        return;
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
