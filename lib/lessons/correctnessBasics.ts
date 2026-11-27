import { defineTopics } from "./define.ts";

export const correctnessBasics = defineTopics([
  {
    "id": "loop-invariants",
    "stage": 2,
    "title": "Loop invariants and correctness",
    "objective": "Prove an iterative algorithm by checking initialization, maintenance, and termination.",
    "prerequisites": "Arrays, loops and comparisons.",
    "analogy": "An inspector checks each room and keeps a statement about every room visited so far. The statement becomes a building-wide result once inspection ends.",
    "explanation": "A loop invariant is a property guaranteed at the same point of each iteration. For the first-descending-pair problem, before comparing positions i−1 and i the prefix ending at i−1 is nondecreasing. Prove it for the one-item prefix. A passing comparison extends it by one item. A failing comparison identifies the first descending pair. Completing the loop proves the entire sequence is nondecreasing.",
    "invariant": "Before considering index i and before any failure, all adjacent pairs ending before i are nondecreasing. The current pair is the earliest possible failure.",
    "pseudocode": "read sequentially\nfor i from 1 to n−1:\n  if previous > current:\n    return i\n  previous = current\nreturn −1",
    "time": "O(n) worst-case time",
    "space": "O(1) streaming in C and Java. The Python program buffers O(n) tokens",
    "trace": [
      [
        "[2, 2, 5, 4] | i=1",
        "One item forms a nondecreasing prefix."
      ],
      [
        "2 ≤ 2 | i=2",
        "Equal neighbors are permitted. The first two items now satisfy the invariant."
      ],
      [
        "2 ≤ 5 | i=3",
        "The first three items are nondecreasing."
      ],
      [
        "5 > 4 | return 3",
        "Index 3 ends the first descending pair because all previous pairs passed."
      ]
    ],
    "misconception": "A loop invariant needs a precise point of evaluation. It can be false temporarily inside an iteration.",
    "debug": "Try an all-equal array, then one whose only descending pair ends at the final position.",
    "fill": "What property is already known about indices 0 through i−1 when testing index i?",
    "edgeCases": [
      "Zero or one element cannot contain a descending pair.",
      "Equal adjacent values are nondecreasing.",
      "The output index belongs to the second value of the first failing pair."
    ],
    "revision": "How do maintenance and termination give the final result?",
    "further": "Write a loop invariant for maintaining the minimum seen so far.",
    "quiz": {
      "question": "What should the algorithm output for [1, 1, 0, −1]?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 1,
      "feedback": "The pair at indices 1 and 2 is the earliest strict decrease."
    },
    "practice": {
      "title": "Find the first descending reading",
      "description": "Locate the first reading smaller than its immediate predecessor.",
      "format": "Read n followed by n integers. Print the zero-based index of the first strict decrease, or −1 if the sequence is nondecreasing.",
      "constraints": "0 ≤ n ≤ 500. Each value is between −10⁶ and 10⁶.",
      "input": "4\n2 2 5 4\n",
      "output": "3\n",
      "hints": [
        "Equal neighbors pass the check.",
        "Compare each value to the immediately preceding one."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, previous;
    if (scanf("%d", &n) != 1) return 0;
    if (n > 0) scanf("%d", &previous);
    for (int i = 1; i < n; i++) {
        int current;
        scanf("%d", &current);
        if (previous > current) {
            printf("%d\\n", i);
            return 0;
        }
        previous = current;
    }
    puts("-1");
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n = next(tokens)
previous = next(tokens, None)
answer = -1
for i in range(1, n):
    current = next(tokens)
    if previous > current:
        answer = i
        break
    previous = current
print(answer)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        int previous = n > 0 ? in.nextInt() : 0;
        for (int i = 1; i < n; i++) {
            int current = in.nextInt();
            if (previous > current) {
                System.out.println(i);
                return;
            }
            previous = current;
        }
        System.out.println(-1);
    }
}`,
    },
  }
]);
