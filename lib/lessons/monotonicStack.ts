import { defineTopics } from "./define.ts";

export const monotonicStack = defineTopics([
  {
    "id": "monotonic-stacks",
    "stage": 4,
    "title": "Monotonic stacks and next greater values",
    "objective": "Find the next strictly greater reading for each position with one forward scan.",
    "prerequisites": "Stacks, array indices and loops.",
    "analogy": "Put unresolved requests on a stack. A high enough new reading resolves everyone at the top whose threshold it exceeds.",
    "explanation": "Store indices of readings whose next greater value has not been seen. When a new reading exceeds the value at the top index, assign the current index as that earlier reading’s answer and pop it. Keep popping while the comparison succeeds, then push the current index. Equal values stay unresolved under a strict greater-than rule.",
    "invariant": "Unresolved stack values are nonincreasing from bottom to top. A popped index has seen no earlier strictly greater value because it remained unresolved until the current comparison.",
    "pseudocode": "answers = all −1\nfor i from 0 to n−1:\n  while stack is nonempty and a[stack.top] < a[i]:\n    answers[stack.pop()] = i\n  push i\nprint answers",
    "time": "O(n) time because each index is pushed once and popped at most once",
    "space": "O(n) for the stack, input and answers",
    "trace": [
      [
        "Input [2,1,2,4] | push index 0",
        "The first 2 has no greater reading yet."
      ],
      [
        "i=1, value 1",
        "Push index 1 because it does not resolve index 0."
      ],
      [
        "i=2, value 2",
        "Pop index 1 and set its answer to 2. Equal values leave index 0 unresolved."
      ],
      [
        "i=3, value 4",
        "Pop indices 2 and 0 and set both answers to 3. The final array is [3,2,3,−1]."
      ]
    ],
    "misconception": "Popping on equality changes the task from strictly greater to greater-or-equal.",
    "debug": "Use [2,2,2]. All three answers must be −1.",
    "fill": "Why does the stack store indices even when the comparison uses values?",
    "edgeCases": [
      "An empty input prints an empty line.",
      "A decreasing sequence leaves all indices unresolved.",
      "An answer refers to the first strictly larger value, even if a much larger value appears later."
    ],
    "revision": "What limits total pop operations across the whole scan?",
    "further": "Change the comparison to find the next smaller value.",
    "quiz": {
      "question": "What is the next strictly greater index for position 0 of [2,2,3]?",
      "answers": [
        "1",
        "2",
        "−1"
      ],
      "correct": 1,
      "feedback": "The equal value at index 1 leaves the first position unresolved. Index 2 is greater."
    },
    "practice": {
      "title": "Find the next higher beacon",
      "description": "For each beacon, find the first later beacon with a strictly larger reading.",
      "format": "Read n followed by n integer readings. Print n zero-based answer indices separated by spaces, using −1 for a missing answer.",
      "constraints": "0 ≤ n ≤ 500. Readings are between −10⁶ and 10⁶.",
      "input": "4\n2 1 2 4\n",
      "output": "3 2 3 -1\n",
      "hints": [
        "Keep unresolved indices in a stack.",
        "Resolve every smaller stack value before pushing the current index."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, values[500], stack[500], answer[500], size = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
        answer[i] = -1;
        while (size && values[stack[size - 1]] < values[i]) answer[stack[--size]] = i;
        stack[size++] = i;
    }
    for (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", answer[i]);
    puts("");
    return 0;
}`,
      python: `import sys
n, *values = map(int, sys.stdin.buffer.read().split())
answer, stack = [-1] * n, []
for i, value in enumerate(values):
    while stack and values[stack[-1]] < value:
        answer[stack.pop()] = i
    stack.append(i)
print(*answer)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), size = 0;
        int[] values = new int[n], stack = new int[n], answer = new int[n];
        Arrays.fill(answer, -1);
        for (int i = 0; i < n; i++) {
            values[i] = in.nextInt();
            while (size > 0 && values[stack[size - 1]] < values[i]) answer[stack[--size]] = i;
            stack[size++] = i;
        }
        var out = new StringBuilder();
        for (int value : answer) {
            if (out.length() > 0) out.append(' ');
            out.append(value);
        }
        System.out.println(out);
    }
}`,
    },
  }
]);
