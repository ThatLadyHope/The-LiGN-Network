"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { MIN_PASSWORD_LENGTH } from "@/lib/password-policy";
import PasswordField from "../password-field";
import "../onboarding/onboarding.css";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password,
      });
      if (res.status !== "complete") throw new Error("That code is invalid or expired — request a new one.");
      await setActive({ session: res.createdSessionId });
      router.push("/discover");
    } catch (e) {
      const err = (e as { errors?: { code?: string; message?: string }[] })?.errors?.[0];
      if (err?.code === "form_password_length_too_short" || err?.code === "form_password_pwned") {
        setStatus(
          err.code === "form_password_pwned"
            ? "That password has appeared in a data breach — choose a different one."
            : `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
        );
      } else {
        setStatus(e instanceof Error ? e.message : "something-went-wrong");
      }
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
      <PasswordField
        label={`New password (${MIN_PASSWORD_LENGTH}+ characters)`}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
      />

      <button className="ob-go" disabled={code.trim().length < 4 || password.length < MIN_PASSWORD_LENGTH || busy} onClick={submit}>
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
