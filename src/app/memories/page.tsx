"use client";

import { useRouter } from "next/navigation";
import BackButton from "../back-button";
import "../onboarding/onboarding.css";

const ITEMS: { id: string; title: string; hint: string; href: string; color: string }[] = [
  {
    id: "g1",
    title: "Connection journal",
    hint: "Private notes, yours only",
    href: "/journal",
    color: "#687765",
  },
  {
    id: "g3",
    title: "Shared memories",
    hint: "Kept only together",
    href: "/memories/shared",
    color: "#76566D",
  },
  {
    id: "g2",
    title: "Shared activities",
    hint: "Do something together",
    href: "/activities",
    color: "#59627F",
  },
];

export default function MemoriesHubPage() {
  const router = useRouter();
  return (
    <main className="ob-wrap">
      <BackButton />
      <div className="ob-wordmark">
        The <em>LiGN</em> Network
      </div>
      <h1>Memories</h1>
      <p className="ob-sub">What you keep — alone or together.</p>

      <div className="ob-groups">
        {ITEMS.map((item) => (
          <section key={item.id} className="ob-group" style={{ background: item.color, borderColor: item.color }}>
            <button
              type="button"
              className="need"
              style={{ background: "transparent", borderColor: "rgba(255,255,255,.45)" }}
              onClick={() => router.push(item.href)}
            >
              {item.title}
              <small>{item.hint}</small>
            </button>
          </section>
        ))}
      </div>
    </main>
  );
}
