"use client";

import { useState } from "react";
import BackButton from "../back-button";
import "../onboarding/onboarding.css";

interface Record {
  id: string;
  userId: string;
  version: string;
  textSnapshot: string;
  acceptedAt: string;
  status: string;
}

// Minimal admin lookup: token-gated, shows full history + exact text.
export default function AdminPage() {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [records, setRecords] = useState<Record[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function lookup() {
    setStatus(null);
    const res = await fetch(`/api/admin/acceptances?userId=${encodeURIComponent(userId)}`, {
      headers: { "x-admin-token": token },
    });
    const data = await res.json().catch(() => null);
    if (res.ok) setRecords(data.records ?? []);
    else {
      setRecords([]);
      setStatus(res.status === 403 ? "Wrong admin token." : "Lookup failed.");
    }
  }

  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Acceptance records</h1>
      <p className="ob-sub">Authorised use only. History is append-only.</p>

      <label className="ob-label">
        Admin token
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} />
      </label>
      <label className="ob-label">
        User ID
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="cuid…" />
      </label>
      <button className="ob-go" disabled={!token || !userId} onClick={lookup}>
        Look up
      </button>

      {records.map((r) => (
        <div key={r.id} className="ob-group-page">
          <p>
            <b>v{r.version}</b> · {r.status} · {new Date(r.acceptedAt).toLocaleString()}
          </p>
          <details>
            <summary>Exact text accepted</summary>
            <p style={{ whiteSpace: "pre-wrap" }}>{r.textSnapshot}</p>
          </details>
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
