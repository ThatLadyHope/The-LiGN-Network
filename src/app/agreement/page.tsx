"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AgreementBox from "../agreement-box";
import "../onboarding/onboarding.css";

// Re-acceptance: when the agreement gains a new version, signed-in users on
// an old version land here (from login) until they accept the current one.
export default function AgreementPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!agreed) {
      setStatus("Please read the agreement and tick the box to continue.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/agreements/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setBusy(false);
    if (res.ok) router.push("/discover");
    else if (res.status === 401) router.push("/onboarding");
    else setStatus("Could not record that — try again.");
  }

  return (
    <main className="ob-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Updated agreement</h1>
      <p className="ob-sub">Our agreement changed. Please read and accept to continue.</p>
      <AgreementBox onAgreed={setAgreed} />
      <button className="ob-go ui-btn" disabled={!agreed || busy} onClick={submit}>
        {busy ? "Recording…" : "Accept and continue"}
      </button>
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </main>
  );
}
