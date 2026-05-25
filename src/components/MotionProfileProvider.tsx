"use client";

import { createContext, useContext } from "react";
import { useMotionProfile } from "@/hooks/use-motion-profile";
import type { MotionProfile } from "@/lib/motion-profile";

const MotionProfileContext = createContext<MotionProfile>("full");

export function MotionProfileProvider({ children }: { children: React.ReactNode }) {
  const profile = useMotionProfile();
  return (
    <MotionProfileContext.Provider value={profile}>{children}</MotionProfileContext.Provider>
  );
}

export function useMotionProfileValue(): MotionProfile {
  return useContext(MotionProfileContext);
}
