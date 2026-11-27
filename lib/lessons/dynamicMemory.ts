import { defineTopics } from "./define.ts";

export const dynamicMemory = defineTopics([
  {
    "id": "dynamic-storage",
    "stage": 1,
    "title": "Dynamic storage and array lifetimes",
    "objective": "Allocate storage based on the input and understand who manages its lifetime.",
    "prerequisites": "Arrays, integer remainders and loops.",
    "analogy": "Reserve only as many lockers as the group needs. When inspection ends, return the reserved lockers.",
    "explanation": "An input-dependent length can be read before storage is allocated. In C, malloc reserves bytes and returns a pointer or null. Allocate n times the size of one element and free the successful allocation after the final access. Python lists and Java arrays are managed objects whose storage can be reclaimed when unreachable. To rotate an array left by k, normalize k first and then read indices modulo n.",
    "invariant": "For each output index i, the original element at (i+k) mod n is the unique value that moves there. The allocation stays live while any read requires it.",
    "pseudocode": "read n and k\nif n is zero: print empty line and finish\nallocate storage for n elements\nread all elements\nfor i from 0 through n−1:\n  output values[(i + k mod n) mod n]\nrelease manually managed storage",
    "time": "O(n) time",
    "space": "O(n) for the stored array",
    "trace": [
      [
        "n=4, k=6",
        "Make storage for four values. Normalize six moves to an offset of two."
      ],
      [
        "Original [8, 2, 5, 1]",
        "The four writes use indices zero through three."
      ],
      [
        "Output indices 2, 3, 0, 1",
        "Modulo brings the final two reads back to the beginning."
      ],
      [
        "Output [5,1,8,2]",
        "All reads are finished. A C implementation can now release its allocation."
      ]
    ],
    "misconception": "The argument to C malloc counts bytes. Supplying only n may reserve too little space for n integers.",
    "debug": "Test an offset greater than the length and an empty input to avoid modulo by zero.",
    "fill": "What C expression gives the byte size of n elements when values is a pointer to the allocated element type?",
    "edgeCases": [
      "An empty array produces an empty line without modulo or allocation.",
      "An offset that is a multiple of n keeps the original order.",
      "Release allocated memory once after its last use."
    ],
    "revision": "Why should the result of malloc be checked before writing through the pointer?",
    "further": "Use a fresh buffer to make the result reusable instead of printing it directly.",
    "quiz": {
      "question": "How many bytes does C need for n elements of the type pointed to by values?",
      "answers": [
        "n",
        "sizeof values",
        "n × sizeof *values"
      ],
      "correct": 2,
      "feedback": "sizeof *values measures one element. Multiplying by n reserves enough bytes for all elements."
    },
    "practice": {
      "title": "Rotate the inspection sequence",
      "description": "Rotate the recorded values left by the requested number of positions.",
      "format": "Read n k, followed by n signed values. Print the rotated list with spaces, or an empty line if n is zero.",
      "constraints": "0 ≤ n ≤ 500, 0 ≤ k ≤ 10⁹, and values are between −10⁶ and 10⁶.",
      "input": "4 6\n8 2 5 1\n",
      "output": "5 1 8 2\n",
      "hints": [
        "Handle an empty list before taking a remainder.",
        "Use storage sized for the number of values read."
      ]
    },
    code:{
      c: `#include <stdio.h>
#include <stdlib.h>
int main(void) {
    int n, shift;
    if (scanf("%d%d", &n, &shift) != 2) return 0;
    if (n == 0) { puts(""); return 0; }
    int *values = malloc((size_t)n * sizeof *values);
    if (values == NULL) return 1;
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    shift %= n;
    for (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", values[(i + shift) % n]);
    puts("");
    free(values);
    return 0;
}`,
      python: `import sys
n, shift, *values = map(int, sys.stdin.buffer.read().split())
if n:
    shift %= n
    print(*(values[(i + shift) % n] for i in range(n)))
else:
    print()`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), shift = in.nextInt();
        if (n == 0) { System.out.println(); return; }
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = in.nextInt();
        shift %= n;
        var out = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) out.append(' ');
            out.append(values[(i + shift) % n]);
        }
        System.out.println(out);
    }
}`,
    },
  }
]);
