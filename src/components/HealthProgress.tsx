"use client";

import { useI18n } from "@/components/LocaleProvider";
import { LungsIcon } from "@/components/LungsIcon";

const SEGMENTS = 4;

export function HealthProgress({
  percent,
  filledSegments,
}: {
  percent: number;
  filledSegments: number;
}) {
  const { t } = useI18n();

  return (
    <section className="health-block">
      <div className="health-block__header">
        <LungsIcon />
        <p className="health-block__title">{t("health.title")}</p>
      </div>
      <div className="health-block__row">
        <div className="health-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span
              key={i}
              className={
                i < filledSegments
                  ? "health-bar__segment health-bar__segment--filled"
                  : "health-bar__segment"
              }
            />
          ))}
        </div>
        <span className="health-block__percent">{percent}%</span>
      </div>
    </section>
  );
}
