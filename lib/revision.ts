const day = 86_400_000;
const reviewIntervals = [1,3,7,14,30];

export type Review = {dueAt: number; intervalDays: number; attempts: number; misses: number};
export const mistakeCategories = ["Unclassified","Input or output","Off-by-one","Missing edge case","Algorithm choice","Time complexity","Runtime or memory"] as const;
export type MistakeCategory = typeof mistakeCategories[number];
export type Mistake = {reason: string; category: MistakeCategory; note: string; updatedAt: number};

export function recordReview(previous: Review | undefined, correct: boolean, now: number): Review {
  if (correct && previous && now < previous.dueAt) return previous;
  const intervalDays = correct
    ? (reviewIntervals.find(interval => interval > (previous?.intervalDays ?? 0)) ?? reviewIntervals[reviewIntervals.length - 1])
    : 0;
  return {dueAt:now+intervalDays*day,intervalDays,attempts:(previous?.attempts ?? 0)+1,misses:(previous?.misses ?? 0)+(correct ? 0 : 1)};
}

export function dueReviews(records: Record<string,Review>, now: number) {
  return Object.entries(records).filter(([,review]) => review.dueAt <= now).sort((left,right) => left[1].dueAt - right[1].dueAt);
}

export function recordMistake(previous: Mistake | undefined, reason: string, now: number, category: MistakeCategory = "Unclassified"): Mistake {
  return {reason,category:previous?.category ?? category,note:previous?.note ?? "",updatedAt:now};
}

export function categoryForVerdict(verdict: string): MistakeCategory | null {
  if (verdict === "Wrong answer" || verdict === "Compilation error") return "Unclassified";
  if (verdict === "Time limit exceeded") return "Time complexity";
  if (verdict === "Runtime error" || verdict === "Memory limit exceeded") return "Runtime or memory";
  return null;
}
