"use client";

import { useEffect, useRef, useState } from "react";
import { createSmokeEngine } from "@/lib/smoke-canvas";
import styles from "./BackgroundEffects.module.css";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Photo-based smoke layers + optional subtle canvas wisps — mounted via Providers. */
export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const engine = createSmokeEngine(canvas, { reducedMotion: false, accent: true });

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let time = 0;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      engine.resize(width, height, window.devicePixelRatio || 1);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    measure();

    const frame = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      time += dt;
      engine.tick(dt, 1);
      engine.draw(time, 1);
      if (document.visibilityState === "visible") {
        raf = requestAnimationFrame(frame);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    engine.draw(0, 1);
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      engine.destroy();
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.stack}>
        {reducedMotion ? (
          <div className={`${styles.layer} ${styles.layerStatic}`} />
        ) : (
          <>
            <div className={`${styles.layer} ${styles.layerBack}`} />
            <div className={`${styles.layer} ${styles.layerMid}`} />
            <div className={`${styles.layer} ${styles.layerFront}`} />
          </>
        )}
      </div>
      {!reducedMotion ? <canvas ref={canvasRef} className={styles.canvasAccent} /> : null}
      <div className={styles.vignette} />
    </div>
  );
}
