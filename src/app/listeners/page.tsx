"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BackButton from "../back-button";
import "../onboarding/onboarding.css";

interface Waiting {
  token: string;
  need: string;
  waitedMin: number;
}

export default function ListenersPage() {
  const router = useRouter();
  const [on, setOn] = useState(false);
  const [waiting, setWaiting] = useState<Waiting[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const m = await fetch("/api/listeners/mode");
    if (m.status === 401) {
      router.push("/onboarding");
      return;
    }
    const md = await m.json().catch(() => null);
    setOn(!!md?.on);
    if (md?.on) {
      const q = await fetch("/api/listeners/queue");
      const qd = await q.json().catch(() => null);
      if (q.ok) setWaiting(qd.waiting ?? []);
    } else {
      setWaiting([]);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle() {
    const res = await fetch("/api/listeners/mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ on: !on }),
    });
    if (res.ok) load();
    else setStatus("Could not change Listener Mode.");
  }

  async function claim(token: string) {
    const res = await fetch("/api/listeners/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      router.push("/chat");
    } else if (res.status === 404) {
      setStatus("Already taken — thank you for being ready.");
      load();
    } else {
      setStatus(data?.error === "listener-mode-required" ? "Turn on Listener Mode first." : "Could not take that request.");
    }
  }

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Listener Mode</h1>
      <p className="ob-sub">
        Voluntary, anonymous, time-limited (60 min). You are never responsible for anyone&apos;s safety — peer
        support only, never professional care.
      </p>

      <button className={`ob-btn half ${on ? "sage" : "quiet"}`} onClick={toggle} aria-pressed={on}>
        {on ? "Leave Listener Mode" : "Enter Listener Mode"}
      </button>

      {on && (
        <>
          <h2>Waiting ({waiting.length})</h2>
          {waiting.length === 0 && <p className="ob-hint">Nobody waiting right now. Thank you for being here.</p>}
          {waiting.map((w) => (
            <div key={w.token} className="ob-group-page">
              <b>Someone needs: {w.need}</b>
              <p className="ob-hint">waiting {w.waitedMin} min · anonymous until you take it</p>
              <button className="ob-btn half sage" onClick={() => claim(w.token)}>
                Listen
              </button>
            </div>
          ))}
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
