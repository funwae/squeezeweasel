"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isDemoMode } from "@/lib/demo-utils";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const demoMode = isDemoMode();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Auto-redirect to radar in demo mode (only once, avoid loops)
    if (demoMode && pathname === "/" && !redirected) {
      setRedirected(true);
      router.replace("/radar");
    }
  }, [demoMode, router, pathname, redirected]);

  // Show landing page only if not in demo mode
  if (demoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sw-text-secondary">Loading demo...</div>
      </div>
    );
  }

  return <LandingPage />;
}



