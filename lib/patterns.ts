type PatternOption = {id: string; label: string; explanation: string};
type PatternChallenge = {id: string; title: string; prompt: string; constraint: string; answer: string; options: PatternOption[]; followUp: string};

export const patternChallenges: PatternChallenge[] = [
  {
    id:"early-alert",title:"The first alert",
    prompt:"A station logs sensor readings in ascending order. Find the earliest index whose reading is at least a given alert threshold.",
    constraint:"Up to 1,000,000 readings and 20,000 independent threshold queries. The readings stay in the same order.",
    answer:"binary",followUp:"What changes if readings arrive unsorted and you must preserve the original indexes?",
    options:[
      {id:"linear",label:"Scan from the first reading for each query",explanation:"A scan returns the right answer, but a threshold above every reading forces a million checks per query."},
      {id:"binary",label:"Halve the range using the threshold as a boundary",explanation:"The condition reading ≥ threshold changes from false to true at most once. When the middle qualifies, keep looking left. When it fails, discard the middle and everything earlier."},
      {id:"set",label:"Build a set and check whether the threshold exists",explanation:"If the readings are [2, 4, 9] and the threshold is 5, the earliest qualifying index is 2 even though the set does not contain 5."},
    ],
  },
  {
    id:"signed-range",title:"The balancing window",
    prompt:"Find the longest contiguous stretch of signed adjustments that adds to a target total.",
    constraint:"Up to 200,000 adjustments. Values can be positive, zero, or negative.",
    answer:"prefix",followUp:"For [3, −2, 2], what prefix values repeat? What does a repeat tell you about the stretch between them?",
    options:[
      {id:"window",label:"Shrink the left side whenever the sum exceeds the target",explanation:"For [5, −2] and target 3, shrinking immediately after 5 loses the valid full window. A negative value can bring an oversized sum back down."},
      {id:"quadratic",label:"Start a new sum at every index",explanation:"This considers every candidate, but up to about 20 billion start/end pairs makes the approach impractical at the stated limit."},
      {id:"prefix",label:"Track the earliest index of each cumulative total",explanation:"A stretch sums to target when two prefix totals differ by target. At each end, look for the earliest prefix equal to current total minus target. The earliest match gives the longest stretch ending here."},
    ],
  },
  {
    id:"next-reading",title:"The next higher reading",
    prompt:"For every reading, find the first strictly higher value to its right. Output a missing result when no higher reading exists.",
    constraint:"Up to 200,000 readings in arbitrary order. Readings can repeat.",
    answer:"stack",followUp:"Trace [4, 4, 7]. Both 4s should find the 7. Why should equal readings stay pending?",
    options:[
      {id:"stack",label:"Keep pending indexes and resolve them when a higher value arrives",explanation:"Keep unresolved indexes in a stack whose values are nonincreasing. A higher reading resolves smaller values at the top. Each index enters and leaves at most once."},
      {id:"binary",label:"Binary search the readings to the right of each value",explanation:"In [4, 6, 1, 7], the first higher reading after 4 is 6. The qualifying predicate is true, then false, then true. Binary search cannot safely remove half."},
      {id:"sort",label:"Sort by value and read the next position",explanation:"Sorting loses the required rightward order. In [7, 4, 6], the 7 is higher than 4 but lies to its left. The correct match for 4 is 6."},
    ],
  },
];

export function evaluatePattern(id: string,optionId: string) {
  const challenge = patternChallenges.find(item => item.id === id);
  const option = challenge?.options.find(item => item.id === optionId);
  if (!challenge || !option) return null;
  return {correct:option.id === challenge.answer,explanation:option.explanation};
}
