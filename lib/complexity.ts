export function estimateWork(n: number, budget: number) {
  if (!Number.isSafeInteger(n) || n < 1 || !Number.isSafeInteger(budget) || budget < 1) {
    throw new RangeError("Enter positive integer values for size and budget.");
  }

  const log = Math.max(1, Math.ceil(Math.log2(n)));
  const estimates = [
    {kind:"O(1)", work:1},
    {kind:"O(log n)", work:log},
    {kind:"O(n)", work:n},
    {kind:"O(n log n)", work:n * log},
    {kind:"O(n²)", work:n * n},
    {kind:"O(2ⁿ)", work:2 ** n},
  ];
  return estimates.map(({kind,work}) => ({kind,work:Number.isSafeInteger(work) ? work : null,fits:work <= budget}));
}
