"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

// Front door: remembered users go straight in, everyone else to signup.
export default function Home() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    router.push(data?.user ? "/discover" : "/onboarding");
  }, [data, isPending, router]);

  return (
    <main className="ob-wrap">
      <p className="ob-hint">Opening LiGN…</p>
    </main>
  );
}
