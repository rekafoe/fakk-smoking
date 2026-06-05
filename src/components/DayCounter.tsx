"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";

export function DayCounter({ dayNumber }: { dayNumber: number }) {
  const { t } = useI18n();
  const display = dayNumber > 0 ? String(dayNumber) : "0";
  const digitCount = Math.max(display.length, 1);
  const [pulse, setPulse] = useState(false);
  const prevDayNumber = useRef(dayNumber);

  useEffect(() => {
    if (prevDayNumber.current === dayNumber) return;
    prevDayNumber.current = dayNumber;
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 640);
    return () => window.clearTimeout(timer);
  }, [dayNumber]);

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
          <span className="day-display__digits">{display}</span>
          <div className="day-display__split" aria-hidden="true" />
        </div>
      </div>
      <p className="glass-card__footer">{t("counter.footer")}</p>
    </section>
  );
}
