import { defineTopics } from "./define.ts";

export const decomposition = defineTopics([
  {
    "id": "problem-decomposition",
    "stage": 0,
    "title": "Problem decomposition and pseudocode",
    "objective": "Turn a word problem into smaller operations with explicit inputs, outputs and stopping conditions.",
    "prerequisites": "Input, process and output.",
    "analogy": "A check-in clerk checks eligibility first, then counts only the people who qualify. Each small step has a clear job.",
    "explanation": "Write the input and output contract first. Split the task into a decision for one record and a repetition step that combines the decisions. Trace the pseudocode on a tiny example before writing a program.",
    "invariant": "After processing i readings, the total equals exactly the number of qualifying readings among the first i. The next increment happens precisely when the next reading qualifies.",
    "pseudocode": "read n and threshold\ncount = 0\nrepeat n times:\n  read reading\n  if reading >= threshold:\n    count += 1\noutput count",
    "time": "O(n) time for n readings",
    "space": "O(1) for the counter and current reading. The Python program also buffers O(n) input tokens",
    "trace": [
      [
        "threshold=5, readings=[3, 5, 7]",
        "Define qualification as a reading of at least 5."
      ],
      [
        "3 < 5 → count=0",
        "The first record fails the decision."
      ],
      [
        "5 ≥ 5 → count=1",
        "Equality qualifies under the stated rule."
      ],
      [
        "7 ≥ 5 → count=2",
        "Combine the last decision with the earlier ones. The final output is 2."
      ]
    ],
    "misconception": "The word at least includes the boundary. Translating it to a strict comparison loses equal readings.",
    "debug": "Check a reading exactly equal to the threshold before trying larger examples.",
    "fill": "Complete the decision in pseudocode: if reading ___ threshold.",
    "edgeCases": [
      "Zero readings have count zero.",
      "Equal readings meet the threshold.",
      "Negative inputs can still qualify against a negative threshold."
    ],
    "revision": "Which part of the problem handles one reading, and which part handles the full list?",
    "further": "Extend the contract to return both the qualifying count and the sum of qualifying values.",
    "quiz": {
      "question": "Which step checks whether one reading qualifies?",
      "answers": [
        "Compare the reading with the threshold",
        "Sort all readings",
        "Print the total"
      ],
      "correct": 0,
      "feedback": "The comparison handles one reading. Repeating it lets the program count the qualifying readings."
    },
    "practice": {
      "title": "Count library arrivals",
      "description": "The library records arrival minutes. Count the arrivals at or after a given minute.",
      "format": "Read n and a threshold, followed by n integer readings. Print the number of readings at least as large as the threshold.",
      "constraints": "0 ≤ n ≤ 500. Readings and threshold range from −10⁶ to 10⁶.",
      "input": "3 5\n3 5 7\n",
      "output": "2\n",
      "hints": [
        "Translate at or after to a comparison that includes equality.",
        "Start the total at zero and add one per qualifying reading."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, threshold, count = 0;
    if (scanf("%d%d", &n, &threshold) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int reading;
        scanf("%d", &reading);
        if (reading >= threshold) count++;
    }
    printf("%d\\n", count);
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, threshold = next(tokens), next(tokens)
count = 0
for _ in range(n):
    if next(tokens) >= threshold:
        count += 1
print(count)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), threshold = in.nextInt(), count = 0;
        for (int i = 0; i < n; i++) {
            if (in.nextInt() >= threshold) count++;
        }
        System.out.println(count);
    }
}`,
    },
  }
]);
