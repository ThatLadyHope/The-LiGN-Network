"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth-client";
import BackButton from "../back-button";
import "../onboarding/onboarding.css";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await authClient.resetPassword({ newPassword: password, token });
      if (res.error) throw new Error("That link is invalid or expired — request a new one.");
      router.push("/login");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "something-went-wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <main className="ob-wrap">
        <h1>Reset password</h1>
        <p className="ob-status" role="status">
          This page needs the link from your email.
        </p>
      </main>
    );
  }

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Choose a new password</h1>

      <label className="ob-label">
        New password (10+ chars)
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

      <button className="ob-go" disabled={password.length < 10 || busy} onClick={submit}>
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
