import { daysWithoutNicotine } from "@/lib/quit-date";

const MILESTONES_DAYS = [2, 14, 30, 90] as const;

export { daysWithoutNicotine, smokeFreeDayNumber } from "@/lib/quit-date";

export function healingProgress(quitDateIso: string): {
  percent: number;
  filledSegments: number;
} {
  const days = daysWithoutNicotine(quitDateIso);
  let filled = 0;
  for (const milestone of MILESTONES_DAYS) {
    if (days >= milestone) filled += 1;
  }
  const maxDay = 365;
  const percent = Math.min(100, Math.round((days / maxDay) * 100));
  return { percent, filledSegments: filled };
}
