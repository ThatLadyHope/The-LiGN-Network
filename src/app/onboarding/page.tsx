"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { AGREEMENT_VERSION } from "@/lib/agreement";
import AgreementBox from "../agreement-box";
import "./onboarding.css";

export default function SignupPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [ageRange, setAgeRange] = useState("25-34");
  const [language, setLanguage] = useState("en");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

  const valid =
    nickname.trim().length > 0 &&
    nickname.length <= 30 &&
    /.+@.+\..+/.test(email) &&
    password.length >= 8 &&
    language.trim().length >= 2 &&
    agreed;

  async function submit() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      if (!agreed) throw new Error("Please read the agreement and tick the box to join.");
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (/already exists|identifier.*taken|in use/i.test(msg)) {
        throw new Error("This email already has an account.");
      }
      setStatus(msg || "something-went-wrong");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!isLoaded) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status !== "complete") throw new Error("That code did not match — try again.");
      await setActive({ session: res.createdSessionId });
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
      if (!profile.ok) throw new Error(data?.error ?? "profile-failed");
      router.push("/onboarding/needs");
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
      <h1>Get started</h1>

      <label className="ob-label">
        Nickname
        <input value={nickname} maxLength={30} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Wren" />
      </label>
      <label className="ob-label">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>
      <label className="ob-label">
        Password (8+ chars)
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

      <div className="ob-row">
        <label className="ob-label">
          Age range
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
            {AGES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="ob-label">
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGUAGES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AgreementBox onAgreed={setAgreed} showTitle={false} showHelp={false} />

      {!verifying ? (
        <button className="ob-go" disabled={!valid || busy} onClick={submit}>
          {busy ? "Joining…" : "Join LiGN"}
        </button>
      ) : (
        <>
          <p className="ob-sub">Check your inbox — enter the 6-digit code.</p>
          <label className="ob-label">
            Verification code
            <input value={code} maxLength={6} onChange={(e) => setCode(e.target.value)} placeholder="123456" />
          </label>
          <button className="ob-go" disabled={code.trim().length < 4 || busy} onClick={verify}>
            {busy ? "Verifying…" : "Verify email"}
          </button>
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
