import type { ProfileSnapshot } from "@/lib/profile";
import { msSinceQuit } from "@/lib/quit-date";

const MINUTES_PER_CIGARETTE_SMOKING = 5;
const MINUTES_LIFE_PER_CIGARETTE = 11;

export type QuitStats = {
  cigarettesAvoided: number;
  moneySaved: number;
  timeSavedMinutes: number;
  lifeReclaimedMinutes: number;
};

export function cigarettesAvoided(
  quitDateIso: string,
  cigarettesPerDay: number,
  now = Date.now(),
): number {
  const dayMs = 1000 * 60 * 60 * 24;
  const daysFraction = msSinceQuit(quitDateIso, now) / dayMs;
  return Math.floor(daysFraction * cigarettesPerDay);
}

export function computeQuitStats(
  profile: ProfileSnapshot,
  now = Date.now(),
): QuitStats | null {
  if (!profile.quitDate || !profile.cigarettesPerDay || profile.pricePerPack == null) {
    return null;
  }
  const avoided = cigarettesAvoided(profile.quitDate, profile.cigarettesPerDay, now);
  const pricePerCig = profile.pricePerPack / profile.cigarettesPerPack;
  const moneySaved = avoided * pricePerCig;

  return {
    cigarettesAvoided: avoided,
    moneySaved,
    timeSavedMinutes: avoided * MINUTES_PER_CIGARETTE_SMOKING,
    lifeReclaimedMinutes: avoided * MINUTES_LIFE_PER_CIGARETTE,
  };
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  if (hours < 24) {
    return `${hours} h`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  if (remHours === 0) {
    return `${days} d`;
  }
  return `${days} d ${remHours} h`;
}
