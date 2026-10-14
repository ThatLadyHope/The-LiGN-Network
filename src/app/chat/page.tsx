"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { io, type Socket } from "socket.io-client";
import { dayLabel, messageTick, timeLabel } from "@/lib/messaging";
import "./chat.css";

interface Conversation {
  id: string;
  connectionId: string;
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
  const [otherSeenAt, setOtherSeenAt] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [typingName, setTypingName] = useState<string | null>(null);
  const [threadState, setThreadState] = useState<string>("ACTIVE");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [reportCat, setReportCat] = useState("discomfort");
  const socketRef = useRef<Socket | null>(null);
  const lastTypeEmit = useRef<number>(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isLoaded: authLoaded, isSignedIn } = useUser();
  const unauthTries = useRef(0);
  const authRef = useRef({ loaded: false, signedIn: false });
  authRef.current = { loaded: authLoaded, signedIn: !!isSignedIn };

  // A 401 while Clerk is still warming up (slow networks read as signed-out
  // for a second or two) is NOT a logout: retry before concluding anything.
  function handleUnauthorized(retry: () => void) {
    const a = authRef.current;
    if (!a.loaded || (a.signedIn && unauthTries.current < 3)) {
      unauthTries.current += 1;
      setTimeout(retry, 1500);
      return;
    }
    unauthTries.current = 0;
    router.push("/onboarding");
  }

  const loadMessages = useCallback(async (id: string) => {
    const res = await fetch(`/api/conversations/${id}/messages`);
    if (res.status === 401) {
      handleUnauthorized(() => loadMessages(id));
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setMessages(data.messages ?? []);
      setOtherSeenAt(data.otherSeenAt ?? null);
      if (data.state) setThreadState(data.state);
    }
  }, [router]);

  const loadAll = useCallback(async () => {
    const [c, r] = await Promise.all([fetch("/api/conversations"), fetch("/api/requests/incoming")]);
    if (c.status === 401 || r.status === 401) {
      handleUnauthorized(() => loadAll());
      return;
    }
    unauthTries.current = 0;
    const cd = await c.json().catch(() => null);
    const rd = await r.json().catch(() => null);
    setConversations(cd?.conversations ?? []);
    setIncoming(rd?.requests ?? []);
  }, [router]);

  useEffect(() => {
    loadAll().finally(() => setLoadingList(false));
  }, [loadAll]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    // Background tabs don't poll: most production load is idle tabs.
    const t = setInterval(() => {
      if (!document.hidden) loadMessages(activeId);
    }, 8000);
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

  const activeConvo = conversations.find((c) => c.id === activeId) ?? null;
  const otherId = activeConvo?.other?.id ?? null;
  const isMine = (senderId: string) => (otherId ? senderId !== otherId : false);
  // The icebreaker prompt retires once you've sent anything in the thread —
  // thread history counts, so it stays gone across reloads.
  const hasSent = messages.some((m) => isMine(m.senderId));
  const inputPlaceholder =
    threadState !== "ACTIVE"
      ? "This conversation is not active."
      : hasSent
        ? "Message…"
        : "Write something honest…";

  // One tick = stored on LiGN's server. Two ticks = the other person opened
  // this thread after the message was sent. Nothing in between is claimed.
  function Tick({ at }: { at: string }) {
    const seen = messageTick(at, otherSeenAt) === "seen";
    return (
      <svg
        className={seen ? "ch-tick seen" : "ch-tick"}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="img"
        aria-label={seen ? "Seen" : "Sent"}
      >
        {seen ? (
          <>
            <path d="m2.5 12.5 4.5 4.5L14.5 9.5" />
            <path d="m10 14.5 1.5 1.5L21.5 6" />
          </>
        ) : (
          <path d="m4.5 12.5 5 5L19.5 7" />
        )}
        <title>{seen ? "Seen" : "Sent"}</title>
      </svg>
    );
  }

  async function pauseResume() {
    if (!activeConvo) return;
    const action = threadState === "PAUSED" ? "resume" : "pause";
    const res = await fetch(`/api/connections/${activeConvo.connectionId}/${action}`, { method: "POST" });
    if (res.ok) {
      setThreadState(action === "pause" ? "PAUSED" : "ACTIVE");
      loadAll();
    } else setStatus("Could not change that right now.");
  }

  async function endThread() {
    if (!activeConvo) return;
    const res = await fetch(`/api/connections/${activeConvo.connectionId}/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      setThreadState("ENDED");
      setConfirmEnd(false);
      loadAll();
    } else setStatus("Could not end that right now.");
  }

  async function blockOther() {
    if (!activeConvo?.other) return;
    const res = await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeConvo.other.id }),
    });
    if (res.ok) {
      setStatus("Blocked. You will not see each other around LiGN anymore.");
      setActiveId(null);
      loadAll();
    } else setStatus("Could not block right now.");
  }

  async function reportOther() {
    if (!activeConvo?.other) return;
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: activeConvo.other.id, category: reportCat }),
    });
    setStatus(res.ok ? "Report received. Reviewers follow up — thank you." : "Could not file the report.");
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
              <button className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => respond(r.id, "accept")}>Accept</button>
              <button className="ui-btn ui-btn-outline ui-btn-sm" onClick={() => respond(r.id, "decline")}>Decline</button>
            </div>
          ))}
        </section>
      )}

      <div className="ch-cols">
        <aside className="ch-list" aria-label="Conversations">
          {loadingList ? (
            <>
              <div className="ui-skeleton" style={{ height: 64 }} />
              <div className="ui-skeleton" style={{ height: 64 }} />
              <div className="ui-skeleton" style={{ height: 64 }} />
            </>
          ) : (
            conversations.map((c) => (
            <button
              key={c.id}
              className={c.id === activeId ? "on" : ""}
              onClick={() => setActiveId(c.id)}
            >
              <b>{c.other?.nickname ?? "Someone"}</b>
              <small>{c.preview ?? "Say hello — no rush."}</small>
            </button>
            ))
          )}
          {!loadingList && conversations.length === 0 && <p>No conversations yet. Send a request from Discover.</p>}
        </aside>

        <section className="ch-thread">
          {!activeId && <p>Pick a conversation. Silence is normal here.</p>}
          {activeId && activeConvo && (
            <>
              <div className="ch-head">
                <span className="ch-who">
                  <b>{activeConvo.other?.nickname ?? "Someone"}</b>
                  <span className="ch-state">{threadState === "ACTIVE" ? "Active" : threadState === "PAUSED" ? "Paused — taking space." : "Ended."}</span>
                </span>
                {threadState !== "ENDED" && (
                  <details className="ch-more">
                    <summary className="ui-btn ui-btn-ghost ui-btn-sm">
                      More
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="5" r="1.8" />
                        <circle cx="12" cy="12" r="1.8" />
                        <circle cx="12" cy="19" r="1.8" />
                      </svg>
                    </summary>
                    <div className="ch-more-body">
                    <button className="ui-btn ui-btn-ghost ui-btn-sm" onClick={pauseResume}>{threadState === "PAUSED" ? "Resume" : "Pause"}</button>
                    {confirmEnd ? (
                      <>
                        <button className="ui-btn ui-btn-ghost ui-btn-sm" onClick={endThread}>Confirm end</button>
                        <button className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => setConfirmEnd(false)}>Keep</button>
                      </>
                    ) : (
                      <button className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => setConfirmEnd(true)}>End</button>
                    )}
                    <button className="ui-btn ui-btn-ghost ui-btn-sm" onClick={blockOther}>Block</button>
                    <select value={reportCat} onChange={(e) => setReportCat(e.target.value)} aria-label="Report category">
                      <option value="discomfort">Discomfort</option>
                      <option value="boundary-violation">Boundary violation</option>
                      <option value="harassment">Harassment</option>
                      <option value="serious-violation">Serious violation</option>
                      <option value="credible-threat">Credible threat</option>
                      <option value="exploitation">Exploitation</option>
                      <option value="other-high-risk">Other high risk</option>
                    </select>
                    <button className="ui-btn ui-btn-ghost ui-btn-sm" onClick={reportOther}>Report</button>
                    </div>
                  </details>
                )}
              </div>
              <div className="ch-msgs">
                {(() => {
                  const rows: ReactNode[] = [];
                  let lastDay = "";
                  messages.forEach((m) => {
                    const day = dayLabel(m.createdAt);
                    if (day !== lastDay) {
                      lastDay = day;
                      rows.push(
                        <div key={`day-${m.id}`} className="ch-day">
                          <span className="ui-badge">{day}</span>
                        </div>,
                      );
                    }
                    // Mine = anything not from the other side (no extra API
                    // call: the thread only ever has two people).
                    const mine = activeConvo.other ? m.senderId !== activeConvo.other.id : false;
                    rows.push(
                      <div key={m.id} className={mine ? "ch-row mine" : "ch-row theirs"}>
                        <div className={mine ? "ch-bubble mine" : "ch-bubble theirs"}>
                          <p>{m.content}</p>
                          <span className="ch-meta">
                            {timeLabel(m.createdAt)}
                            {mine && <Tick at={m.createdAt} />}
                          </span>
                        </div>
                      </div>,
                    );
                  });
                  return rows;
                })()}
              </div>
              <div className="ch-send">
                <input
                  value={draft}
                  maxLength={2000}
                  disabled={threadState !== "ACTIVE"}
                  onChange={(e) => onDraftChange(e.target.value)}
                  placeholder={inputPlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                />
                <button
                  onClick={send}
                  disabled={!draft.trim() || threadState !== "ACTIVE"}
                  aria-label="Send message"
                  title="Send"
                  className="ch-sendbtn"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 12 3.269 3.125A59.768 59.768 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              {typingName && <p className="ch-typing">{typingName} is typing…</p>}
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
