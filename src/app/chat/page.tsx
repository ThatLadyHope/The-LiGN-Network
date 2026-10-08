"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import "./chat.css";

interface Conversation {
  id: string;
  state: string;
  other: { id: string; nickname: string } | null;
  preview: string | null;
}

interface IncomingRequest {
  id: string;
  note: string | null;
  sender: { id: string; nickname: string; bio: string | null } | null;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [incoming, setIncoming] = useState<IncomingRequest[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [typingName, setTypingName] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const lastTypeEmit = useRef<number>(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadMessages = useCallback(async (id: string) => {
    const res = await fetch(`/api/conversations/${id}/messages`);
    if (res.status === 401) {
      router.push("/onboarding");
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.ok) setMessages(data.messages ?? []);
  }, [router]);

  const loadAll = useCallback(async () => {
    const [c, r] = await Promise.all([fetch("/api/conversations"), fetch("/api/requests/incoming")]);
    if (c.status === 401 || r.status === 401) {
      router.push("/onboarding");
      return;
    }
    const cd = await c.json().catch(() => null);
    const rd = await r.json().catch(() => null);
    setConversations(cd?.conversations ?? []);
    setIncoming(rd?.requests ?? []);
  }, [router]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const t = setInterval(() => loadMessages(activeId), 5000);
    const s = io("/chat");
    socketRef.current = s;
    s.emit("join", activeId);
    s.on("message", () => loadMessages(activeId));
    const otherName = conversations.find((c) => c.id === activeId)?.other?.nickname ?? "Someone";
    s.on("typing", () => {
      setTypingName(otherName);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTypingName(null), 3000);
    });
    return () => {
      clearInterval(t);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      setTypingName(null);
      s.emit("leave", activeId);
      s.disconnect();
      socketRef.current = null;
    };
  }, [activeId, loadMessages, conversations]);

  async function respond(id: string, action: "accept" | "decline") {
    const res = await fetch(`/api/requests/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) loadAll();
    else setStatus("Could not respond to that request.");
  }

  function onDraftChange(v: string) {
    setDraft(v);
    // Throttled presence only: at most one "typing" event per 3 seconds.
    const now = Date.now();
    if (v.trim() && activeId && now - lastTypeEmit.current > 3000) {
      lastTypeEmit.current = now;
      socketRef.current?.emit("typing", { room: activeId });
    }
  }

  async function send() {
    const text = draft.trim();
    if (!text || !activeId) return;
    setDraft("");
    const res = await fetch(`/api/conversations/${activeId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      loadMessages(activeId);
      socketRef.current?.emit("message", { room: activeId });
    } else {
      setStatus("Message did not send. Take your time and try again.");
    }
  }

  return (
    <main className="ch-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Conversations</h1>

      {incoming.length > 0 && (
        <section className="ch-requests">
          <h2>Requests</h2>
          {incoming.map((r) => (
            <div key={r.id} className="ch-req">
              <b>{r.sender?.nickname ?? "Someone"}</b>
              {r.note && <p>{r.note}</p>}
              <button onClick={() => respond(r.id, "accept")}>Accept</button>
              <button onClick={() => respond(r.id, "decline")}>Decline</button>
            </div>
          ))}
        </section>
      )}

      <div className="ch-cols">
        <aside className="ch-list">
          {conversations.map((c) => (
            <button
              key={c.id}
              className={c.id === activeId ? "on" : ""}
              onClick={() => setActiveId(c.id)}
            >
              <b>{c.other?.nickname ?? "Someone"}</b>
              <small>{c.preview ?? "Say hello — no rush."}</small>
            </button>
          ))}
          {conversations.length === 0 && <p>No conversations yet. Send a request from Discover.</p>}
        </aside>

        <section className="ch-thread">
          {!activeId && <p>Pick a conversation. Silence is normal here.</p>}
          {activeId && (
            <>
              <div className="ch-msgs">
                {messages.map((m) => (
                  <div key={m.id} className="ch-msg">
                    {m.content}
                  </div>
                ))}
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
              <p className="ob-hint">
                {typingName ? `${typingName} is typing…` : "No rush — reply whenever feels right."}
              </p>
            </>
          )}
        </section>
      </div>

      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
