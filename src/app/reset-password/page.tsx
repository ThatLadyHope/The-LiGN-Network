"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import "../onboarding/onboarding.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (res.status !== "complete") throw new Error("That code is invalid or expired — request a new one.");
      await setActive({ session: res.createdSessionId });
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
      <h1>Choose a new password</h1>

      <label className="ob-label">
        Code from your email
        <input value={code} maxLength={6} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
      </label>
      <label className="ob-label">
        New password (8+ chars)
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

      <button className="ob-go" disabled={code.trim().length < 4 || password.length < 8 || busy} onClick={submit}>
        {busy ? "Saving…" : "Save new password"}
      </button>
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
