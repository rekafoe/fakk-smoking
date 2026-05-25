"use client";

import { useEffect, useMemo, useState } from "react";
import { BreathingExercise } from "@/components/BreathingExercise";
import { useI18n } from "@/components/LocaleProvider";
import { getDailyQuote } from "@/lib/daily-content";

const CRISIS_SECONDS = 3 * 60;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function EmergencyPanel({
  open,
  onClose,
  days,
  onSlipped,
}: {
  open: boolean;
  onClose: () => void;
  days: number;
  onSlipped?: () => void;
}) {
  const { locale, dict, t } = useI18n();
  const quote = useMemo(() => getDailyQuote(days, locale), [days, locale]);
  const [secondsLeft, setSecondsLeft] = useState(CRISIS_SECONDS);

  const breathingCycle = useMemo(
    () => [
      { phase: "inhale" as const, seconds: 4, label: t("emergency.breatheIn") },
      { phase: "hold" as const, seconds: 4, label: t("emergency.hold") },
      { phase: "exhale" as const, seconds: 6, label: t("emergency.breatheOut") },
    ],
    [t],
  );

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(CRISIS_SECONDS);
  }, [open]);

  useEffect(() => {
    if (!open || secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, secondsLeft]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="emergency-title">
      <div className="modal-panel">
        <div className="modal-panel__header">
          <h2 id="emergency-title" className="modal-panel__title">
            {t("emergency.title")}
          </h2>
          <button type="button" className="btn modal-panel__close" onClick={onClose}>
            {t("emergency.close")}
          </button>
        </div>

        <p className="breathing-guide">{t("emergency.breathingGuide")}</p>
        <BreathingExercise active={open} cycle={breathingCycle} />

        <blockquote className="crisis-motivation">{quote}</blockquote>

        <div className="crisis-timer">
          <div className="crisis-timer__value">{formatTime(secondsLeft)}</div>
          <p className="crisis-timer__label">{t("emergency.timerLabel")}</p>
        </div>

        <ul className="crisis-reasons">
          {dict.emergency.reasons.map((item: { title: string; body: string }) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>

        {onSlipped ? (
          <button type="button" className="btn relapse-section__cta" onClick={onSlipped}>
            {t("emergency.slipped")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
