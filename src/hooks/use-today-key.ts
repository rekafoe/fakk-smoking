"use client";

import { useEffect, useState } from "react";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Re-render when the local calendar day changes (app left open overnight). */
export function useTodayKey(): string {
  const [key, setKey] = useState(todayKey);

  useEffect(() => {
    let timeoutId = 0;

    const scheduleNextMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0);
      const delay = Math.max(1000, next.getTime() - now.getTime());
      timeoutId = window.setTimeout(() => {
        setKey(todayKey());
        scheduleNextMidnight();
      }, delay);
    };

    scheduleNextMidnight();
    return () => window.clearTimeout(timeoutId);
  }, []);

  return key;
}
