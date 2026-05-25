"use client";

import { BackgroundEffects } from "@/components/BackgroundEffects";
import { MotionProfileProvider, useMotionProfileValue } from "@/components/MotionProfileProvider";
import { SmokeCanvasOverlay } from "@/components/SmokeCanvasOverlay";

function ViewportSceneLayers() {
  const profile = useMotionProfileValue();

  return (
    <>
      <BackgroundEffects profile={profile} />
      <SmokeCanvasOverlay profile={profile} />
    </>
  );
}

export function ViewportScene({ children }: { children: React.ReactNode }) {
  return (
    <MotionProfileProvider>
      <div className="viewport-scene">
        <ViewportSceneLayers />
        <div className="viewport-scene__ui">{children}</div>
      </div>
    </MotionProfileProvider>
  );
}
