"use client";

import type { MotionProfile } from "@/lib/motion-profile";
import styles from "./BackgroundEffects.module.css";

/** Photo smoke layers (z-0). Canvas accent is SmokeCanvasOverlay above UI. */
export function BackgroundEffects({ profile }: { profile: MotionProfile }) {
  return (
    <div className={styles.root} data-motion={profile} aria-hidden="true">
      <div className={styles.stack}>
        {profile === "static" ? (
          <div className={`${styles.layer} ${styles.layerStatic}`} />
        ) : (
          <>
            <div className={`${styles.layer} ${styles.layerBack}`} />
            {profile === "full" ? (
              <div className={`${styles.layer} ${styles.layerMid}`} />
            ) : null}
            <div className={`${styles.layer} ${styles.layerFront}`} />
          </>
        )}
      </div>
      <div className={styles.vignette} />
    </div>
  );
}
