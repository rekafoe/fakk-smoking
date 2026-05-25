"use client";

import { useEffect, useRef } from "react";
import { createSmokeEngine } from "@/lib/smoke-canvas";
import { CANVAS_FRAME_MS, type MotionProfile } from "@/lib/motion-profile";
import styles from "./SmokeCanvasOverlay.module.css";

/**
 * Canvas accent above UI (screen blend). Not behind glass — avoids backdrop-filter
 * sampling a growing gray layer and muddying cards after first paint.
 */
export function SmokeCanvasOverlay({ profile }: { profile: MotionProfile }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile !== "full") return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;

    const engine = createSmokeEngine(canvas, {
      reducedMotion: false,
      accent: true,
      simple: true,
    });

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let lastDraw = 0;
    let time = 0;
    let smoothTime = 0;
    let motionStarted = false;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      engine.resize(width, height, Math.min(window.devicePixelRatio || 1, 1.5));
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    measure();

    const frame = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;
      time += dt;

      if (now - lastDraw >= CANVAS_FRAME_MS) {
        lastDraw = now;
        if (!motionStarted) {
          smoothTime = time;
          motionStarted = true;
        } else {
          smoothTime += (time - smoothTime) * Math.min(1, dt * 0.0032);
        }
        engine.tick(dt, 1);
        engine.draw(smoothTime, 1);
      }

      if (document.visibilityState === "visible") {
        raf = requestAnimationFrame(frame);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        last = performance.now();
        lastDraw = 0;
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
  }, [profile]);

  if (profile !== "full") return null;

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
