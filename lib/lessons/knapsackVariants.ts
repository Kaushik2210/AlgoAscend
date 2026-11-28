import { defineTopics } from "./define.ts";

export const knapsackVariants = defineTopics([
  {
    "id": "knapsack-variants",
    "stage": 9,
    "title": "Unbounded and bounded knapsack",
    "objective": "Choose the right update direction when supplies have different copy limits.",
    "prerequisites": "0/1 knapsack, array tabulation, and binary decompositions.",
    "analogy": "Some items can be bought repeatedly and others come in limited bundles. The order in which you update the shopping plan controls whether a bundle can be chosen again.",
    "explanation": "With an unlimited type, scan capacities upward so a state may reuse a previously taken copy of that type. For a limited type, decompose its copies into bundles of sizes 1, 2, 4, and the remaining copies. These bundles represent every allowed quantity. Treat each bundle as one 0/1 item and scan capacities down so that bundle cannot be reused.",
    "invariant": "After each processed type, best[c] is the highest value achievable with capacity at most c using allowed multiplicities of all processed types.",
    "pseudocode": "for each type (weight,value,limit):\n  if unlimited: relax upward with one copy\n  else:\n    clamp copies to capacity/weight\n    split copies into binary bundles\n    relax downward once per bundle\nreturn best[capacity]",
    "time": "O(W × (u + Σ log(limitᵢ+1))) for capacity W and u unlimited types, after clamping each finite limit",
    "space": "O(W) for one DP row",
    "trace": [
      [
        "Capacity 7: unlimited (2,3); one copy (3,8)",
        "The first type has weight two and value three."
      ],
      [
        "Scan upward for the unlimited type",
        "At capacity six, three copies give value nine."
      ],
      [
        "Scan downward for the one allowed copy",
        "At capacity seven, use the earlier result for capacity four and add eight."
      ],
      [
        "Answer 14",
        "Two unlimited copies and one limited copy fit exactly. The limited item was used once."
      ]
    ],
    "misconception": "A downward scan for an unlimited type treats it as 0/1. An upward scan for a finite bundle can exceed its allowed count.",
    "debug": "Use a single limited item of weight two, value ten, limit one, and capacity six.",
    "fill": "Which scan direction lets one bundle be reused?",
    "edgeCases": [
      "A type with zero allowed copies changes nothing.",
      "A type heavier than capacity is skipped.",
      "All values are nonnegative and the empty choice is legal."
    ],
    "revision": "How do the binary bundles represent every quantity from zero through the limit?",
    "further": "Optimize bounded knapsack with a monotone deque within each residue class.",
    "quiz": {
      "question": "Which scan direction supports unlimited copies in one DP row?",
      "answers": [
        "Increasing capacity",
        "Decreasing capacity",
        "Either, as long as weight is positive"
      ],
      "correct": 0,
      "feedback": "An increasing scan can extend a state that already contains the current type."
    },
    "practice": {
      "title": "Pack supplies with mixed availability",
      "description": "Maximize total value subject to weights, capacity, and per-type limits.",
      "format": "Read n W, then n lines weight value limit. A limit of −1 is unlimited. Print the maximum value that fits.",
      "constraints": "0 ≤ n ≤ 150, 0 ≤ W ≤ 400, 1 ≤ weight ≤ 400, 0 ≤ value ≤ 10⁵, and −1 ≤ limit ≤ 10⁶.",
      "input": "2 7\n2 3 -1\n3 8 1\n",
      "output": "14\n",
      "hints": [
        "A finite bundle consumes count times the single-item weight.",
        "Clamp copies by the capacity before splitting."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, capacity, best[401] = {0};
    if (scanf("%d%d", &n, &capacity) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int w, value, limit;
        scanf("%d%d%d", &w, &value, &limit);
        if (limit == -1) {
            for (int c = w; c <= capacity; c++) {
                int candidate = best[c - w] + value;
                if (candidate > best[c]) best[c] = candidate;
            }
        } else {
            if (limit > capacity / w) limit = capacity / w;
            for (int block = 1; limit > 0; block *= 2) {
                int count = block < limit ? block : limit;
                int weight = count * w, gain = count * value;
                for (int c = capacity; c >= weight; c--) {
                    int candidate = best[c - weight] + gain;
                    if (candidate > best[c]) best[c] = candidate;
                }
                limit -= count;
            }
        }
    }
    printf("%d\\n", best[capacity]);
    return 0;
}`,
      python: `n, capacity = map(int, input().split())
best = [0] * (capacity + 1)
for _ in range(n):
    w, value, limit = map(int, input().split())
    if limit == -1:
        for c in range(w, capacity + 1):
            best[c] = max(best[c], best[c - w] + value)
    else:
        limit = min(limit, capacity // w)
        block = 1
        while limit:
            count = min(block, limit)
            weight, gain = count * w, count * value
            for c in range(capacity, weight - 1, -1):
                best[c] = max(best[c], best[c - weight] + gain)
            limit -= count
            block *= 2
print(best[-1])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), capacity = in.nextInt();
        int[] best = new int[capacity + 1];
        for (int i = 0; i < n; i++) {
            int w = in.nextInt(), value = in.nextInt(), limit = in.nextInt();
            if (limit == -1) {
                for (int c = w; c <= capacity; c++) best[c] = Math.max(best[c], best[c - w] + value);
            } else {
                limit = Math.min(limit, capacity / w);
                for (int block = 1; limit > 0; block *= 2) {
                    int count = Math.min(block, limit), weight = count * w, gain = count * value;
                    for (int c = capacity; c >= weight; c--) best[c] = Math.max(best[c], best[c - weight] + gain);
                    limit -= count;
                }
            }
        }
        System.out.println(best[capacity]);
    }
}`,
    },
  }
]);
