"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";

export function DayCounter({ days }: { days: number }) {
  const { t } = useI18n();
  const display = String(Math.max(0, days));
  const digitCount = Math.max(display.length, 1);
  const [pulse, setPulse] = useState(false);
  const prevDays = useRef(days);

  useEffect(() => {
    if (prevDays.current === days) return;
    prevDays.current = days;
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 640);
    return () => window.clearTimeout(timer);
  }, [days]);

  return (
    <section className="glass-card glass-card--counter" aria-label={t("counter.aria")}>
      <p className="glass-card__label">{t("counter.label")}</p>
      <div
        className={`day-display${pulse ? " day-display--pulse" : ""}`}
        data-length={digitCount}
        role="status"
        aria-live="polite"
        aria-label={`${display} ${t("counter.footer")}`}
      >
        <div className="day-display__face">
          <div className="day-display__segment day-display__segment--upper">
            <span className="day-display__digits">{display}</span>
          </div>
          <div className="day-display__split" aria-hidden="true" />
          <div className="day-display__segment day-display__segment--lower" aria-hidden="true">
            <span className="day-display__digits">{display}</span>
          </div>
        </div>
      </div>
      <p className="glass-card__footer">{t("counter.footer")}</p>
    </section>
  );
}
