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

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  function pick(t: Theme) {
    setTheme(t);
    applyTheme(t);
  }

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
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
        <button className="ob-go" onClick={signOut}>
          Sign out
        </button>
        <p className="ob-hint">Pausing or deleting your account lives here soon.</p>
      </section>
    </main>
  );
}
