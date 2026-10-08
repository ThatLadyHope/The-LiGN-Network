"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./discover.css";

interface Candidate {
  id: string;
  score: number;
  sharedNeeds: string[];
  profile: { id: string; nickname: string; bio: string | null; interests: string[] } | null;
}

const NEED_LABELS: Record<string, string> = {
  "casual-chat": "Casual chat",
  venting: "Vent",
  listening: "Listening",
  "deep-conversation": "Deep conversation",
  "check-ins": "Check-in",
  friendship: "Friendship",
  "pen-pal": "Pen pal",
  "quiet-companionship": "Quiet companionship",
  "shared-activity": "Shared activity",
  "need-someone": "I need someone",
};

export default function DiscoverPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [fallback, setFallback] = useState<string[] | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [queuePos, setQueuePos] = useState<number | null>(null);
  const [spacePurpose, setSpacePurpose] = useState("");
  const [spaceMin, setSpaceMin] = useState("30");
  const [mySpaces, setMySpaces] = useState<{ id: string; purpose: string; closesAt: string }[]>([]);
  const [promptIdx, setPromptIdx] = useState(0);

  const REFLECTIONS = [
    "What kind of connection has meant the most to you lately, and why?",
    "If loneliness had a shape today, what would it look like?",
    "What is one small, honest thing you could share with someone new?",
  ];

  const load = useCallback(async () => {
    const res = await fetch("/api/discover");
    if (res.status === 401) {
      router.push("/onboarding");
      return;
    }
    const data = await res.json().catch(() => null);
    setCandidates(data?.candidates ?? []);
    setFallback(data?.fallback?.options ?? null);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function joinQueue() {
    const res = await fetch("/api/listeners/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) setQueuePos(data.position);
    else setStatus("Could not join the queue.");
  }

  async function openSpace() {
    if (!spacePurpose.trim()) {
      setStatus("Give your space a purpose first.");
      return;
    }
    const res = await fetch("/api/spaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purpose: spacePurpose.trim(), durationMin: Number(spaceMin) }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setSpacePurpose("");
      loadSpaces();
      setStatus(`Space open until ${new Date(data.space.closesAt).toLocaleTimeString()}.`);
    } else {
      setStatus("Could not open the space.");
    }
  }

  async function loadSpaces() {
    const res = await fetch("/api/spaces");
    const data = await res.json().catch(() => null);
    if (res.ok) setMySpaces(data.spaces ?? []);
  }

  async function sendRequest(id: string) {
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: id }),
    });
    if (res.ok) {
      setSent((s) => [...s, id]);
    } else if (res.status === 409) {
      setSent((s) => [...s, id]);
      setStatus("Request already pending.");
    } else {
      setStatus("Could not send the request — they may no longer be available.");
    }
  }

  return (
    <main className="dc-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>People open to the same connection</h1>
      <p className="ob-sub">Matched on your current need first.</p>

      {candidates.map((c) => (
        <article key={c.id} className="dc-card">
          <h2>{c.profile?.nickname ?? "Someone"}</h2>
          {c.profile?.bio && <p>{c.profile.bio}</p>}
          <div className="dc-chips">
            {c.sharedNeeds.map((n) => (
              <span key={n} className="dc-chip need">
                {NEED_LABELS[n] ?? n}
              </span>
            ))}
            {(c.profile?.interests ?? []).map((i) => (
              <span key={i} className="dc-chip">
                {i}
              </span>
            ))}
          </div>
          <button
            className="dc-go"
            disabled={sent.includes(c.id)}
            onClick={() => sendRequest(c.id)}
          >
            {sent.includes(c.id) ? "Request sent" : "Send request"}
          </button>
        </article>
      ))}

      {candidates.length === 0 && fallback && (
        <section className="dc-empty">
          <div className="eyebrow">While you wait</div>
          <h2>No suitable person right now — honestly.</h2>
          <p>No AI will pretend to be your match. While you wait:</p>
          <div className="dc-actions">
            <button className="dc-act solid-sage" onClick={load}>
              Retry connection
            </button>
            <button className="dc-act solid-sage" onClick={() => router.push("/onboarding/needs")}>
              Adjust your needs
            </button>
            <button className="dc-act solid-sage" onClick={joinQueue}>
              {queuePos ? `In queue (#${queuePos})` : "Join listener queue"}
            </button>
          </div>
          <div className="dc-space">
            <h3>Open a temporary space (3–8 people)</h3>
            <input
              value={spacePurpose}
              onChange={(e) => setSpacePurpose(e.target.value)}
              placeholder="e.g. Late-night chat"
              maxLength={120}
            />
            <select value={spaceMin} onChange={(e) => setSpaceMin(e.target.value)}>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
            <button className="dc-act solid-clay" onClick={openSpace}>
              Open space
            </button>
            {mySpaces.map((s) => (
              <p key={s.id} className="dc-open">
                Open: {s.purpose} — closes {new Date(s.closesAt).toLocaleTimeString()}
              </p>
            ))}
          </div>
          <div className="dc-space">
            <h3>Reflection prompt</h3>
            <p>{REFLECTIONS[promptIdx % REFLECTIONS.length]}</p>
            <button className="dc-act outline" onClick={() => setPromptIdx((i) => i + 1)}>
              Another prompt
            </button>
          </div>
        </section>
      )}

      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
