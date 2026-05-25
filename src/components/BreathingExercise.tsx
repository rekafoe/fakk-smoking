"use client";

import { useEffect, useState } from "react";
import styles from "./BreathingExercise.module.css";

type Phase = "inhale" | "hold" | "exhale";

type CycleStep = { phase: Phase; seconds: number; label: string };

function initialTimerState(cycle: CycleStep[]) {
  return {
    phaseIndex: 0,
    secondsLeft: cycle[0]?.seconds ?? 4,
  };
}

export function BreathingExercise({
  active,
  cycle,
}: {
  active: boolean;
  cycle: CycleStep[];
}) {
  const [{ phaseIndex, secondsLeft }, setTimer] = useState(() =>
    initialTimerState(cycle),
  );

  useEffect(() => {
    if (!active) {
      setTimer(initialTimerState(cycle));
      return;
    }

    const tick = window.setInterval(() => {
      setTimer(({ phaseIndex: idx, secondsLeft: left }) => {
        if (left > 1) {
          return { phaseIndex: idx, secondsLeft: left - 1 };
        }
        const nextIndex = (idx + 1) % cycle.length;
        return {
          phaseIndex: nextIndex,
          secondsLeft: cycle[nextIndex].seconds,
        };
      });
    }, 1000);

    return () => window.clearInterval(tick);
  }, [active, cycle]);

  const current = cycle[phaseIndex];

  return (
    <div className={styles.root}>
      <div
        className={styles.visual}
        data-phase={current.phase}
        data-duration={String(current.seconds)}
        key={`${phaseIndex}-${current.phase}`}
      >
        <div className={styles.halo} aria-hidden="true" />
        <svg
          className={styles.ring}
          viewBox="0 0 160 160"
          aria-hidden="true"
        >
          <circle
            className={styles.ringTrack}
            cx="80"
            cy="80"
            r="70"
          />
          <circle className={styles.ringProgress} cx="80" cy="80" r="70" />
        </svg>
        <div className={styles.circle}>
          <span className={styles.seconds}>{secondsLeft}s</span>
        </div>
      </div>
      <p className={styles.phaseLabel} key={`label-${phaseIndex}`}>
        {current.label}
      </p>
    </div>
  );
}
