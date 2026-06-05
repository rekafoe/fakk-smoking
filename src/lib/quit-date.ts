/** Calendar quit date from ISO / DB string (YYYY-MM-DD), without timezone drift. */
export function quitDateFromIso(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

export function daysWithoutNicotine(quitDateIso: string, now = new Date()): number {
  const start = quitDateFromIso(quitDateIso);
  if (Number.isNaN(start.getTime())) return 0;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diff = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

/** Same number as «Day N» in quote / article (1 = quit day). */
export function smokeFreeDayNumber(completedDays: number): number {
  return Math.max(1, completedDays + 1);
}

export function msSinceQuit(quitDateIso: string, now = Date.now()): number {
  const start = quitDateFromIso(quitDateIso);
  if (Number.isNaN(start.getTime())) return 0;
  start.setHours(0, 0, 0, 0);
  return Math.max(0, now - start.getTime());
}
