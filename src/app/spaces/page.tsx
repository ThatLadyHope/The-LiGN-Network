"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "../discover/discover.css";

interface SpaceRow {
  id: string;
  purpose: string;
  state: string;
  closesAt: string;
}

function deletableAfter(closesAt: string): string {
  return new Date(new Date(closesAt).getTime() + 30 * 86400000).toLocaleDateString();
}

export default function SpacesPage() {
  const router = useRouter();
  const [open, setOpen] = useState<SpaceRow[]>([]);
  const [ended, setEnded] = useState<SpaceRow[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [o, c] = await Promise.all([
      fetch("/api/spaces").then((r) => {
        if (r.status === 401) router.push("/onboarding");
        return r.json().catch(() => null);
      }),
      fetch("/api/spaces?state=closed").then((r) => r.json().catch(() => null)),
    ]);
    setOpen(o?.spaces ?? []);
    setEnded(c?.spaces ?? []);
    setSelected([]);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function deleteSelected() {
    const results = await Promise.all(
      selected.map((id) => fetch(`/api/spaces/${id}`, { method: "DELETE" })),
    );
    const blocked = results.filter((r) => r.status === 409).length;
    await load();
    setStatus(
      blocked > 0
        ? `${blocked} kept: reports stay possible for 30 days after a space ends.`
        : "Deleted from your history.",
    );
  }

  return (
    <main className="dc-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Your spaces</h1>

      <section className="dc-space">
        <h3>Open now</h3>
        {open.length === 0 && <p className="ob-hint">None open. Start one from Discover.</p>}
        {open.map((s) => (
          <p key={s.id} className="dc-open">
            <Link href={`/spaces/${s.id}`}>{s.purpose}</Link> — open until{" "}
            {new Date(s.closesAt).toLocaleTimeString()}
          </p>
        ))}
      </section>

      <section className="dc-space">
        <h3>Ended</h3>
        <p className="ob-hint">History can be deleted 30 days after a space ends, once reports expire.</p>
        {ended.length === 0 && <p className="ob-hint">No ended spaces yet.</p>}
        {ended.map((s) => (
          <p key={s.id}>
            <label>
              <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />{" "}
              <Link href={`/spaces/${s.id}`}>{s.purpose}</Link>{" "}
              <small>· deletable after {deletableAfter(s.closesAt)}</small>
            </label>
          </p>
        ))}
        {selected.length > 0 && (
          <button className="dc-act solid-clay" onClick={deleteSelected}>
            Delete selected ({selected.length})
          </button>
        )}
      </section>

      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
