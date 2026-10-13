"use client";

import { useRef, useState } from "react";
import { AGREEMENT_TEXT, AGREEMENT_TITLE, AGREEMENT_VERSION, hasReachedBottom } from "@/lib/agreement";

// Reusable agreement reader: scroll-to-bottom unlocks the checkbox.
// Bottom ≠ acceptance; the parent decides what agreement enables.
export default function AgreementBox({
  onAgreed,
  showTitle = true,
  showHelp = true,
  startOpen = false,
}: {
  onAgreed: (agreed: boolean) => void;
  showTitle?: boolean;
  showHelp?: boolean;
  startOpen?: boolean;
}) {
  const [open, setOpen] = useState(startOpen);
  const [scrolledBottom, setScrolledBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);

  function onScroll() {
    const el = box.current;
    if (!el || scrolledBottom) return;
    if (hasReachedBottom(el.scrollTop, el.clientHeight, el.scrollHeight)) {
      setScrolledBottom(true);
    }
  }

  function tick(checked: boolean) {
    setAgreed(checked);
    onAgreed(checked);
  }

  const [title, ...rest] = AGREEMENT_TEXT.split("\n\n");

  if (!open) {
    return (
      <div className="ob-agree-collapsed">
        <button
          type="button"
          className="ob-agree-toggle"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-controls="lign-agreement-body"
        >
          <span>
            <b>{AGREEMENT_TITLE}</b>
            <small>Version {AGREEMENT_VERSION} — tap to read{agreed ? " · agreed" : ""}</small>
          </span>
          <span aria-hidden="true" className="ob-agree-caret">▸</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {showTitle && <h2>{AGREEMENT_TITLE}</h2>}
      <p className="ob-hint">Version {AGREEMENT_VERSION}</p>
      <button
        type="button"
        className="ob-agree-toggle open"
        onClick={() => setOpen(false)}
        aria-expanded={true}
        aria-controls="lign-agreement-body"
      >
        <span>
          <b>{AGREEMENT_TITLE}</b>
          <small>Tap to collapse</small>
        </span>
        <span aria-hidden="true" className="ob-agree-caret">▾</span>
      </button>
      <div
        ref={box}
        id="lign-agreement-body"
        className="ob-agree-box"
        tabIndex={0}
        onScroll={onScroll}
        aria-label={AGREEMENT_TITLE}
      >
        <strong>{title}</strong>
        {"\n\n" + rest.join("\n\n")}
      </div>
      {!scrolledBottom && (
        <p className="ob-hint" role="status">
          Scroll to the bottom of the agreement to continue.
        </p>
      )}
      <label className="ob-agree-check">
        <input
          type="checkbox"
          disabled={!scrolledBottom}
          checked={agreed}
          onChange={(e) => tick(e.target.checked)}
        />
        <span>I have read and agree to the LiGN Confidentiality and Connection Agreement.</span>
      </label>
      {showHelp && (
        <p className="ob-hint" id="agree-help">
          Reading alone is not acceptance — tick the box to agree.
        </p>
      )}
    </>
  );
}
