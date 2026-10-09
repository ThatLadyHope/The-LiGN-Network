"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "../onboarding/onboarding.css";

interface Profile {
  nickname: string;
  bio: string | null;
  country: string | null;
  interests: string[];
  ageRange: string | null;
  language: string | null;
  currentNeeds: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [interests, setInterests] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.status === 401) {
      router.push("/onboarding");
      return;
    }
    const data = await res.json().catch(() => null);
    if (res.ok && data.profile) {
      setProfile(data.profile);
      setBio(data.profile.bio ?? "");
      setCountry(data.profile.country ?? "");
      setInterests((data.profile.interests ?? []).join(", "));
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setBusy(true);
    setStatus(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: bio.trim() || null,
        country: country.trim() || null,
        interests: interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 30),
      }),
    });
    if (res.ok) {
      setStatus("Profile saved.");
      load();
    } else {
      setStatus("Could not save — keep bio under 500 characters.");
    }
    setBusy(false);
  }

  if (!profile) {
    return (
      <main className="ob-wrap">
        <p>Loading profile…</p>
      </main>
    );
  }

  return (
    <main className="ob-wrap">
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>{profile.nickname}</h1>
      <p className="ob-sub">
        {[profile.ageRange, profile.language].filter(Boolean).join(" · ") || "Your identity, one per account."}
      </p>

      <label className="ob-label">
        Short bio
        <input value={bio} maxLength={500} onChange={(e) => setBio(e.target.value)} placeholder="Who are you, and how can we connect?" />
      </label>
      <label className="ob-label">
        Country / region
        <input value={country} maxLength={60} onChange={(e) => setCountry(e.target.value)} placeholder="Optional" />
      </label>
      <label className="ob-label">
        Interests (comma separated)
        <input
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g. books, night walks, tea"
        />
      </label>

      <button className="ob-go" disabled={busy} onClick={save}>
        {busy ? "Saving…" : "Save profile"}
      </button>
      {status && (
        <p className="ob-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
      <p className="ob-hint">Photos stay optional. Nothing here is ever ranked.</p>
    </main>
  );
}
