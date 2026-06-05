"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function usePageView() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastSent.current) return;
    lastSent.current = pathname;

    const payload = JSON.stringify({ kind: "page_view", path: pathname });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/event", blob);
      return;
    }

    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }, [pathname]);
}
