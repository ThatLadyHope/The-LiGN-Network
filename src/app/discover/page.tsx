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

const FALLBACK_LABELS: Record<string, string> = {
  "broaden-matching": "Broaden your matching",
  "try-again-later": "Try again later",
  "listener-queue": "Join the listener queue",
  "temporary-space": "Open a temporary space",
  "shared-activity": "Find a shared activity",
  "reflection-prompt": "Try a reflection prompt",
};

export default function DiscoverPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [fallback, setFallback] = useState<string[] | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

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
      <p className="ob-sub">Matched on your current need first. No counts, no competition.</p>

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
          <h2>No suitable person right now — honestly.</h2>
          <p>No AI will pretend to be your match. Instead, you can:</p>
          <ul>
            {fallback.map((f) => (
              <li key={f}>{FALLBACK_LABELS[f] ?? f}</li>
            ))}
          </ul>
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
