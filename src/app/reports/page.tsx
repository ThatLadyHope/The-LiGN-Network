"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { REPORT_FLOW_LABELS } from "@/lib/safety";
import BackButton from "../back-button";
import "../onboarding/onboarding.css";

interface Report {
  id: string;
  direction: "by-me" | "against-me";
  category: string;
  review: string;
  action: string | null;
  appeal: string | null;
  createdAt: string;
  otherNickname: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [appealing, setAppealing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/reports/mine");
    if (res.status === 401) {
      router.push("/onboarding");
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.ok) setReports(data.reports ?? []);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function appeal(id: string) {
    const res = await fetch(`/api/reports/${id}/appeal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim() || undefined }),
    });
    if (res.ok) {
      setAppealing(null);
      setMessage("");
      load();
      setStatus("Appeal recorded — a reviewer will look again.");
    } else {
      setStatus(res.status === 409 ? "That report can't be appealed." : "Could not file the appeal.");
    }
  }

  const byMe = reports.filter((r) => r.direction === "by-me");
  const againstMe = reports.filter((r) => r.direction === "against-me");

  function progress(review: string) {
    const idx = REPORT_FLOW_LABELS.findIndex((s) => s.state === review);
    return REPORT_FLOW_LABELS.map((s, i) => (
      <span key={s.state} className={i <= idx ? "done" : ""}>
        {s.label}
        {i < REPORT_FLOW_LABELS.length - 1 ? " → " : ""}
      </span>
    ));
  }

  function card(r: Report) {
    const appealable = r.direction === "against-me" && (r.review === "in-review" || r.review === "actioned");
    return (
      <div key={r.id} className="ob-group-page">
        <p>
          <b>{r.direction === "by-me" ? `About ${r.otherNickname}` : `Filed by ${r.otherNickname}`}</b> · {r.category}
        </p>
        <p className="rp-flow">{progress(r.review)}</p>
        {r.action && <p className="ob-hint">Action: {r.action}</p>}
        {r.appeal && <p className="ob-hint">Your appeal: {r.appeal}</p>}
        <p className="ob-hint">{new Date(r.createdAt).toLocaleString()}</p>
        {appealable && appealing !== r.id && (
          <button
            className="ob-btn half quiet"
            onClick={() => setAppealing(r.id)}
            aria-label={`Appeal report about ${r.otherNickname}`}
          >
            Appeal
          </button>
        )}
        {appealing === r.id && (
          <>
            <label className="ob-label">
              Why should this be looked at again? (optional)
              <input className="ui-input" value={message} maxLength={2000} onChange={(e) => setMessage(e.target.value)} />
            </label>
            <button className="ob-btn half sage" onClick={() => appeal(r.id)}>
              Send appeal
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Reports</h1>
      <p className="ob-sub">Yours, both directions. False reports can be appealed.</p>

      <h2>Against me ({againstMe.length})</h2>
      {againstMe.length === 0 && <p className="ob-hint">None. Keep it that way.</p>}
      {againstMe.map(card)}

      <h2>By me ({byMe.length})</h2>
      {byMe.length === 0 && <p className="ob-hint">You have not filed any.</p>}
      {byMe.map(card)}

      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
