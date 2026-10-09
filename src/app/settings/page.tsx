"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { applyTheme, getTheme, type Theme } from "../theme-provider";
import "../onboarding/onboarding.css";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("light");
  const [account, setAccount] = useState<{
    accountState: string;
    pendingDeletionAt: string | null;
  } | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"why" | "pause-offer" | "confirm">("why");
  const [leaveReason, setLeaveReason] = useState("need-space");
  const [leaveMessage, setLeaveMessage] = useState("");
  const [consequences, setConsequences] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setTheme(getTheme());
    fetch("/api/account/status")
      .then((r) => {
        if (r.status === 401) router.push("/onboarding");
        return r.json().catch(() => null);
      })
      .then((d) => {
        if (d?.status) setAccount(d.status);
      })
      .catch(() => null);
  }, [router]);

  function pick(t: Theme) {
    setTheme(t);
    applyTheme(t);
  }

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
  }

  async function pause() {
    const res = await fetch("/api/account/status", { method: "POST" });
    if (res.ok) {
      const d = await res.json().catch(() => null);
      if (d?.status) setAccount(d.status);
      setStatus("Paused. You are out of discovery; your conversations wait for you.");
    } else setStatus("Could not pause right now.");
  }

  async function resume() {
    const res = await fetch("/api/account/status", { method: "DELETE" });
    if (res.ok) {
      setAccount((a) => (a ? { ...a, accountState: "ACTIVE", pendingDeletionAt: null } : a));
      setStatus("Welcome back. You are discoverable again.");
    } else setStatus("Could not resume right now.");
  }

  async function openDelete() {
    setDeleteStep("why");
    setShowDelete(true);
  }

  async function sendWhy() {
    const res = await fetch("/api/account/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: leaveReason, message: leaveMessage.trim() || undefined }),
    });
    if (!res.ok) {
      setStatus("Could not send that — you can still continue.");
    }
    setDeleteStep("pause-offer");
  }

  async function continueToConfirm() {
    const res = await fetch("/api/account/delete");
    const d = await res.json().catch(() => null);
    if (res.ok) {
      setConsequences(d.consequences ?? []);
      setDeleteStep("confirm");
    } else setStatus("Could not start deletion right now.");
  }

  async function confirmDelete() {
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: true }),
    });
    const d = await res.json().catch(() => null);
    if (res.ok) {
      setShowDelete(false);
      setStatus(`Deletion requested. Everything ends by ${new Date(d.effectiveAt).toLocaleDateString()} unless you come back — signing out now.`);
      await authClient.signOut();
      setTimeout(() => router.push("/login"), 2500);
    } else if (res.status === 409) {
      setStatus("Deletion is held while a safety review is open. Contact support if this is wrong.");
    } else setStatus("Could not request deletion.");
  }

  return (
    <main className="ob-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Settings</h1>

      <section className="ob-group-page">
        <h2>Appearance</h2>
        <p className="ob-sub">Calm by default, dark when you need it. Saved on this device.</p>
        <div className="ob-theme-row">
          <button
            type="button"
            className={theme === "light" ? "picked" : ""}
            onClick={() => pick("light")}
            aria-pressed={theme === "light"}
          >
            Light
          </button>
          <button
            type="button"
            className={theme === "dark" ? "picked" : ""}
            onClick={() => pick("dark")}
            aria-pressed={theme === "dark"}
          >
            Dark mode
          </button>
        </div>
      </section>

      <section className="ob-group-page">
        <h2>Connection</h2>
        <p>
          <Link href="/onboarding/needs">Edit your needs</Link>
        </p>
        <p>
          <Link href="/discover">Back to Discover</Link>
        </p>
      </section>

      <section className="ob-group-page">
        <h2>Account</h2>
        {account && (
          <p className="ob-sub">
            Status: {account.accountState}
            {account.pendingDeletionAt
              ? ` · deletion takes effect ${new Date(account.pendingDeletionAt).toLocaleDateString()}`
              : ""}
          </p>
        )}
        <div className="ob-btn-col">
          <button className="ob-btn half quiet" onClick={signOut}>
            Sign out
          </button>
          {account?.accountState === "PAUSED" && !account.pendingDeletionAt ? (
            <button className="ob-btn half sage" onClick={resume}>
              Resume my account
            </button>
          ) : (
            <button className="ob-btn half sage" onClick={pause}>
              Pause my account
            </button>
          )}
          {!showDelete && (
            <button className="ob-btn half danger" onClick={openDelete}>
              Delete my account…
            </button>
          )}
        </div>
        <p className="ob-hint">Pausing removes you from discovery. Conversations and data stay.</p>
        {showDelete && deleteStep === "why" && (
          <>
            <p>Sorry to see you go. Why are you leaving?</p>
            <label className="ob-label">
              Reason
              <select value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)}>
                <option value="need-space">I need space</option>
                <option value="not-a-fit">Not a good fit</option>
                <option value="boundary-issue">A boundary issue</option>
                <option value="missing-something">Missing something I need</option>
                <option value="naturally-ended">It ran its course</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <label className="ob-label">
              Anything more? (optional)
              <input
                value={leaveMessage}
                maxLength={2000}
                onChange={(e) => setLeaveMessage(e.target.value)}
                placeholder="In your own words…"
              />
            </label>
            <button className="ob-btn half sage" onClick={sendWhy}>
              Send
            </button>
          </>
        )}
        {showDelete && deleteStep === "pause-offer" && (
          <>
            <p>Thank you — that helps. Before you go: would a pause do instead?</p>
            <p className="ob-hint">Pausing removes you from discovery and keeps everything.</p>
            <button className="ob-btn half sage" onClick={pause}>
              Pause instead
            </button>{" "}
            <button className="ob-btn half danger" onClick={continueToConfirm}>
              Continue with deletion
            </button>
          </>
        )}
        {showDelete && deleteStep === "confirm" && (
          <>
            <p>Deleting removes:</p>
            <ul>
              {consequences.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="ob-hint">
              30-day cooling-off — sign in anytime within 30 days to recover. Safety holds survive deletion and are
              disclosed. This cannot be undone after the cooling period.
            </p>
            <button className="ob-btn half danger" onClick={confirmDelete}>
              Yes, delete my account
            </button>
          </>
        )}
        {status && (
          <p className="ob-status" role="status" aria-live="polite">
            {status}
          </p>
        )}
      </section>
    </main>
  );
}
