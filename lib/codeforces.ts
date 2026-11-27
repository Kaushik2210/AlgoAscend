export type RatingEntry = {contestId: number; contestName: string; rank: number; updatedAt: number; rating: number; delta: number};

export function normalizeHandle(raw: string | null): string | null {
  const handle = raw?.trim().toLowerCase();
  return handle && /^[a-z0-9_.-]{1,24}$/.test(handle) ? handle : null;
}

export function readRatingHistory(payload: unknown): RatingEntry[] | null {
  if (!payload || typeof payload !== "object") return null;
  const {status,result} = payload as Record<string,unknown>;
  if (status !== "OK" || !Array.isArray(result)) return null;
  const entries: RatingEntry[] = [];

  for (const row of result) {
    if (!row || typeof row !== "object") continue;
    const {contestId,contestName,rank,ratingUpdateTimeSeconds,oldRating,newRating} = row as Record<string,unknown>;
    if (typeof contestName !== "string" || typeof contestId !== "number" || typeof rank !== "number" || typeof ratingUpdateTimeSeconds !== "number" || typeof oldRating !== "number" || typeof newRating !== "number") continue;
    if (![contestId,rank,ratingUpdateTimeSeconds,oldRating,newRating].every(Number.isSafeInteger)) continue;
    entries.push({contestId,contestName,rank,updatedAt:ratingUpdateTimeSeconds*1000,rating:newRating,delta:newRating-oldRating});
  }

  return entries.sort((left,right) => right.updatedAt-left.updatedAt).slice(0,12);
}
