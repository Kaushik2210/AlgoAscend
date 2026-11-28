import { defineTopics } from "./define.ts";

export const pigeonholeRanges = defineTopics([
  {
    "id": "pigeonhole-principle",
    "stage": 10,
    "title": "The pigeonhole principle and repeated remainders",
    "objective": "Turn a counting guarantee into a linear-time search for a divisible range.",
    "prerequisites": "Prefix sums, modular remainders, and arrays.",
    "analogy": "If five cards go into four numbered drawers, two cards must share a drawer.",
    "explanation": "Consider n+1 prefix sums, including the empty prefix. Modulo n there are only n possible remainders, so two prefixes must share one. Subtracting their sums gives a nonempty range divisible by n. Store the first prefix index for each remainder and return as soon as a repeated remainder is found.",
    "invariant": "Before processing a prefix, each stored index is the earliest seen index with that remainder. Equal remainder at two distinct prefix lengths certifies a range whose sum is a multiple of n.",
    "pseudocode": "seen[0]=0; other entries unseen\nremainder=0\nfor end from 1 to n:\n  update remainder with a[end−1] and normalize modulo n\n  if seen[remainder] exists: print seen[remainder], end−1\n  record this prefix length",
    "time": "O(n) time",
    "space": "O(n) for first occurrences",
    "trace": [
      [
        "n=4, values [3,1,5,4]",
        "The empty prefix starts with remainder zero at prefix length zero."
      ],
      [
        "Read 3",
        "The prefix remainder is three. Store prefix length one."
      ],
      [
        "Read 1",
        "The remainder returns to zero at prefix length two."
      ],
      [
        "Return [0,1]",
        "The earlier zero prefix is empty. Values 3+1 are divisible by four."
      ]
    ],
    "misconception": "Using only the n nonempty prefixes gives no guarantee of a collision among n remainder classes.",
    "debug": "Use three ones. Only the full length-three range is divisible by three.",
    "fill": "What prefix index should be stored for the remainder of the empty prefix?",
    "edgeCases": [
      "n=1 guarantees the first element is valid.",
      "Normalize negative remainders before using them as array indices.",
      "The first repeated remainder gives a deterministic earliest-ending answer."
    ],
    "revision": "How many objects and boxes are used in the guarantee?",
    "further": "Generalize the argument to n values and a requested divisor m≤n.",
    "quiz": {
      "question": "How many prefix sums are considered for n values, including the empty prefix?",
      "answers": [
        "n−1",
        "n",
        "n+1"
      ],
      "correct": 2,
      "feedback": "There is one prefix ending after each value, plus the empty prefix."
    },
    "practice": {
      "title": "Find a range with a divisible total",
      "description": "Find the first ending index of a nonempty range whose sum is divisible by the array length.",
      "format": "Read n and n signed values. Print the zero-based inclusive endpoints. Minimize the ending index, then the starting index.",
      "constraints": "1 ≤ n ≤ 500 and |value| ≤ 10⁶.",
      "input": "4\n3 1 5 4\n",
      "output": "0 1\n",
      "hints": [
        "Store remainder zero for the empty prefix.",
        "Compare prefix sums modulo n during one scan."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, first[500], remainder = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) first[i] = -1;
    first[0] = 0;
    for (int i = 0; i < n; i++) {
        int value; scanf("%d", &value);
        remainder = (remainder + value) % n;
        if (remainder < 0) remainder += n;
        if (first[remainder] >= 0) { printf("%d %d\\n", first[remainder], i); return 0; }
        first[remainder] = i + 1;
    }
    return 0;
}`,
      python: `n = int(input())
values = list(map(int, input().split()))
first = [-1] * n
first[0] = 0
remainder = 0
for i, value in enumerate(values):
    remainder = (remainder + value) % n
    if first[remainder] >= 0:
        print(first[remainder], i)
        break
    first[remainder] = i + 1`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), remainder = 0;
        int[] first = new int[n];
        Arrays.fill(first, -1);
        first[0] = 0;
        for (int i = 0; i < n; i++) {
            remainder = Math.floorMod(remainder + in.nextInt(), n);
            if (first[remainder] >= 0) { System.out.println(first[remainder] + " " + i); return; }
            first[remainder] = i + 1;
        }
    }
}`,
    },
  }
]);
