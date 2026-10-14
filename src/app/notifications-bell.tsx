"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AGREEMENT_VERSION } from "@/lib/agreement";
import { timeAgo } from "@/lib/messaging";

interface BellItem {
  id: string;
  kind: "request" | "report" | "account" | "agreement";
  tone: "clay" | "sage" | "plum" | "indigo";
  title: string;
  detail: string | null;
  at: string | null;
  href: string | null;
  action?: { id: string; note: string | null; from: string };
}

// One bell for everything needing attention: connection requests (acted on
// inline), appealable reports, deletion notices, agreement updates. Derived
// live from existing endpoints — no new tables, nothing to dismiss, badge
// refreshes every 15 seconds.
export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<BellItem[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const [rq, rp, st] = await Promise.all([
      fetch("/api/requests/incoming").then((r) =>
        r.ok ? r.json().catch(() => null) : null,
      ),
      fetch("/api/reports/mine").then((r) =>
        r.ok ? r.json().catch(() => null) : null,
      ),
      fetch("/api/account/status").then((r) =>
        r.ok ? r.json().catch(() => null) : null,
      ),
    ]);
    const next: BellItem[] = [];
    for (const r of rq?.requests ?? []) {
      next.push({
        id: `req-${r.id}`,
        kind: "request",
        tone: "clay",
        title: `${r.sender?.nickname ?? "Someone"} wants to connect`,
        detail: r.note ?? null,
        at: r.createdAt ?? null,
        href: null,
        action: {
          id: r.id,
          note: r.note ?? null,
          from: r.sender?.nickname ?? "Someone",
        },
      });
    }
    for (const r of rp?.reports ?? []) {
      const appealable =
        r.direction === "against-me" &&
        (r.review === "in-review" || r.review === "actioned") &&
        !r.appeal;
      next.push({
        id: `rep-${r.id}`,
        kind: "report",
        tone: appealable ? "plum" : "indigo",
        title: appealable
          ? `Review your report about ${r.otherNickname}`
          : r.direction === "by-me"
            ? `Your report about ${r.otherNickname}: ${r.review}`
            : `Report by ${r.otherNickname}: ${r.review}`,
        detail: r.action ? `Action: ${r.action}` : null,
        at: r.createdAt ?? null,
        href: "/reports",
      });
    }
    if (st?.status?.pendingDeletionAt) {
      next.push({
        id: "account-deletion",
        kind: "account",
        tone: "plum",
        title: "Deletion scheduled",
        detail: `Takes effect ${new Date(st.status.pendingDeletionAt).toLocaleDateString()} — sign in or visit settings to cancel.`,
        at: null,
        href: "/settings",
      });
    }
    if (st?.status && st.status.agreementVersion !== AGREEMENT_VERSION) {
      next.push({
        id: "account-agreement",
        kind: "agreement",
        tone: "sage",
        title: "New agreement to accept",
        detail: "Our agreement changed — one read and a tick keeps you in.",
        at: null,
        href: "/agreement",
      });
    }
    // Newest first; timeless account notices float to the top.
    next.sort((a, b) => {
      if (!a.at && !b.at) return 0;
      if (!a.at) return -1;
      if (!b.at) return 1;
      return new Date(b.at).getTime() - new Date(a.at).getTime();
    });
    setItems(next);
  }, []);

  useEffect(() => {
    load();
    timer.current = setInterval(load, 15000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  async function respond(id: string, action: "accept" | "decline", from: string) {
    setBusyId(id);
    setNote(null);
    const res = await fetch(`/api/requests/${id}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusyId(null);
    if (res.ok) {
      setNote(
        action === "accept"
          ? `${from} is in — find them in Chat.`
          : "Declined quietly. They are never told why.",
      );
      load();
    } else {
      setNote("Could not respond — try again from Chat.");
    }
  }

  return (
    <div className="ntf-wrap">
      <button
        type="button"
        className="dc-menu-btn ntf-bell"
        aria-expanded={open}
        aria-label={items.length > 0 ? `Notifications, ${items.length} unread` : "Notifications, all caught up"}
        onClick={() => {
          setOpen((o) => !o);
          setNote(null);
          load();
        }}
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
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {items.length > 0 && (
          <span className="ntf-badge" aria-hidden="true">
            {items.length > 9 ? "9+" : items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="dc-drawer ntf-panel" role="menu" aria-label="Notifications">
          {items.length === 0 && (
            <p className="ntf-empty">All caught up. Quiet is good news here.</p>
          )}
          {items.map((it) => (
            <div key={it.id} className={`ntf-item tone-${it.tone}`}>
              <span className="ntf-dot" aria-hidden="true" />
              <div className="ntf-body">
                <b>{it.title}</b>
                {it.detail && <small>{it.detail}</small>}
                <span className="ntf-meta">
                  {it.at ? timeAgo(it.at) : "standing"}
                  {it.href && (
                    <>
                      {" · "}
                      <Link href={it.href} onClick={() => setOpen(false)}>
                        {it.kind === "report"
                          ? "Open reports"
                          : it.kind === "account"
                            ? "Open settings"
                            : "Review agreement"}
                      </Link>
                    </>
                  )}
                </span>
                {it.action && (
                  <span className="ntf-actions">
                    <button
                      className="ui-btn ui-btn-primary ui-btn-sm"
                      disabled={busyId === it.action.id}
                      onClick={() => respond(it.action!.id, "accept", it.action!.from)}
                    >
                      Accept
                    </button>
                    <button
                      className="ui-btn ui-btn-outline ui-btn-sm"
                      disabled={busyId === it.action.id}
                      onClick={() => respond(it.action!.id, "decline", it.action!.from)}
                    >
                      Decline
                    </button>
                  </span>
                )}
              </div>
            </div>
          ))}
          {note && (
            <p className="ntf-note" role="status">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
