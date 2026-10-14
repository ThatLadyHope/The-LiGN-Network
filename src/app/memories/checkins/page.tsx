"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BackButton from "../../back-button";
import { MOOD_LABELS, type CheckinMood } from "@/lib/checkins";
import "../../onboarding/onboarding.css";
import "../../discover/discover.css";

interface Row {
  day: string;
  mood: CheckinMood;
}

function prettyDay(day: string): string {
  const d = new Date(`${day}T12:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

const MOOD_TONE: Record<CheckinMood, string> = {
  heavy: "plum",
  okay: "indigo",
  light: "sage",
};

export default function CheckinsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [streak, setStreak] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/checkins");
    if (res.status === 401) {
      router.push("/onboarding");
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setRows(data.checkins ?? []);
      setStreak(data.streak ?? 0);
    }
    setLoaded(true);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Arrival check-ins</h1>
      <p className="ob-sub">
        {streak > 1
          ? `${streak} gentle days in a row — presence, not performance.`
          : "How you arrived, day by day. Breaks are never punished."}
      </p>

      {!loaded && (
        <>
          <div className="ui-skeleton" style={{ height: 64 }} />
          <div className="ui-skeleton" style={{ height: 64, marginTop: 8 }} />
        </>
      )}

      {loaded &&
        rows.map((r) => (
          <div key={r.day} className="dc-person ck-row">
            <span className={`dc-avatar tone-${MOOD_TONE[r.mood]}`} aria-hidden="true">
              {MOOD_LABELS[r.mood].charAt(0)}
            </span>
            <span className="dc-person-main">
              <b>{prettyDay(r.day)}</b>
              <span className="dc-match">Arrived feeling {MOOD_LABELS[r.mood].toLowerCase()}</span>
            </span>
          </div>
        ))}

      {loaded && rows.length === 0 && (
        <p className="ob-hint">No check-ins yet — your next visit to Discover starts the story.</p>
      )}
    </main>
  );
}
