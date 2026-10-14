"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CHECKIN_MOODS, MOOD_LABELS, gentleStreak, todayKey, type CheckinMood } from "@/lib/checkins";
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

// The Connection Mark: three softly curved discs leaning into one another —
// connection, belonging, community. Token fills, no generic menu glyphs.
function ConnectionMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="9.4" cy="10" r="5.2" fill="var(--clay)" opacity="0.82" />
      <circle cx="14.6" cy="10" r="5.2" fill="var(--sage)" opacity="0.82" />
      <circle cx="12" cy="14.6" r="5.2" fill="var(--plum)" opacity="0.82" />
    </svg>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [fallback, setFallback] = useState<string[] | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [queuePos, setQueuePos] = useState<number | null>(null);
  const [spacePurpose, setSpacePurpose] = useState("");
  const [spaceMin, setSpaceMin] = useState("30");
  const [promptIdx, setPromptIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [retryMsg, setRetryMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<CheckinMood | null>(null);
  const [streak, setStreak] = useState(0);
  const { isLoaded: authLoaded, isSignedIn } = useUser();
  const unauthTries = useRef(0);
  const authRef = useRef({ loaded: false, signedIn: false });
  authRef.current = { loaded: authLoaded, signedIn: !!isSignedIn };

  function handleUnauthorized(retry: () => void) {
    const a = authRef.current;
    if (!a.loaded || (a.signedIn && unauthTries.current < 3)) {
      unauthTries.current += 1;
      setTimeout(retry, 1500);
      return true;
    }
    unauthTries.current = 0;
    router.push("/onboarding");
    return true;
  }

  const REFLECTIONS = [
    "What kind of connection has meant the most to you lately, and why?",
    "If loneliness had a shape today, what would it look like?",
    "What is one small, honest thing you could share with someone new?",
  ];

  const load = useCallback(async () => {
    let d: Response;
    let s: Response;
    let k: Response | null = null;
    try {
      [d, s, k] = await Promise.all([
        fetch("/api/discover"),
        fetch("/api/account/status"),
        fetch("/api/checkins"),
      ]);
    } catch {
      return { found: 0, failed: true as const };
    }
    if (d.status === 401) {
      handleUnauthorized(() => load());
      return { found: 0, failed: false as const };
    }
    unauthTries.current = 0;
    const data = await d.json().catch(() => null);
    const found = data?.candidates?.length ?? 0;
    setCandidates(data?.candidates ?? []);
    setFallback(data?.fallback?.options ?? null);
    const st = await s.json().catch(() => null);
    setPaused(st?.status?.accountState === "PAUSED");
    if (st?.restored) setStatus("Welcome back — your account resumed automatically.");
    const kd = await k?.json().catch(() => null);
    if (kd) {
      const today = todayKey();
      const mine = (kd.checkins ?? []).find((c: { day: string }) => c.day === today);
      setTodayMood(mine?.mood ?? null);
      setStreak(gentleStreak((kd.checkins ?? []).map((c: { day: string }) => c.day)));
    }
    return { found, failed: false as const };
  }, [router]);

  async function retry() {
    setRetryMsg("Checking again…");
    try {
      const r = await load();
      if (r.failed) {
        setRetryMsg("Check failed — the app server may be down. Reload the page and try again.");
        return;
      }
      const { found } = r;
      setRetryMsg(found > 0 ? `Found ${found} ${found === 1 ? "person" : "people"} for you.` : "Still nobody new — the queue or a space below is faster.");
    } catch {
      setRetryMsg("Check failed — reload the page and try again.");
    }
  }

  async function resumeNow() {
    const res = await fetch("/api/account/status", { method: "DELETE" });
    if (res.ok) {
      setPaused(false);
      load();
    } else setStatus("Could not resume right now.");
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
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
      router.push(`/spaces/${data.space.id}`);
      return;
    }
    setStatus("Could not open the space.");
  }

  async function checkin(mood: CheckinMood) {
    const res = await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, day: todayKey() }),
    });
    if (res.ok) {
      setTodayMood(mood);
      load();
      // No bottom toast: the card's own hint line already confirms the
      // arrival ("Arrived feeling … — tap again to change it").
    } else {
      setStatus("Could not record that — try again.");
    }
  }

  async function sendRequest(id: string) {
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId: id }),
    });
    if (res.ok) {
      setSent((s) => [...s, id]);
      // Stay put: the row flips to Sent with a "Wait in Chat" link, so the
      // wait happens in the right place without yanking the user away.
      setStatus("Request sent — they'll see it in their Chat.");
    } else if (res.status === 409) {
      setSent((s) => [...s, id]);
      setStatus("Request already pending — wait it out in Chat.");
    } else {
      setStatus("Could not send the request — they may no longer be available.");
    }
  }

  return (
    <main className="dc-wrap">
      <div className="dc-topbar">
        <div className="ob-wordmark">
          The <em>LiGN</em> Network
        </div>
        <button
          type="button"
          className="dc-menu-btn"
          aria-expanded={menuOpen}
          aria-label="Open menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <ConnectionMark />
        </button>
        {menuOpen && (
          <nav className="dc-drawer" aria-label="Menu">
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <Link href="/spaces" onClick={() => setMenuOpen(false)}>
              Your spaces
            </Link>
            <Link href="/memories" onClick={() => setMenuOpen(false)}>
              Memories
            </Link>
            <Link href="/reports" onClick={() => setMenuOpen(false)}>
              Reports
            </Link>
            <Link href="/settings" onClick={() => setMenuOpen(false)}>
              Settings
            </Link>
          </nav>
        )}
      </div>
      <p className="ob-sub">Matched on your current need first.</p>

      <section className="dc-checkin" aria-label="Arrival check-in">
        <div>
          <h2>How are you arriving today?</h2>
          <p className="ob-hint">
            {todayMood
              ? `Arrived feeling ${MOOD_LABELS[todayMood].toLowerCase()}${streak > 1 ? ` · ${streak} gentle days in a row` : ""} — tap again to change it.`
              : "One tap. Private — it shapes nothing except your own history."}
          </p>
        </div>
        <div className="dc-checkin-moods" role="group" aria-label="Arrival mood">
          {CHECKIN_MOODS.map((m) => (
            <button
              key={m}
              type="button"
              className={`dc-mood tone-${m}${todayMood === m ? " picked" : ""}`}
              aria-pressed={todayMood === m}
              onClick={() => checkin(m)}
            >
              {MOOD_LABELS[m]}
            </button>
          ))}
        </div>
      </section>

      {paused && (
        <section className="dc-empty">
          <p>
            You are paused — out of discovery, everything kept.{" "}
            <button className="dc-act solid-sage" onClick={resumeNow}>
              Resume my account
            </button>
          </p>
        </section>
      )}

      {loading ? (
        <section className="dc-people" aria-label="Loading">
          <div className="dc-people-head">
            <h2>Available now</h2>
          </div>
          <div className="ui-skeleton" />
          <div className="ui-skeleton" />
          <div className="ui-skeleton" />
        </section>
      ) : candidates.length > 0 ? (
        <section className="dc-people" aria-label="Available connections">
          <div className="dc-people-head">
            <div>
              <h2>Available now</h2>
              <p className="dc-people-sub">
                Send a request. If they accept, your conversation opens in Chat — no rush either way.
              </p>
            </div>
            <span className="ui-badge">
              {candidates.length} {candidates.length === 1 ? "person" : "people"}
            </span>
          </div>
          <ul>
            {candidates.map((c, i) => {
              const tones = ["teal", "indigo", "plum", "sage"] as const;
              const tone = tones[i % tones.length];
              const needs = c.sharedNeeds ?? [];
              const labels = needs.slice(0, 2).map((n) => NEED_LABELS[n] ?? n);
              const extra = needs.length > 2 ? needs.length - 2 : 0;
              const name = c.profile?.nickname ?? "Someone";
              const matchLine =
                labels.length > 0
                  ? `You both want ${labels.join(" and ")}${extra > 0 ? `, +${extra} more` : ""}`
                  : "A new face — no shared needs yet";
              const done = sent.includes(c.id);
              return (
                <li key={c.id} className="dc-person">
                  <span className={`dc-avatar tone-${tone}`} aria-hidden="true">
                    {(c.profile?.nickname ?? "?").trim().charAt(0).toUpperCase() || "?"}
                  </span>
                  <span className="dc-person-main">
                    <b>{name}</b>
                    <span className="dc-match">{matchLine}</span>
                    <span className="dc-person-needs">
                      {needs.slice(0, 2).map((n) => (
                        <span key={n} className="dc-chip need">
                          {NEED_LABELS[n] ?? n}
                        </span>
                      ))}
                      {extra > 0 && <span className="dc-chip">+{extra}</span>}
                    </span>
                    {c.profile?.bio && <small className="dc-bio">“{c.profile.bio}”</small>}
                  </span>
                  {done ? (
                    <span className="dc-sent">
                      <span className="dc-act quiet" aria-live="polite">Sent –</span>
                      <Link className="dc-chat-link" href="/chat">
                        Wait in Chat
                      </Link>
                    </span>
                  ) : (
                    <button
                      className="dc-act solid-clay"
                      onClick={() => sendRequest(c.id)}
                      aria-label={`Send a connection request to ${name}`}
                    >
                      Send request
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {!loading && candidates.length === 0 && fallback && (
        <section className="dc-empty">
          <div className="eyebrow">While you wait</div>
          <h2>Nobody new right now — that's honest, not broken.</h2>
          <p>Good connections are worth waiting an hour for. Meanwhile, pick one:</p>
          <div className="dc-actions">
            <button className="dc-act solid-sage" onClick={retry}>
              Retry connection
            </button>
            <button className="dc-act solid-sage" onClick={() => router.push("/onboarding/needs")}>
              Adjust your needs
            </button>
            <button className="dc-act solid-sage" onClick={joinQueue}>
              {queuePos ? `In queue (#${queuePos})` : "Join listener queue"}
            </button>
          </div>
          {retryMsg && (
            <p className="dc-retry-msg" role="status">
              {retryMsg}
            </p>
          )}
        </section>
      )}

      <section className="dc-space">
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
      </section>

      <section className="dc-space">
        <h3>Do something together</h3>
        <p className="ob-hint">Activities stay secondary — the company matters most.</p>
        <button className="dc-act solid-clay" onClick={() => router.push("/activities")}>
          Browse activities
        </button>
      </section>

      <section className="dc-space">
        <h3>Reflection prompt</h3>
        <p>{REFLECTIONS[promptIdx % REFLECTIONS.length]}</p>
        <button className="dc-act outline" onClick={() => setPromptIdx((i) => i + 1)}>
          Another prompt
        </button>
      </section>

      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
