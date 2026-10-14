"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import PwaInstallButton from "./pwa-install-button";
import "./landing.css";

export default function LandingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.push("/discover");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <main className="lg-wrap">
        <p className="ob-hint">Opening LiGN…</p>
      </main>
    );
  }

  return (
    <main className="lg-wrap anim-in">
      <div className="ob-wordmark lg-brand">
        The <em>LiGN</em> Network
      </div>
      <p className="lg-eyebrow">Platonic human connection</p>
      <h1>
        Come as you are.
        <br />
        Leave less alone.
      </h1>
      <p className="lg-sub">
        LiGN matches you one-on-one with someone who needs what you need — no feeds, no followers,
        no performance. Just honest conversation, at your pace, on your terms.
      </p>

      <div className="lg-cta">
        <Link className="ob-go ui-btn lg-cta-main" href="/onboarding">
          Get Started
        </Link>
        <PwaInstallButton />
        <Link className="lg-signin" href="/login">
          I already belong — sign in
        </Link>
      </div>

      <section className="lg-trio" aria-label="What LiGN is">
        <div className="lg-card tone-teal">
          <h2>1-on-1 connections</h2>
          <p>Matched on your current need first — venting, listening, quiet company, deep talk.</p>
        </div>
        <div className="lg-card tone-indigo">
          <h2>Temporary spaces</h2>
          <p>Small rooms of 3–8 for an hour or two. Faces stay inside; nothing is permanent.</p>
        </div>
        <div className="lg-card tone-plum">
          <h2>Listener mode</h2>
          <p>Anonymous peer support from volunteers — never professional care, always human.</p>
        </div>
      </section>

      <section className="lg-safety" aria-label="Safety promise">
        <h2>Safe by structure, not by promise</h2>
        <p>
          A confidentiality agreement every member signs · pause or leave anytime · block and report
          built into every conversation · your journal stays yours alone.
        </p>
      </section>

      <footer className="lg-foot">
        <p>No feeds. No followers. No rankings. Ever.</p>
      </footer>
    </main>
  );
}
