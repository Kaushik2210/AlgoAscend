import { defineTopics } from "./define.ts";

export const maskAssignments = defineTopics([
  {
    "id": "bitmask-dp",
    "stage": 9,
    "title": "Bitmask DP for assignments",
    "objective": "Use a subset as the state for a minimum-cost one-to-one assignment.",
    "prerequisites": "Bitmasks, popcount, and tabulation.",
    "analogy": "A checklist records which booths already have someone assigned. It also tells you which worker should be placed next.",
    "explanation": "Assign workers in index order. A mask holds the booths already used. The next worker’s index is popcount(mask). For each unset bit, extend the partial optimum by assigning that booth. Store the best cost for each new mask. An unset-to-set transition always increases the mask, so numeric mask order works.",
    "invariant": "dp[mask] is the smallest cost for assigning the first popcount(mask) workers to exactly the booths in mask.",
    "pseudocode": "dp[0]=0; all other states=infinity\nfor mask:\n  worker=popcount(mask)\n  for each unused booth j:\n    next=mask with bit j set\n    dp[next]=min(dp[next],dp[mask]+cost[worker][j])\nprint dp[all bits]",
    "time": "O(n 2ⁿ) for n workers",
    "space": "O(2ⁿ+n²) for masks and costs",
    "trace": [
      [
        "Costs [[5,1],[2,8]]",
        "Mask 00 means no booths and no workers assigned."
      ],
      [
        "Worker 0 takes booth 1",
        "Mask 10 gets cost 1. Alternatively mask 01 gets cost 5."
      ],
      [
        "Mask 10 extends to 11",
        "Assign worker 1 to booth 0 for cost 2. Total is 3."
      ],
      [
        "Mask 01 also extends to 11",
        "Its total is 13. Keep 3 as the optimum."
      ]
    ],
    "misconception": "A single cost per assigned-worker count loses which booths remain available.",
    "debug": "Use two rows whose individually cheapest booth is the same. Only one worker may use it.",
    "fill": "Which bit operation sets an unused booth j?",
    "edgeCases": [
      "The empty state has cost zero.",
      "Negative costs remain valid because the state graph is acyclic.",
      "Each booth is used once in the full mask."
    ],
    "revision": "Why is worker index derivable from the mask without storing it separately?",
    "further": "Keep a predecessor per mask to recover one optimal assignment.",
    "quiz": {
      "question": "A mask contains three set bits. Which worker is assigned next with zero-based numbering?",
      "answers": [
        "2",
        "3",
        "4"
      ],
      "correct": 1,
      "feedback": "Workers zero, one, and two have been assigned. Worker three is next."
    },
    "practice": {
      "title": "Assign crews to booths",
      "description": "Assign each crew a distinct booth and minimize the total cost.",
      "format": "Read n, then n rows of n signed costs. Print the minimum assignment cost.",
      "constraints": "1 ≤ n ≤ 12 and |cost| ≤ 10⁵.",
      "input": "2\n5 1\n2 8\n",
      "output": "3\n",
      "hints": [
        "A mask tracks booths already used.",
        "Use its set-bit count to determine the next crew."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, cost[12][12], dp[4096], count[4096] = {0};
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) scanf("%d", &cost[i][j]);
    int limit = 1 << n;
    dp[0] = 0;
    for (int mask = 1; mask < limit; mask++) {
        dp[mask] = 1000000000;
        count[mask] = count[mask >> 1] + (mask & 1);
    }
    for (int mask = 0; mask < limit - 1; mask++) {
        for (int j = 0; j < n; j++) {
            int bit = 1 << j;
            if (mask & bit) continue;
            int next = mask | bit, candidate = dp[mask] + cost[count[mask]][j];
            if (candidate < dp[next]) dp[next] = candidate;
        }
    }
    printf("%d\\n", dp[limit - 1]);
    return 0;
}`,
      python: `n = int(input())
cost = [list(map(int, input().split())) for _ in range(n)]
limit = 1 << n
dp = [0] + [10**9] * (limit - 1)
for mask in range(limit - 1):
    worker = mask.bit_count()
    for j in range(n):
        bit = 1 << j
        if not mask & bit:
            nxt = mask | bit
            dp[nxt] = min(dp[nxt], dp[mask] + cost[worker][j])
print(dp[-1])`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), limit = 1 << n;
        int[][] cost = new int[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) cost[i][j] = in.nextInt();
        int[] dp = new int[limit];
        Arrays.fill(dp, 1_000_000_000);
        dp[0] = 0;
        for (int mask = 0; mask < limit - 1; mask++) {
            for (int j = 0; j < n; j++) {
                int bit = 1 << j;
                if ((mask & bit) != 0) continue;
                int next = mask | bit;
                dp[next] = Math.min(dp[next], dp[mask] + cost[Integer.bitCount(mask)][j]);
            }
        }
        System.out.println(dp[limit - 1]);
    }
}`,
    },
  }
]);
