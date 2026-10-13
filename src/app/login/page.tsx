"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSignIn, useUser } from "@clerk/nextjs";
import PasswordField from "../password-field";
import "../onboarding/onboarding.css";

function friendlySignInError(e: unknown): string {
  const err = (e as { errors?: { code?: string; message?: string }[] })?.errors?.[0];
  if (!err) return e instanceof Error && e.message ? e.message : "something-went-wrong";
  switch (err.code) {
    case "form_password_incorrect":
      return "Email or password did not match.";
    case "form_identifier_not_found":
      return "No account uses that email — join LiGN first.";
    case "form_code_incorrect":
      return "That code didn't match — use the newest email, then try again.";
    case "verification_expired":
    case "form_code_expired":
      return "That code expired — go back and request a fresh one.";
    case "session_exists":
      return "You're already signed in — taking you in…";
    default:
      return err.message ? `${err.message} (${err.code ?? "unknown-code"})` : "something-went-wrong";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [needCode, setNeedCode] = useState(false);
  const [code, setCode] = useState("");
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) router.push("/discover");
  }, [isSignedIn, router]);

  // Shared tail after any successful authentication.
  async function routeAfterAuth() {
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
  }

  async function submit() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await signIn.create({ identifier: email.trim(), password });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        await routeAfterAuth();
        return;
      }
      // Account exists but email isn't verified yet: finish verification
      // right here instead of stranding the user.
      if (res.status === "needs_first_factor") {
        const factor = (res.supportedFirstFactors ?? []).find(
          (f) => f.strategy === "email_code",
        );
        if (factor && "emailAddressId" in factor && factor.emailAddressId) {
          await signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: factor.emailAddressId,
          });
          setNeedCode(true);
          setStatus("One quick check — enter the code we just emailed you.");
          return;
        }
      }
      throw new Error("Email or password did not match.");
    } catch (e) {
      const msg = friendlySignInError(e);
      if (/already signed in/i.test(msg)) {
        setStatus(msg);
        setTimeout(() => router.push("/discover"), 1200);
        return;
      }
      setStatus(msg);
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: code.trim(),
      });
      if (res.status !== "complete")
        throw new Error("That code didn't match — try again.");
      await setActive({ session: res.createdSessionId });
      await routeAfterAuth();
    } catch (e) {
      setStatus(friendlySignInError(e));
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

      {!needCode ? (
        <>
          <label className="ob-label">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />

          <button className="ob-go" disabled={!email || !password || busy} onClick={submit}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </>
      ) : (
        <>
          <p className="ob-sub">Check your inbox — enter the 6-digit code.</p>
          <label className="ob-label">
            Verification code
            <input value={code} maxLength={6} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
          </label>
          <button className="ob-go" disabled={code.trim().length < 4 || busy} onClick={verifyCode}>
            {busy ? "Verifying…" : "Verify email"}
          </button>
          <p className="ob-alt">
            <button
              type="button"
              className="ob-show"
              disabled={busy}
              onClick={() => {
                setNeedCode(false);
                setCode("");
                setStatus(null);
              }}
            >
              Use a different account
            </button>
          </p>
        </>
      )}
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
