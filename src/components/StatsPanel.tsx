"use client";

import { useI18n } from "@/components/LocaleProvider";
import type { ProfileSnapshot } from "@/lib/profile";
import {
  computeQuitStats,
  formatCount,
  formatDuration,
  formatMoney,
} from "@/lib/savings";

export function StatsPanel({ profile }: { profile: ProfileSnapshot }) {
  const { locale, t } = useI18n();
  const stats = computeQuitStats(profile);
  if (!stats) return null;

  const items = [
    {
      label: t("stats.moneySaved"),
      value: formatMoney(stats.moneySaved, profile.currency, locale),
      hint: t("stats.moneyHint"),
    },
    {
      label: t("stats.notSmoked"),
      value: formatCount(stats.cigarettesAvoided, locale),
      hint: t("stats.notSmokedHint"),
    },
    {
      label: t("stats.timeSaved"),
      value: formatDuration(stats.timeSavedMinutes, locale),
      hint: t("stats.timeHint"),
    },
    {
      label: t("stats.lifeReclaimed"),
      value: formatDuration(stats.lifeReclaimedMinutes, locale),
      hint: t("stats.lifeHint"),
    },
  ];

  return (
    <section className="stats-panel" aria-label={t("stats.aria")}>
      <ul className="stats-panel__grid">
        {items.map((item) => (
          <li key={item.label} className="glass-card stats-panel__card">
            <p className="stats-panel__label">{item.label}</p>
            <p className="stats-panel__value">{item.value}</p>
            <p className="stats-panel__hint">{item.hint}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
