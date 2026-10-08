"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../onboarding.css";

const GROUPS: { id: string; title: string; hint: string; needs: { value: string; label: string }[] }[] = [
  {
    id: "g1",
    title: "Emotional Support",
    hint: "When you need care right now",
    needs: [
      { value: "venting", label: "Vent" },
      { value: "listening", label: "Listening" },
      { value: "need-someone", label: "I need someone" },
      { value: "check-ins", label: "Check-in" },
    ],
  },
  {
    id: "g2",
    title: "Conversation & Connection",
    hint: "Talk and grow a connection",
    needs: [
      { value: "casual-chat", label: "Casual chat" },
      { value: "deep-conversation", label: "Deep conversation" },
      { value: "friendship", label: "Friendship" },
      { value: "pen-pal", label: "Pen pal" },
    ],
  },
  {
    id: "g3",
    title: "Companionship & Shared time",
    hint: "Be together, do things together",
    needs: [
      { value: "quiet-companionship", label: "Quiet companionship" },
      { value: "shared-activity", label: "Shared activity" },
    ],
  },
];

const AGES = ["18-24", "25-34", "35-44", "45-54", "55-plus"];

export default function NeedsPage() {
  const router = useRouter();
  const [ageRange, setAgeRange] = useState("25-34");
  const [language, setLanguage] = useState("en");
  const [picked, setPicked] = useState<string[]>(["listening"]);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function toggleNeed(v: string) {
    setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  async function submit() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ageRange, currentNeeds: picked, language }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/onboarding");
          return;
        }
        throw new Error(data?.error ?? "profile-failed");
      }
      setStatus("Done — your need is saved. Discovery is next.");
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
      <h1>What kind of connection do you need right now?</h1>
      <p className="ob-sub">Pick your needs. You can change them anytime.</p>

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
          <input value={language} maxLength={10} onChange={(e) => setLanguage(e.target.value)} placeholder="en" />
        </label>
      </div>

      <div className="ob-groups">
        {GROUPS.map((g) => (
          <section key={g.id} className={`ob-group ${g.id}`}>
            <h2>
              {g.title} <small>{g.hint}</small>
            </h2>
            <div className="ob-needs">
              {g.needs.map((n) => (
                <button
                  key={n.value}
                  type="button"
                  className={picked.includes(n.value) ? "picked" : ""}
                  onClick={() => toggleNeed(n.value)}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <button className="ob-go" disabled={picked.length === 0 || busy} onClick={submit}>
        {busy ? "Saving…" : "Continue"}
      </button>
      {status && <p className="ob-status">{status}</p>}
      <p className="ob-hint">Silence is normal here. You can pause or leave anytime.</p>
    </main>
  );
}
