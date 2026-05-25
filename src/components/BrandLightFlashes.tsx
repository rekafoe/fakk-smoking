"use client";

import { useMotionProfileValue } from "@/components/MotionProfileProvider";
import styles from "./BrandLightFlashes.module.css";

/** Soft light bursts only behind the FUCK / SMOKE logo. */
export function BrandLightFlashes() {
  const profile = useMotionProfileValue();

  if (profile === "static") return null;

  const showSecond = profile === "full";

  return (
    <div className={styles.root} aria-hidden="true">
      <span className={`${styles.flash} ${styles.flashA}`} />
      {showSecond ? <span className={`${styles.flash} ${styles.flashB}`} /> : null}
    </div>
  );
}
