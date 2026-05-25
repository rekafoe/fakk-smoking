const MILESTONES_DAYS = [2, 14, 30, 90] as const;

export function daysWithoutNicotine(quitDate: Date): number {
  const start = new Date(quitDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function healingProgress(quitDate: Date): {
  percent: number;
  filledSegments: number;
} {
  const days = daysWithoutNicotine(quitDate);
  let filled = 0;
  for (const milestone of MILESTONES_DAYS) {
    if (days >= milestone) filled += 1;
  }
  const maxDay = 365;
  const percent = Math.min(100, Math.round((days / maxDay) * 100));
  return { percent, filledSegments: filled };
}
