"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// Visible install path: Chrome/Edge get a real Install button; iOS gets the
// Share → Add to Home Screen steps (Apple offers no prompt API). Hidden when
// already installed or dismissed.
export default function PwaInstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setDone(true);
      return;
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  useEffect(() => {
    if (dismissed || done || deferred || showIos) return;
    if (isIos() && !isStandalone()) {
      const t = setTimeout(() => setShowIos(true), 1500);
      return () => clearTimeout(t);
    }
  }, [dismissed, done, deferred, showIos]);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice.catch(() => ({ outcome: "dismissed" }));
    if ((choice as { outcome: string }).outcome === "accepted") setDone(true);
    else setDismissed(true);
    setDeferred(null);
  }

  if (done || dismissed) return null;

  if (deferred) {
    return (
      <button type="button" className="ui-btn ui-btn-outline ui-btn-block lg-install" onClick={install}>
        Install LiGN on this device
      </button>
    );
  }

  if (showIos) {
    return (
      <div className="ui-card lg-install-ios" role="note">
        <p>
          <b>Install LiGN:</b> tap <b>Share</b>, then <b>Add to Home Screen</b>.
        </p>
        <button type="button" className="ui-btn ui-btn-ghost ui-btn-sm" onClick={() => setDismissed(true)}>
          Not now
        </button>
      </div>
    );
  }

  return null;
}
