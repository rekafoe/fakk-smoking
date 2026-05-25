import type { Locale } from "@/i18n";
import type { ProfileSnapshot } from "@/lib/profile";

const MINUTES_PER_CIGARETTE_SMOKING = 5;
const MINUTES_LIFE_PER_CIGARETTE = 11;

export type QuitStats = {
  cigarettesAvoided: number;
  moneySaved: number;
  timeSavedMinutes: number;
  lifeReclaimedMinutes: number;
};

export function msSinceQuit(quitDate: Date, now = Date.now()): number {
  return Math.max(0, now - quitDate.getTime());
}

export function cigarettesAvoided(
  quitDate: Date,
  cigarettesPerDay: number,
  now = Date.now(),
): number {
  const dayMs = 1000 * 60 * 60 * 24;
  const daysFraction = msSinceQuit(quitDate, now) / dayMs;
  return Math.floor(daysFraction * cigarettesPerDay);
}

export function computeQuitStats(
  profile: ProfileSnapshot,
  now = Date.now(),
): QuitStats | null {
  if (!profile.quitDate || !profile.cigarettesPerDay || profile.pricePerPack == null) {
    return null;
  }
  const quitDate = new Date(profile.quitDate);
  const avoided = cigarettesAvoided(quitDate, profile.cigarettesPerDay, now);
  const pricePerCig = profile.pricePerPack / profile.cigarettesPerPack;
  const moneySaved = avoided * pricePerCig;

  return {
    cigarettesAvoided: avoided,
    moneySaved,
    timeSavedMinutes: avoided * MINUTES_PER_CIGARETTE_SMOKING,
    lifeReclaimedMinutes: avoided * MINUTES_LIFE_PER_CIGARETTE,
  };
}

export function formatMoney(amount: number, currency: string, locale: Locale): string {
  const intlLocale = locale === "pl" ? "pl-PL" : "en-US";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCount(value: number, locale: Locale): string {
  const intlLocale = locale === "pl" ? "pl-PL" : "en-US";
  return new Intl.NumberFormat(intlLocale).format(value);
}

export function formatDuration(totalMinutes: number, locale: Locale): string {
  if (totalMinutes < 60) {
    return locale === "pl" ? `${totalMinutes} min` : `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  if (hours < 24) {
    return locale === "pl" ? `${hours} godz.` : `${hours} h`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  if (remHours === 0) {
    return locale === "pl" ? `${days} d` : `${days} d`;
  }
  return locale === "pl" ? `${days} d ${remHours} godz.` : `${days} d ${remHours} h`;
}
