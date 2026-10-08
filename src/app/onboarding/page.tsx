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
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const valid =
    nickname.trim().length > 0 &&
    nickname.length <= 30 &&
    /.+@.+\..+/.test(email) &&
    password.length >= 10;

  async function submit() {
    setBusy(true);
    setStatus(null);
    try {
      const signup = await authClient.signUp.email({ email, password, name: nickname.trim() });
      if (signup.error) throw new Error(signup.error.message ?? "signup-failed");
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

      <button className="ob-go" disabled={!valid || busy} onClick={submit}>
        {busy ? "Joining…" : "Join LiGN"}
      </button>
      {status && <p className="ob-status">{status}</p>}
      <p className="ob-hint">Silence is normal here. You can pause or leave anytime.</p>
    </main>
  );
}
