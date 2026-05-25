"use client";

import { useEffect, useState } from "react";
import { resolveMotionProfile, type MotionProfile } from "@/lib/motion-profile";

export function useMotionProfile(): MotionProfile {
  const [profile, setProfile] = useState<MotionProfile>("full");

  useEffect(() => {
    const apply = () => {
      const next = resolveMotionProfile();
      setProfile(next);
      document.documentElement.dataset.motion = next;
    };

    apply();

    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(max-width: 900px)"),
      window.matchMedia("(prefers-reduced-data: reduce)"),
    ];

    for (const mq of queries) {
      mq.addEventListener("change", apply);
    }

    return () => {
      for (const mq of queries) {
        mq.removeEventListener("change", apply);
      }
      delete document.documentElement.dataset.motion;
    };
  }, []);

  return profile;
}
