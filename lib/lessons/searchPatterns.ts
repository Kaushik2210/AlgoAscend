import { defineTopics } from "./define.ts";

export const searchPatterns = defineTopics([
  {
    "id": "linear-search",
    "stage": 4,
    "title": "Linear search on unsorted data",
    "objective": "Find the first matching item by inspecting values in their original order.",
    "prerequisites": "Loops and first-match conditions.",
    "analogy": "Check a row of unlabelled drawers one by one until you reach the marker you need.",
    "explanation": "Start at index zero. Compare each item with the target and return the index on the first match. If the loop finishes, the target was absent. This method works even when values are unsorted and preserves the meanings of repeated values and original indices.",
    "invariant": "Before examining index i, no earlier item equals the target. Returning at i therefore yields the first match.",
    "pseudocode": "for i from 0 through n−1:\n  if value[i] == target: return i\nreturn −1",
    "time": "O(n) worst-case comparisons and O(1) best-case comparisons when the first item matches",
    "space": "O(1) streaming in C and Java. The Python program buffers O(n) input tokens",
    "trace": [
      [
        "[5, −2, 9, −2] | target=−2",
        "Begin at original index zero."
      ],
      [
        "i=0, 5 ≠ −2",
        "All inspected positions have missed."
      ],
      [
        "i=1, −2 = −2",
        "Return 1. The later duplicate does not change the first answer."
      ]
    ],
    "misconception": "Binary search needs a sorted interval. An unsorted sequence gives no reason to discard half after a comparison.",
    "debug": "Try two occurrences and check that the output refers to the earlier index.",
    "fill": "What must be true about positions before i at the start of iteration i?",
    "edgeCases": [
      "An empty sequence returns −1.",
      "A match at index zero returns zero.",
      "Repeated matches use the smallest index."
    ],
    "revision": "Can a comparison rule discard half of an arbitrary unsorted list?",
    "further": "Compare repeated-query costs with building a mapping from values to first positions.",
    "quiz": {
      "question": "Where is the first occurrence of 4 in [7, 4, 2, 4]?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 0,
      "feedback": "Index 1 is the first matching position in zero-based order."
    },
    "practice": {
      "title": "Find an unsorted tag",
      "description": "Find the first occurrence of a target in arrival order.",
      "format": "Read n and target, then n signed integer tags. Print the first zero-based index of target, or −1.",
      "constraints": "0 ≤ n ≤ 500. Values and target are between −10⁶ and 10⁶.",
      "input": "4 -2\n5 -2 9 -2\n",
      "output": "1\n",
      "hints": [
        "Check the original order without sorting.",
        "Stop when a match is found."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, target;
    if (scanf("%d%d", &n, &target) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int value;
        scanf("%d", &value);
        if (value == target) {
            printf("%d\\n", i);
            return 0;
        }
    }
    puts("-1");
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, target = next(tokens), next(tokens)
answer = -1
for i in range(n):
    if next(tokens) == target:
        answer = i
        break
print(answer)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), target = in.nextInt();
        int answer = -1;
        for (int i = 0; i < n; i++) {
            if (in.nextInt() == target) {
                answer = i;
                break;
            }
        }
        System.out.println(answer);
    }
}`,
    },
  },
  {
    "id": "binary-search-on-answer",
    "stage": 4,
    "title": "Binary search on the answer",
    "objective": "Find the first feasible answer by proving a monotone predicate.",
    "prerequisites": "Binary search and integer division.",
    "analogy": "Try increasingly larger water tanks. Once a tank can hold the shipment schedule, all bigger tanks can use that same schedule.",
    "explanation": "For a candidate capacity, fill each day in order until the next package would overflow, then open another day. Greedily filling each day as far as possible minimizes the days required under that capacity. A capacity that works remains feasible when increased. Binary search between the largest package and the total weight to find the first feasible capacity.",
    "invariant": "The first feasible capacity stays in [low, high]. If mid is feasible it belongs to [low, mid]. If mid fails then every smaller capacity fails and the first feasible capacity lies in [mid+1, high].",
    "pseudocode": "low = max(weights); high = sum(weights)\nwhile low < high:\n  mid = low + floor((high−low)/2)\n  if greedy_days(mid) ≤ limit: high = mid\n  else: low = mid + 1\nreturn low",
    "time": "O(n log(S+1)) time where S is the total package weight",
    "space": "O(n) for the stored weights",
    "trace": [
      [
        "weights=[3,2,2,4], limit=2 | [4,11]",
        "Capacity below four fails on the largest package. Capacity eleven fits everything in one day."
      ],
      [
        "mid=7 → 2 days | [4,7]",
        "Send [3,2,2] on day one and [4] on day two."
      ],
      [
        "mid=5 → 3 days | [6,7]",
        "Groups are [3,2], [2], [4]. The capacity is too small."
      ],
      [
        "mid=6 → 2 days | [6,6]",
        "Groups [3,2] and [2,4] fit. The minimum is six."
      ]
    ],
    "misconception": "Finding one feasible value does not show it is the smallest.",
    "debug": "Try a one-day limit and check that the answer equals the sum.",
    "fill": "When capacity mid is feasible, which endpoint changes?",
    "edgeCases": [
      "One day requires the total weight.",
      "At least n days permit the largest individual weight as capacity.",
      "The feasibility check keeps packages in their original order."
    ],
    "revision": "What makes the predicate monotone?",
    "further": "Find the maximum feasible value in a problem where feasibility changes from true to false.",
    "quiz": {
      "question": "If capacity 9 works, what can you conclude about capacity 10?",
      "answers": [
        "It works",
        "It fails",
        "It depends on sorting"
      ],
      "correct": 0,
      "feedback": "The same feasible groups fit into the larger capacity."
    },
    "practice": {
      "title": "Set a daily shipping limit",
      "description": "Ship an ordered list of packages in at most the given days. Minimize the daily weight capacity.",
      "format": "Read n and days, then n positive package weights. Print the minimum integer capacity.",
      "constraints": "1 ≤ days ≤ n ≤ 400. Each weight is from 1 through 10⁶.",
      "input": "4 2\n3 2 2 4\n",
      "output": "6\n",
      "hints": [
        "Start the search between maximum weight and total weight.",
        "Greedily count the days for a trial capacity."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, days, weights[400], low = 0, high = 0;
    if (scanf("%d%d", &n, &days) != 2) return 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &weights[i]);
        high += weights[i];
        if (weights[i] > low) low = weights[i];
    }
    while (low < high) {
        int mid = low + (high - low) / 2, used = 1, load = 0;
        for (int i = 0; i < n; i++) {
            if (load + weights[i] > mid) { used++; load = 0; }
            load += weights[i];
        }
        if (used <= days) high = mid;
        else low = mid + 1;
    }
    printf("%d\\n", low);
    return 0;
}`,
      python: `import sys
n, days, *weights = map(int, sys.stdin.buffer.read().split())
low, high = max(weights), sum(weights)
while low < high:
    mid = low + (high - low) // 2
    used, load = 1, 0
    for weight in weights:
        if load + weight > mid:
            used += 1
            load = 0
        load += weight
    if used <= days:
        high = mid
    else:
        low = mid + 1
print(low)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), days = in.nextInt(), low = 0, high = 0;
        int[] weights = new int[n];
        for (int i = 0; i < n; i++) {
            weights[i] = in.nextInt();
            high += weights[i];
            low = Math.max(low, weights[i]);
        }
        while (low < high) {
            int mid = low + (high - low) / 2, used = 1, load = 0;
            for (int weight : weights) {
                if (load + weight > mid) { used++; load = 0; }
                load += weight;
            }
            if (used <= days) high = mid;
            else low = mid + 1;
        }
        System.out.println(low);
    }
}`,
    },
  }
]);
