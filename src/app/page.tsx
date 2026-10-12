"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

// Front door: remembered users go straight in, everyone else to signup.
export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    router.push(isSignedIn ? "/discover" : "/onboarding");
  }, [isSignedIn, isLoaded, router]);

  return (
    <main className="ob-wrap">
      <p className="ob-hint">Opening LiGN…</p>
    </main>
  );
}
