"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "../onboarding/onboarding.css";

interface Profile {
  nickname: string;
  avatarKind: string;
  avatarColor: string | null;
  avatarUrl: string | null;
  bio: string | null;
  country: string | null;
  interests: string[];
  ageRange: string | null;
  language: string | null;
  currentNeeds: string[];
}

const AVATAR_COLORS = ["#687765", "#59627F", "#76566D", "#C96F4A", "#7D8C6F"];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarKind, setAvatarKind] = useState("none");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
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
    if (res.ok && data?.profile) {
      setProfile(data.profile);
      setAvatarKind(data.profile.avatarKind ?? "none");
      setAvatarColor(data.profile.avatarColor ?? AVATAR_COLORS[0]);
      setBio(data.profile.bio ?? "");
      setCountry(data.profile.country ?? "");
      setInterests((data.profile.interests ?? []).join(", "));
    } else if (res.status !== 401) {
      setStatus("Could not load your profile. Check your connection, then reload — or join again from Get started.");
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
        avatarKind,
        avatarColor,
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

  async function uploadPhoto(file: File) {
    setBusy(true);
    setStatus(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
    const data = await res.json().catch(() => null);
    if (res.ok) {
      setStatus("Photo saved.");
      load();
    } else if (data?.error === "storage-not-configured") {
      setStatus("Photo storage is not set up yet — pick an initial or illustration instead.");
    } else {
      setStatus("Could not save that photo (JPG/PNG/WebP under 2MB).");
    }
    setBusy(false);
  }

  if (!profile) {
    return (
      <main className="ob-wrap">
        <p>Loading profile…</p>
        {status && (
          <p className="ob-status" role="status">
            {status}
          </p>
        )}
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

      <div className="pf-avatar-row">
        <span
          className="pf-avatar"
          style={
            profile.avatarKind === "photo" && profile.avatarUrl
              ? { backgroundImage: `url(${profile.avatarUrl})` }
              : { background: avatarColor }
          }
        >
          {!(profile.avatarKind === "photo" && profile.avatarUrl) && profile.nickname.slice(0, 1).toUpperCase()}
        </span>
        <div>
          <label className="ob-label">
            Avatar (optional)
            <select value={avatarKind} onChange={(e) => setAvatarKind(e.target.value)}>
              <option value="none">None</option>
              <option value="avatar">Initial</option>
              <option value="illustration">Illustration color</option>
              <option value="photo">Photo</option>
            </select>
          </label>
          {(avatarKind === "avatar" || avatarKind === "illustration") && (
            <div className="pf-colors">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Avatar color ${c}`}
                  className={avatarColor === c ? "on" : ""}
                  style={{ background: c }}
                  onClick={() => setAvatarColor(c)}
                />
              ))}
            </div>
          )}
          {avatarKind === "photo" && (
            <label className="ob-label">
              Upload photo (JPG/PNG/WebP, ≤2MB)
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadPhoto(f);
                }}
              />
            </label>
          )}
        </div>
      </div>

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
