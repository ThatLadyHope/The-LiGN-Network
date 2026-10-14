"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BackButton from "../back-button";
import { anotherPrompt, promptForDate } from "@/lib/journal-prompts";
import "../onboarding/onboarding.css";

interface Entry {
  id: string;
  content: string;
  createdAt: string;
}

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [prompt, setPrompt] = useState<string>(() => promptForDate());
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/journal");
    if (res.status === 401) {
      router.push("/onboarding");
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.ok) setEntries(data.entries ?? []);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    const content = draft.trim();
    if (!content) return;
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      setDraft("");
      load();
    } else setStatus("Could not save that entry.");
  }

  async function remove(id: string) {
    const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else setStatus("Could not delete that entry.");
  }

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Connection journal</h1>
      <p className="ob-sub">Private to you. Never shared, never shown to anyone.</p>

      <section className="ob-group-page" aria-label="Today's reflection">
        <p className="ob-hint">Today&apos;s reflection</p>
        <p className="jr-prompt">“{prompt}”</p>
        <button className="ob-btn half quiet" onClick={() => setPrompt((p) => anotherPrompt(p))}>
          Another prompt
        </button>
        <p className="ob-hint">Or ignore it and write freely — the blank page never judges.</p>
      </section>

      <label className="ob-label">
        New entry
        <input
          className="ui-input"
          value={draft}
          maxLength={2000}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="A moment worth keeping…"
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
          }}
        />
      </label>
      <button className="ob-go ui-btn" disabled={!draft.trim()} onClick={save}>
        Save entry
      </button>

      {entries.map((e) => (
        <div key={e.id} className="ob-group-page">
          <p>{e.content}</p>
          <p className="ob-hint">{new Date(e.createdAt).toLocaleString()}</p>
          <button
            className="ob-btn half quiet"
            onClick={() => remove(e.id)}
            aria-label={`Delete journal entry from ${new Date(e.createdAt).toLocaleDateString()}`}
          >
            Delete
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
