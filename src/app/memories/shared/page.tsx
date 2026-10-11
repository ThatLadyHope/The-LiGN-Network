"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BackButton from "../../back-button";
import "../../onboarding/onboarding.css";

interface Memory {
  id: string;
  content: string;
  approvals: boolean[];
  otherNickname: string;
  myIndex: number;
}

interface ConversationOption {
  id: string;
  nickname: string;
}

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [people, setPeople] = useState<ConversationOption[]>([]);
  const [otherId, setOtherId] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [m, c] = await Promise.all([fetch("/api/memories"), fetch("/api/conversations")]);
    if (m.status === 401) {
      router.push("/onboarding");
      return;
    }
    const md = await m.json().catch(() => null);
    setMemories(md?.memories ?? []);
    const cd = await c.json().catch(() => null);
    setPeople(
      (cd?.conversations ?? []).map((x: { other: { id: string; nickname: string } | null }) => ({
        id: x.other?.id ?? "",
        nickname: x.other?.nickname ?? "Someone",
      })).filter((x: ConversationOption) => x.id),
    );
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function propose() {
    if (!otherId || !content.trim()) {
      setStatus("Choose a person and write the memory.");
      return;
    }
    const res = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otherId, content: content.trim() }),
    });
    if (res.ok) {
      setContent("");
      load();
      setStatus("Proposed — it becomes shared when they accept.");
    } else setStatus("Could not propose that memory.");
  }

  async function act(id: string, op: "approve" | "withdraw") {
    const res = await fetch(`/api/memories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op }),
    });
    if (res.ok) load();
    else setStatus("Could not do that.");
  }

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Shared memories</h1>
      <p className="ob-sub">Kept only together — either person can step away anytime.</p>

      <div className="ob-group-page">
        <h2>New shared memory</h2>
        <label className="ob-label">
          With
          <select value={otherId} onChange={(e) => setOtherId(e.target.value)}>
            <option value="">Choose a connection…</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nickname}
              </option>
            ))}
          </select>
        </label>
        <label className="ob-label">
          The memory
          <input
            value={content}
            maxLength={2000}
            onChange={(e) => setContent(e.target.value)}
            placeholder="An inside joke, a moment, a first…"
          />
        </label>
        <button className="ob-btn half sage" onClick={propose}>
          Propose memory
        </button>
      </div>

      {memories.map((m) => (
        <div key={m.id} className="ob-group-page">
          <p>{m.content}</p>
          <p className="ob-hint">
            with {m.otherNickname} · {m.approvals[0] && m.approvals[1] ? "shared" : "waiting for acceptance"}
          </p>
          {!m.approvals[m.myIndex] && (
            <button className="ob-btn half sage" onClick={() => act(m.id, "approve")}>
              Accept
            </button>
          )}{" "}
          <button className="ob-btn half quiet" onClick={() => act(m.id, "withdraw")}>
            Step away
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
