"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import "../../chat/chat.css";

interface Member {
  id: string;
  nickname: string;
}

interface SpaceInfo {
  id: string;
  purpose: string;
  state: string;
  closesAt: string;
  creatorId: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
}

const CATEGORIES = [
  "ordinary-incompatibility",
  "discomfort",
  "boundary-violation",
  "harassment",
  "serious-violation",
  "credible-threat",
  "exploitation",
  "other-high-risk",
];

export default function SpacePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [space, setSpace] = useState<SpaceInfo | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [mine, setMine] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState("");
  const [reportCat, setReportCat] = useState(CATEGORIES[1]);
  const [wished, setWished] = useState<string[]>([]);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [typingName, setTypingName] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastTypeEmit = useRef<number>(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/spaces/${id}`);
    if (res.status === 401) {
      router.push("/onboarding");
      return;
    }
    if (res.status === 403) {
      setStatus("This space is not yours to enter.");
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setSpace(data.space);
      setMembers(data.members ?? []);
      setMine(data.mine);
      setIsCreator(data.isCreator);
    }
  }, [id, router]);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/spaces/${id}/messages`);
    if (!res.ok) return;
    const data = await res.json().catch(() => null);
    setMessages(data.messages ?? []);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!space || space.state !== "open") return;
    loadMessages();
    const t = setInterval(loadMessages, 5000);    const s = io("/spaces");
    socketRef.current = s;
    s.emit("join", id);
    s.on("message", () => loadMessages());
    s.on("typing", (payload: { user?: string }) => {
      const who =
        typeof payload?.user === "string" && payload.user
          ? payload.user
          : "Someone";
      if (who === (members.find((m) => m.id === mine)?.nickname ?? "")) return;
      setTypingName(`${who} is typing…`);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTypingName(null), 3000);
    });
    return () => {
      clearInterval(t);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      setTypingName(null);
      s.emit("leave", id);
      s.disconnect();
      socketRef.current = null;
    };
  }, [id, space?.state, loadMessages, members, mine]);

  const remainingMs = space ? new Date(space.closesAt).getTime() - nowMs : 0;

  useEffect(() => {
    if (!space || space.state !== "open") return;
    const clock = setInterval(() => {
      setNowMs(Date.now());
      if (new Date(space.closesAt).getTime() <= Date.now()) load();
    }, 1000);
    return () => clearInterval(clock);
  }, [space?.state, space?.closesAt, load]);

  function countdown(): string {
    if (remainingMs <= 0) return "closing…";
    const s = Math.floor(remainingMs / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m left`;
    if (m > 0) return `${m}m ${sec}s left`;
    return `${sec}s left`;
  }

  function onDraftChange(v: string) {
    setDraft(v);
    const now = Date.now();
    if (v.trim() && now - lastTypeEmit.current > 3000) {
      lastTypeEmit.current = now;
      const me = members.find((m) => m.id === mine)?.nickname ?? "Someone";
      socketRef.current?.emit("typing", { room: id, user: me });
    }
  }

  async function send() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    const res = await fetch(`/api/spaces/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      loadMessages();
      socketRef.current?.emit("message", { room: id });
    } else {
      setStatus("Message did not send — the space may have closed.");
      load();
    }
  }

  async function leave() {
    await fetch(`/api/spaces/${id}/leave`, { method: "POST" });
    router.push("/discover");
  }

  async function closeEarly() {
    const res = await fetch(`/api/spaces/${id}/close`, { method: "POST" });
    if (res.ok) load();
    else setStatus("Only the creator ends a space early.");
  }

  async function report() {
    if (!reportTarget) {
      setStatus("Choose who the report is about.");
      return;
    }
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: reportTarget, category: reportCat, spaceId: id }),
    });
    setStatus(res.ok ? "Report received. Thank you — reviewers follow up." : "Could not file the report.");
  }

  async function talkAgain(userId: string) {
    const res = await fetch(`/api/spaces/${id}/reconnect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data.connected) setStatus("Mutual — a connection request is on its way.");
    else if (res.ok) setStatus("Noted privately. Nothing is shared unless they wish so too.");
    else setStatus("Could not record that.");
    setWished((w) => [...w, userId]);
  }

  if (!space) {
    return (
      <main className="ch-wrap">
        <p>Loading space…</p>
        {status && <p className="ob-status">{status}</p>}
      </main>
    );
  }

  const names = new Map(members.map((m) => [m.id, m.nickname]));
  const open = space.state === "open";

  return (
    <main className="ch-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>{space.purpose}</h1>
      <p className="ob-sub">
        {open
          ? `${countdown()} · ${members.length} here · never permanent`
          : "This space has closed. Thanks for being here."}
      </p>

      <section className="ch-requests">
        <h2>Here ({members.length})</h2>
        <p>{members.map((m) => m.nickname).join(", ")}</p>
        {open && (
          <>
            <button className="ch-mini" onClick={leave}>Leave space</button>
            {isCreator && <button className="ch-mini" onClick={closeEarly}>End space early</button>}
          </>
        )}
        {open && isCreator && (
          <p className="ob-hint">Leaving as creator passes it to the longest-here member.</p>
        )}
      </section>

      {open ? (
        <section className="ch-thread">
          <div className="ch-msgs">
            {messages.map((m) => (
              <div key={m.id} className="ch-msg">
                <b>{m.senderId === mine ? "You" : (names.get(m.senderId) ?? "Someone")}: </b>
                {m.content}
              </div>
            ))}
            {messages.length === 0 && <p>Say hello — no rush.</p>}
          </div>
          <div className="ch-send">
            <input
              value={draft}
              maxLength={2000}
              onChange={(e) => onDraftChange(e.target.value)}
              placeholder="Write something honest…"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button onClick={send} disabled={!draft.trim()}>
              Send
            </button>
          </div>
          {typingName && <p className="ch-typing">{typingName}</p>}
        </section>
      ) : (
        <section className="ch-thread">
          <h2>Talk again?</h2>
          <p className="ob-hint">Private — they are never told unless they wish so too.</p>
          {members
            .filter((m) => m.id !== mine)
            .map((m) => (
              <div key={m.id} className="ch-req">
                <b>{m.nickname}</b>{" "}
                <button onClick={() => talkAgain(m.id)} disabled={wished.includes(m.id)}>
                  {wished.includes(m.id) ? "Wished" : "I'd talk again"}
                </button>
              </div>
            ))}
        </section>
      )}

      <section className="ch-requests">
        <h2>Report a concern</h2>
        <p className="ob-hint">Reports work during the space and for 30 days after.</p>
        <select value={reportTarget} onChange={(e) => setReportTarget(e.target.value)}>
          <option value="">Who about…</option>
          {members
            .filter((m) => m.id !== mine)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.nickname}
              </option>
            ))}
        </select>{" "}
        <select value={reportCat} onChange={(e) => setReportCat(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>{" "}
        <button onClick={report}>Send report</button>
      </section>

      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
