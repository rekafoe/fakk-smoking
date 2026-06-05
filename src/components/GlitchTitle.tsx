"use client";

import styles from "./GlitchTitle.module.css";

export const SITE_BRAND_LINE1 = "Fuck";
export const SITE_BRAND_LINE2 = "smoking";

export function GlitchTitle() {
  return (
    <h1 className={styles.title} aria-label="Fuck smoking">
      <span className={styles.line} data-text={SITE_BRAND_LINE1}>
        <span className={styles.word}>{SITE_BRAND_LINE1}</span>
        <span className={styles.slice} aria-hidden="true">
          {SITE_BRAND_LINE1}
        </span>
        <span className={`${styles.slice} ${styles.sliceAlt}`} aria-hidden="true">
          {SITE_BRAND_LINE1}
        </span>
      </span>
      <span className={styles.line} data-text={SITE_BRAND_LINE2}>
        <span className={styles.word}>{SITE_BRAND_LINE2}</span>
        <span className={styles.slice} aria-hidden="true">
          {SITE_BRAND_LINE2}
        </span>
        <span className={`${styles.slice} ${styles.sliceAlt}`} aria-hidden="true">
          {SITE_BRAND_LINE2}
        </span>
      </span>
    </h1>
  );
}
