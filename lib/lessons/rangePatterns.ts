import { defineTopics } from "./define.ts";

export const rangePatterns = defineTopics([
  {
    "id": "variable-sliding-window",
    "stage": 4,
    "title": "Variable-size sliding windows",
    "objective": "Find the shortest contiguous segment meeting a threshold when values are nonnegative.",
    "prerequisites": "Fixed-size windows and two array indices.",
    "analogy": "Grow a basket until it holds enough weight, then remove the oldest items while it still meets the goal.",
    "explanation": "Extend right to add values. Whenever the sum reaches the target, record the length and repeatedly remove the leftmost value. A left endpoint is retired only after producing a candidate. Every later right endpoint would give a longer window from that same left endpoint. With nonnegative values, shrinking an already insufficient window cannot make it feasible, so stop shrinking at that point.",
    "invariant": "At the start of a right-endpoint iteration, each retired start has already produced a feasible candidate no longer than any future window using that start. The stored sum equals the remaining window.",
    "pseudocode": "left = 0; total = 0; best = infinity\nfor right from 0 through n−1:\n  total += a[right]\n  while total ≥ target:\n    best = min(best, right−left+1)\n    total -= a[left]\n    left += 1\nreturn best or 0 if absent",
    "time": "O(n) time because each endpoint advances at most n times",
    "space": "O(n) for the stored values and O(1) auxiliary state",
    "trace": [
      [
        "[2, 0, 3, 4] | target=7",
        "Before the final insertion, no prefix reaches the target."
      ],
      [
        "right=3, left=0 | total=9",
        "Record a length-four candidate."
      ],
      [
        "left=1 | total=7",
        "Removing 2 preserves feasibility. Record a length-three candidate."
      ],
      [
        "left=2 | total=7",
        "Removing 0 gives a length-two candidate. Removing 3 next makes the sum insufficient."
      ]
    ],
    "misconception": "Taking just one removal per right endpoint can miss a shorter answer. Allow zeros to be removed too.",
    "debug": "Try [0, 0, 7] with target 7. The correct minimum is one.",
    "fill": "Under which condition should the inner loop keep removing values?",
    "edgeCases": [
      "If a single element reaches the target, the best length is one.",
      "Returns zero when no segment qualifies.",
      "Negative values invalidate the argument for ending the shrink loop."
    ],
    "revision": "Why do two nested loops still take linear total time here?",
    "further": "Find a counterexample with negative values, then explore prefix sums with a monotonic deque.",
    "quiz": {
      "question": "What is the shortest qualifying length for [0, 0, 7] and target 7?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 0,
      "feedback": "Both leading zeros can leave the window, keeping just the 7."
    },
    "practice": {
      "title": "Smallest supply bundle",
      "description": "Find the shortest contiguous run of supplies with total quantity at least the target.",
      "format": "Read n and target, then n nonnegative quantities. Print the minimum positive length or 0 if no segment qualifies.",
      "constraints": "0 ≤ n ≤ 500, 1 ≤ target ≤ 10⁹, and 0 ≤ quantity ≤ 10⁶.",
      "input": "4 7\n2 0 3 4\n",
      "output": "2\n",
      "hints": [
        "Extend right until the total qualifies.",
        "Record each qualifying length before removing the left value."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, target, values[500];
    if (scanf("%d%d", &n, &target) != 2) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    int left = 0, total = 0, best = n + 1;
    for (int right = 0; right < n; right++) {
        total += values[right];
        while (total >= target) {
            int length = right - left + 1;
            if (length < best) best = length;
            total -= values[left++];
        }
    }
    printf("%d\\n", best <= n ? best : 0);
    return 0;
}`,
      python: `import sys
n, target, *values = map(int, sys.stdin.buffer.read().split())
left, total, best = 0, 0, n + 1
for right, value in enumerate(values):
    total += value
    while total >= target:
        best = min(best, right - left + 1)
        total -= values[left]
        left += 1
print(best if best <= n else 0)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), target = in.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = in.nextInt();
        int left = 0, total = 0, best = n + 1;
        for (int right = 0; right < n; right++) {
            total += values[right];
            while (total >= target) {
                best = Math.min(best, right - left + 1);
                total -= values[left++];
            }
        }
        System.out.println(best <= n ? best : 0);
    }
}`,
    },
  },
  {
    "id": "suffix-sums",
    "stage": 4,
    "title": "Suffix sums and right-to-left scans",
    "objective": "Precompute the total from each starting index to the end.",
    "prerequisites": "Arrays and prefix sums.",
    "analogy": "Compute how much remains on a hike by working backward from the finish, adding one trail section at a time.",
    "explanation": "Put a zero after the array for the empty suffix. Starting at the last actual element, add its value to the suffix sum to its right. Each query then reads the already computed entry in constant time.",
    "invariant": "After processing i while scanning backward, positions i through n hold their complete suffix sums. The recurrence adds a[i] to the already correct sum for i+1.",
    "pseudocode": "suffix[n] = 0\nfor i from n−1 down to 0:\n  suffix[i] = a[i] + suffix[i+1]\nfor query index i: print suffix[i]",
    "time": "O(n+q) time for n values and q queries",
    "space": "O(n) for the table. The Python program also buffers O(q) query tokens",
    "trace": [
      [
        "a=[4,−2,7], suffix[3]=0",
        "The suffix after the array contains no elements."
      ],
      [
        "suffix[2]=7",
        "Add the last value to the empty suffix."
      ],
      [
        "suffix[1]=5",
        "Add −2 to the sum starting one position later."
      ],
      [
        "suffix[0]=9",
        "Add 4 to 5. Queries for indices 0 and 3 produce 9 and 0."
      ]
    ],
    "misconception": "Scanning left to right for this recurrence reads entries that are not yet computed.",
    "debug": "Ask for the suffix starting at n. It should return the explicitly allocated zero.",
    "fill": "Complete the recurrence: suffix[i] = a[i] + suffix[___].",
    "edgeCases": [
      "Index n denotes the empty suffix.",
      "Negative values can make earlier suffixes smaller.",
      "For n=0 the only valid query index is zero."
    ],
    "revision": "Which direction makes all recurrence dependencies available?",
    "further": "Answer inclusive range queries by subtracting two suffix sums.",
    "quiz": {
      "question": "What is suffix[1] for [4, −2, 7]?",
      "answers": [
        "5",
        "7",
        "9"
      ],
      "correct": 0,
      "feedback": "Start at index one and add −2 and 7."
    },
    "practice": {
      "title": "Energy left on the route",
      "description": "Answer queries about the total energy from a specified checkpoint through the end of the route.",
      "format": "Read n q, then n signed costs, then q starting indices. Print one sum per query. Index n denotes the empty suffix.",
      "constraints": "0 ≤ n,q ≤ 400, |cost| ≤ 10⁶ and 0 ≤ index ≤ n.",
      "input": "3 3\n4 -2 7\n0 1 3\n",
      "output": "9\n5\n0\n",
      "hints": [
        "Reserve an extra suffix entry initialized to zero.",
        "Process the real entries from right to left."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, q, suffix[401] = {0};
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &suffix[i]);
    for (int i = n - 1; i >= 0; i--) suffix[i] += suffix[i + 1];
    for (int i = 0; i < q; i++) {
        int start;
        scanf("%d", &start);
        printf("%d\\n", suffix[start]);
    }
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
suffix = [next(tokens) for _ in range(n)] + [0]
for i in range(n - 1, -1, -1):
    suffix[i] += suffix[i + 1]
for _ in range(q):
    print(suffix[next(tokens)])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        int[] suffix = new int[n + 1];
        for (int i = 0; i < n; i++) suffix[i] = in.nextInt();
        for (int i = n - 1; i >= 0; i--) suffix[i] += suffix[i + 1];
        for (int i = 0; i < q; i++) System.out.println(suffix[in.nextInt()]);
    }
}`,
    },
  }
]);
