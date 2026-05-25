export type RelapseEventDto = {
  id: string;
  occurredAt: string;
  note: string | null;
};

export function relapseFromDb(event: {
  id: string;
  occurredAt: Date;
  note: string | null;
}): RelapseEventDto {
  return {
    id: event.id,
    occurredAt: event.occurredAt.toISOString(),
    note: event.note,
  };
}

/** Pick a supportive phrase; index follows total relapse count for variety. */
export function pickEncouragingPhrase(phrases: string[], relapseCount: number): string {
  if (phrases.length === 0) return "";
  const index = Math.max(0, relapseCount - 1) % phrases.length;
  return phrases[index] ?? phrases[0];
}
