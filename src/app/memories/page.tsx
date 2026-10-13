"use client";

import { useRouter } from "next/navigation";
import BackButton from "../back-button";
import "../onboarding/onboarding.css";

const ITEMS: { id: string; title: string; hint: string; href: string; tone: "teal" | "plum" | "indigo" }[] = [
  {
    id: "g1",
    title: "Connection journal",
    hint: "Private notes, yours only",
    href: "/journal",
    tone: "teal",
  },
  {
    id: "g3",
    title: "Shared memories",
    hint: "Kept only together",
    href: "/memories/shared",
    tone: "plum",
  },
  {
    id: "g2",
    title: "Shared activities",
    hint: "Do something together",
    href: "/activities",
    tone: "indigo",
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
          <section key={item.id} className={`mem-door tone-${item.tone}`}>
            <button type="button" onClick={() => router.push(item.href)}>
              <span className="mem-title">{item.title}</span>
              <span className="mem-hint">{item.hint}</span>
            </button>
          </section>
        ))}
      </div>
    </main>
  );
}
