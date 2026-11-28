import { defineTopics } from "./define.ts";

export const increasingSubsequence = defineTopics([
  {
    "id": "longest-increasing-subsequence",
    "stage": 9,
    "title": "Longest increasing subsequence",
    "objective": "Track the smallest possible ending value at each subsequence length.",
    "prerequisites": "Strict inequalities, binary search and dynamic programming.",
    "analogy": "For every ladder height, reserve the lowest finishing step anyone has reached. That step leaves the most room to climb again.",
    "explanation": "Keep a sorted array tails. Entry j stores the smallest ending value among increasing subsequences of length j+1 seen so far. For each value x, replace the first entry at least x. If no such entry exists, append x. The replacement improves one possible ending without reducing the longest achievable length.",
    "invariant": "For each represented length, tails stores the minimum achievable ending value. The entries are strictly increasing because any increasing subsequence of length j+1 has a shorter prefix with a smaller ending.",
    "pseudocode": "tails = empty\nfor x in values:\n  i = first index where tails[i] ≥ x, or length(tails)\n  if i equals length: append x\n  else: tails[i] = x\nprint length(tails)",
    "time": "O(n log(n+1)) time",
    "space": "O(n) for tails. The Python program also buffers input tokens",
    "trace": [
      [
        "Read 4 → tails=[4]",
        "The best ending for length one is 4."
      ],
      [
        "Read 1, then 5 → tails=[1,5]",
        "Replace the length-one ending and extend to length two."
      ],
      [
        "Read 2, then 2 → tails=[1,2]",
        "Improve the length-two ending. Equality never adds a length."
      ],
      [
        "Read 3 → tails=[1,2,3]",
        "Append at length three. A valid subsequence is [1,2,3]."
      ]
    ],
    "misconception": "The final tails values do not necessarily come from one subsequence in original order. They independently summarize the best ending at each length.",
    "debug": "Use [2,2,2]. A strictly increasing subsequence can use only one of them.",
    "fill": "Which binary search bound finds the first value greater than or equal to x?",
    "edgeCases": [
      "An empty sequence has length zero.",
      "Strict increase rejects equal neighbors.",
      "Negative and large values work with the same comparisons."
    ],
    "revision": "What does each entry summarize about all subsequences of its length?",
    "further": "Track predecessor indices to reconstruct one valid optimum.",
    "quiz": {
      "question": "What is the longest strictly increasing subsequence length in [4,1,5,2,2,3]?",
      "answers": [
        "2",
        "3",
        "4"
      ],
      "correct": 1,
      "feedback": "The subsequence [1,2,3] has length three. The second 2 cannot extend a strictly increasing run."
    },
    "practice": {
      "title": "Find the rising milestone sequence",
      "description": "Find the maximum number of readings that can be kept in original order with increasing values.",
      "format": "Read n followed by n signed integers. Print the longest strictly increasing subsequence length.",
      "constraints": "0 ≤ n ≤ 600. Values are between −10⁸ and 10⁸.",
      "input": "6\n4 1 5 2 2 3\n",
      "output": "3\n",
      "hints": [
        "Track the smallest achievable tail at each length.",
        "Use the first tail at least as large as the current reading."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, tails[600], size = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) {
        int value, low = 0, high = size;
        scanf("%d", &value);
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (tails[mid] < value) low = mid + 1;
            else high = mid;
        }
        tails[low] = value;
        if (low == size) size++;
    }
    printf("%d\\n", size);
    return 0;
}`,
      python: `from bisect import bisect_left
import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n = next(tokens)
tails = []
for _ in range(n):
    value = next(tokens)
    slot = bisect_left(tails, value)
    if slot == len(tails):
        tails.append(value)
    else:
        tails[slot] = value
print(len(tails))`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), size = 0;
        int[] tails = new int[n];
        for (int i = 0; i < n; i++) {
            int value = in.nextInt(), low = 0, high = size;
            while (low < high) {
                int mid = low + (high - low) / 2;
                if (tails[mid] < value) low = mid + 1;
                else high = mid;
            }
            tails[low] = value;
            if (low == size) size++;
        }
        System.out.println(size);
    }
}`,
    },
  }
]);
