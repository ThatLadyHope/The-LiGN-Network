"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { AGREEMENT_VERSION } from "@/lib/agreement";
import { DISPOSABLE_EMAIL_MESSAGE, isDisposableEmail } from "@/lib/email-policy";
import { MIN_PASSWORD_LENGTH } from "@/lib/password-policy";
import AgreementBox from "../agreement-box";
import PasswordField from "../password-field";
import "./onboarding.css";

// Clerk's raw messages, translated into plain guidance. Unknown codes fall
// through to Clerk's own text plus the code for diagnosis.
function friendlySignupError(e: unknown, fallback: string): string {
  const err = (e as { errors?: { code?: string; message?: string }[] })?.errors?.[0];
  if (!err) return e instanceof Error && e.message ? e.message : fallback;
  switch (err.code) {
    case "form_identifier_exists":
      return "exists";
    case "form_code_incorrect":
      return "That code didn't match — use the newest email, then try again.";
    case "verification_expired":
    case "form_code_expired":
      return "That code expired — tap Resend code for a fresh one.";
    case "verification_already_verified":
      return "Already verified — tap Verify email to finish signing in.";
    case "session_exists":
      return "You're already signed in — taking you in…";
    case "form_password_pwned":
      return "That password has appeared in a data breach — choose a different one.";
    case "form_password_length_too_short":
      return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    default:
      return err.message ? `${err.message} (${err.code ?? "unknown-code"})` : fallback;
  }
}

function friendlySigninError(e: unknown): string {
  const err = (e as { errors?: { code?: string; message?: string }[] })?.errors?.[0];
  if (!err) return e instanceof Error && e.message ? e.message : "something-went-wrong";
  switch (err.code) {
    case "form_password_incorrect":
      return "Email or password did not match.";
    case "form_identifier_not_found":
      return "not-found";
    case "form_code_incorrect":
      return "That code didn't match — use the newest email, then try again.";
    case "verification_expired":
    case "form_code_expired":
      return "That code expired — tap Resend code for a fresh one.";
    case "session_exists":
      return "You're already signed in — taking you in…";
    default:
      return err.message ? `${err.message} (${err.code ?? "unknown-code"})` : "something-went-wrong";
  }
}

type Stage = "gate" | "register" | "verify";

export default function GetStartedPage() {
  const router = useRouter();
  const { isLoaded: upLoaded, signUp, setActive: setActiveUp } = useSignUp();
  const { isLoaded: inLoaded, signIn, setActive: setActiveIn } = useSignIn();
  const isLoaded = upLoaded && inLoaded;
  const [stage, setStage] = useState<Stage>("gate");
  const [mode, setMode] = useState<"signup" | "signin" | null>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageRange, setAgeRange] = useState("25-34");
  const [language, setLanguage] = useState("en");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [signinFactorId, setSigninFactorId] = useState<string | null>(null);
  const { isSignedIn } = useUser();
  // Ref guard: React state updates async, so two rapid taps could both pass
  // `busy`. The ref closes the double-submit hole that strands verifications.
  const workingRef = useRef(false);

  // Signed-in users don't belong here (prevents session_exists dead-ends).
  useEffect(() => {
    if (isSignedIn) router.push("/discover");
  }, [isSignedIn, router]);

  // Resend cooldown: every new code kills the previous one, so slow users down.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const AGES = ["18-24", "25-34", "35-44", "45-54", "55-plus"];
  const LANGUAGES = [
    ["en", "English"],
    ["fr", "French"],
    ["es", "Spanish"],
    ["pt", "Portuguese"],
    ["de", "German"],
    ["it", "Italian"],
    ["nl", "Dutch"],
    ["ru", "Russian"],
    ["ar", "Arabic"],
    ["hi", "Hindi"],
    ["zh", "Mandarin"],
    ["yue", "Cantonese"],
    ["ja", "Japanese"],
    ["ko", "Korean"],
    ["sw", "Swahili"],
    ["yo", "Yoruba"],
    ["ig", "Igbo"],
    ["ha", "Hausa"],
    ["am", "Amharic"],
    ["zu", "Zulu"],
  ] as const;

  const gateValid = /.+@.+\..+/.test(email.trim()) && password.length > 0;
  const registerValid =
    nickname.trim().length > 0 &&
    nickname.length <= 30 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    language.trim().length >= 2 &&
    agreed;

  function goDiscoverSoon(msg: string) {
    setStatus(msg);
    setTimeout(() => router.push("/discover"), 1200);
  }

  // Step 1: email + password. Existing account → sign straight in (needs);
  // unknown email → open the registration fields.
  async function gate() {
    if (!isLoaded || workingRef.current) return;
    const si = signIn;
    if (!si) return;
    const cleanEmail = email.trim();
    if (!/.+@.+\..+/.test(cleanEmail)) {
      setStatus("Enter a valid email address.");
      return;
    }
    if (isDisposableEmail(cleanEmail)) {
      setStatus(DISPOSABLE_EMAIL_MESSAGE);
      return;
    }
    workingRef.current = true;
    setBusy(true);
    setStatus(null);
    try {
      const res = await si.create({ identifier: cleanEmail, password });
      if (res.status === "complete") {
        const sa = setActiveIn;
        if (!sa) throw new Error("something-went-wrong");
        await sa({ session: res.createdSessionId });
        router.push("/onboarding/needs");
        return;
      }
      // Password right but email unverified: finish with a code.
      if (res.status === "needs_first_factor") {
        const factor = (res.supportedFirstFactors ?? []).find(
          (f) => f.strategy === "email_code",
        );
        if (factor && "emailAddressId" in factor && factor.emailAddressId) {
          await si.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: factor.emailAddressId,
          });
          setSigninFactorId(factor.emailAddressId);
          setMode("signin");
          setStage("verify");
          setCooldown(30);
          setStatus("One quick check — enter the code we just emailed you.");
          return;
        }
      }
      throw new Error("Email or password did not match.");
    } catch (e) {
      const msg = friendlySigninError(e);
      if (msg === "not-found") {
        // New here: open the rest of the form, email and password kept.
        setMode("signup");
        setStage("register");
        setStatus(null);
        return;
      }
      if (/already signed in/i.test(msg)) {
        goDiscoverSoon(msg);
        return;
      }
      setStatus(msg);
    } finally {
      setBusy(false);
      workingRef.current = false;
    }
  }

  // Step 2 (new accounts): the rest of the form + agreement → Join.
  async function join() {
    if (!isLoaded || workingRef.current) return;
    const su = signUp;
    if (!su) return;
    workingRef.current = true;
    setBusy(true);
    setStatus(null);
    try {
      if (!agreed) throw new Error("Please read the agreement and tick the box to join.");
      if (isDisposableEmail(email)) throw new Error(DISPOSABLE_EMAIL_MESSAGE);
      if (password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      }
      await su.create({ emailAddress: email.trim(), password });
      await su.prepareEmailAddressVerification({ strategy: "email_code" });
      setMode("signup");
      setStage("verify");
      setCooldown(30);
    } catch (e) {
      const msg = friendlySignupError(e, "something-went-wrong");
      if (msg === "exists") {
        // Raced or remembered wrong: fall back to signing in directly.
        setStage("gate");
        setStatus("That email already has an account — signing you in instead…");
        setTimeout(() => gate(), 600);
        return;
      }
      if (/already signed in/i.test(msg)) {
        goDiscoverSoon(msg);
        return;
      }
      setStatus(msg);
    } finally {
      setBusy(false);
      workingRef.current = false;
    }
  }

  async function resend() {
    if (!isLoaded || cooldown > 0 || workingRef.current) return;
    workingRef.current = true;
    setBusy(true);
    setStatus(null);
    try {
      if (mode === "signin") {
        const si = signIn;
        if (!si || !signinFactorId) throw new Error("something-went-wrong");
        await si.prepareFirstFactor({ strategy: "email_code", emailAddressId: signinFactorId });
      } else {
        const su = signUp;
        if (!su) throw new Error("something-went-wrong");
        await su.prepareEmailAddressVerification({ strategy: "email_code" });
      }
      setCode("");
      setCooldown(30);
      setStatus("Fresh code sent — use the newest email, then enter it within a few minutes.");
    } catch (e) {
      setStatus(
        mode === "signin"
          ? friendlySigninError(e)
          : friendlySignupError(e, "something-went-wrong"),
      );
    } finally {
      setBusy(false);
      workingRef.current = false;
    }
  }

  async function verify() {
    if (!isLoaded || workingRef.current) return;
    workingRef.current = true;
    setBusy(true);
    setStatus(null);
    try {
      if (mode === "signin") {
        const si = signIn;
        if (!si) throw new Error("something-went-wrong");
        const res = await si.attemptFirstFactor({
          strategy: "email_code",
          code: code.trim(),
        });
        if (res.status !== "complete") throw new Error("That code didn't match — try again.");
        const sa = setActiveIn;
        if (!sa) throw new Error("something-went-wrong");
        await sa({ session: res.createdSessionId });
        router.push("/onboarding/needs");
        return;
      }
      const su = signUp;
      if (!su) throw new Error("something-went-wrong");
      // Shortcut: already complete (double-tap, recovered session, retry).
      let res = su.status === "complete" ? su : await attemptWithRecovery();
      if (res.status !== "complete") {
        const done = await reloadWithRetry(2);
        if (done && done.status === "complete") res = done;
        else
          throw new Error(
            "That code didn't match — use the newest email, then try again.",
          );
      }
      await finishSignup(res.createdSessionId);
    } catch (e) {
      setStatus(
        mode === "signin"
          ? friendlySigninError(e)
          : friendlySignupError(e, "something-went-wrong"),
      );
    } finally {
      setBusy(false);
      workingRef.current = false;
    }
  }

  // One attempt plus already-verified recovery. Throws on real failure.
  async function attemptWithRecovery() {
    const su = signUp;
    if (!su) throw new Error("something-went-wrong");
    const clean = code.trim();
    try {
      return await su.attemptEmailAddressVerification({ code: clean });
    } catch (err) {
      // The address may already be verified (stale/double-submitted code or
      // a lost response): reload — if the signup is complete, carry on.
      const done = await reloadWithRetry(3);
      if (done && done.status === "complete") return done;
      throw err;
    }
  }

  // Reload with backoff: mobile/flaky networks routinely fail the first try,
  // and a single failed reload used to strand users in a dead loop.
  async function reloadWithRetry(tries: number) {
    const su = signUp;
    if (!su) return null;
    for (let i = 0; i < tries; i++) {
      try {
        const fresh = await su.reload();
        if (fresh) return fresh;
      } catch {
        // fall through to backoff
      }
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
    return null;
  }

  // Shared tail: activate the session, then create/link the local profile.
  async function finishSignup(sessionId: string | null | undefined) {
    if (!sessionId) throw new Error("Signed up but no session — tap Verify email again.");
    const sa = setActiveUp;
    if (!sa) throw new Error("something-went-wrong");
    await sa({ session: sessionId });
    const profile = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: nickname.trim(),
        ageRange,
        language: language.trim(),
        agreementVersion: AGREEMENT_VERSION,
      }),
    });
    const data = await profile.json().catch(() => null);
    if (!profile.ok) {
      if (data?.error === "email-not-allowed") {
        throw new Error(
          "Temporary email addresses aren't allowed — start over with your permanent email address.",
        );
      }
      // Signed in but profile not created (e.g. legacy email row): the
      // Needs step finishes profile creation, so send them there.
      if (profile.status === 400 || profile.status === 409 || profile.status === 500) {
        router.push("/onboarding/needs");
        return;
      }
      throw new Error(data?.error ?? "profile-failed");
    }
    router.push("/onboarding/needs");
  }

  // Escape hatch: back to email + password with values kept.
  function startOver() {
    setStage("gate");
    setMode(null);
    setCode("");
    setSigninFactorId(null);
    setStatus("Check the details — fix the email if needed, then continue.");
  }

  return (
    <main className="ob-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Get started</h1>

      {stage === "gate" && (
        <>
          <p className="ob-sub">One step first — new here or returning, it starts the same way.</p>
          <label className="ob-label">
            Email
            <input className="ui-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
          <button className="ob-go ui-btn" disabled={!gateValid || busy} onClick={gate}>
            {busy ? "Checking…" : "Continue"}
          </button>
        </>
      )}

      {stage === "register" && (
        <>
          <p className="ob-sub">
            New here — almost done. <button type="button" className="ob-show" onClick={() => setStage("gate")}>← Back</button>
          </p>
          <label className="ob-label">
            Nickname
            <input className="ui-input" value={nickname} maxLength={30} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Wren" />
          </label>
          <div className="ob-row">
            <label className="ob-label">
              Age range
              <select className="ui-input" value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                {AGES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="ob-label">
              Language
              <select className="ui-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map(([c, name]) => (
                  <option key={c} value={c}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <AgreementBox onAgreed={setAgreed} showTitle={false} showHelp={false} />

          <button className="ob-go ui-btn" disabled={!registerValid || busy} onClick={join}>
            {busy ? "Joining…" : "Join LiGN"}
          </button>
        </>
      )}

      {stage === "verify" && (
        <>
          <p className="ob-sub">Check your inbox — enter the 6-digit code.</p>
          <label className="ob-label">
            Verification code
            <input className="ui-input" value={code} maxLength={6} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
          </label>
          <button className="ob-go ui-btn" disabled={code.trim().length < 4 || busy} onClick={verify}>
            {busy ? "Verifying…" : "Verify email"}
          </button>
          <p className="ob-alt">
            <button type="button" className="ob-show" disabled={busy || cooldown > 0} onClick={resend}>
              {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
            </button>
          </p>
          <p className="ob-alt">
            <button type="button" className="ob-show" disabled={busy} onClick={startOver}>
              Start over (wrong email?)
            </button>
          </p>
        </>
      )}
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
