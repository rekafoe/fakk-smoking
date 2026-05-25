/** Device-aware motion tiers — keeps smoke pretty on desktop, smooth on weak GPUs. */

export type MotionProfile = "full" | "lite" | "static";

export function resolveMotionProfile(): MotionProfile {
  if (typeof window === "undefined") return "full";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }

  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const saveData = window.matchMedia("(prefers-reduced-data: reduce)").matches;

  /* lite = меньше дыма/canvas; стекло не утяжеляем (не по числу ядер) */
  if (narrow || saveData) {
    return "lite";
  }

  return "full";
}

export const CANVAS_TARGET_FPS = 30;
export const CANVAS_FRAME_MS = 1000 / CANVAS_TARGET_FPS;
