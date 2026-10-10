"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BackButton from "../back-button";
import "../onboarding/onboarding.css";

const KINDS: { value: string; label: string; hint: string }[] = [
  { value: "watching", label: "Watching", hint: "Watch something together" },
  { value: "simple-games", label: "Simple games", hint: "Something light" },
  { value: "studying", label: "Studying", hint: "Quiet company while you work" },
  { value: "working", label: "Working", hint: "Side by side, apart" },
  { value: "eating", label: "Eating", hint: "Share a meal over chat" },
  { value: "walking", label: "Walking", hint: "Out together, phones in pockets" },
  { value: "drawing", label: "Drawing", hint: "Make something together" },
  { value: "music", label: "Music", hint: "Listen together" },
  { value: "hanging-out", label: "Hanging out", hint: "No plan — just be there" },
];

export default function ActivitiesPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function start(kind: string, label: string) {
    const res = await fetch("/api/spaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purpose: `Shared activity: ${label}`, durationMin: 60 }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) router.push(`/spaces/${data.space.id}`);
    else if (res.status === 401) router.push("/onboarding");
    else setStatus(`Could not start ${label.toLowerCase()}.`);
  }

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Shared activities</h1>
      <p className="ob-sub">Do something together. Activities stay secondary — the company matters.</p>

      {KINDS.map((k) => (
        <div key={k.value} className="ob-group-page">
          <h2>{k.label}</h2>
          <p className="ob-hint">{k.hint}</p>
          <button className="ob-btn half sage" onClick={() => start(k.value, k.label)}>
            Start — opens a 1-hour space
          </button>
        </div>
      ))}

      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
