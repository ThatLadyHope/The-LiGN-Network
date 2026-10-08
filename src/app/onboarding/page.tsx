"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "./onboarding.css";

export default function SignupPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageRange, setAgeRange] = useState("25-34");
  const [language, setLanguage] = useState("en");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "ha", label: "Hausa" },
    { code: "yo", label: "Yoruba" },
    { code: "ig", label: "Igbo" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
    { code: "pt", label: "Portuguese" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "nl", label: "Dutch" },
    { code: "ar", label: "Arabic" },
    { code: "hi", label: "Hindi" },
    { code: "zh", label: "Chinese" },
  ];

  const valid =
    nickname.trim().length > 0 &&
    nickname.length <= 30 &&
    /.+@.+\..+/.test(email) &&
    password.length >= 10 &&
    language.trim().length >= 2;

  async function submit() {
    setBusy(true);
    setStatus(null);
    try {
      const signup = await authClient.signUp.email({ email, password, name: nickname.trim() });
      if (signup.error) throw new Error(signup.error.message ?? "signup-failed");
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageRange, language: language.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "profile-failed");
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
      <p className="ob-sub">One identity, minimal setup. No photo, no pressure.</p>

      <label className="ob-label">
        Nickname
        <input value={nickname} maxLength={30} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Wren" />
      </label>
      <label className="ob-label">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>
      <label className="ob-label">
        Password (10+ chars)
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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

      <button className="ob-go" disabled={!valid || busy} onClick={submit}>
        {busy ? "Joining…" : "Join LiGN"}
      </button>
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
      <p className="ob-hint">Silence is normal here. You can pause or leave anytime.</p>
    </main>
  );
}
