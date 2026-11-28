import { defineTopics } from "./define.ts";

export const squareRootBlocks = defineTopics([
  {
    "id": "sqrt-decomposition",
    "stage": 11,
    "title": "Square-root decomposition with block sums",
    "objective": "Use block summaries to answer range queries while supporting point assignments.",
    "prerequisites": "Arrays, integer division, and range sums.",
    "analogy": "Pack readings into folders with a total on each cover. Open the folders at the edges of a request and read the covers for whole folders in the middle.",
    "explanation": "Split the array into consecutive blocks of about √n positions. Store each block sum. For an inclusive query, consume a whole block when aligned and entirely inside the range. Otherwise add one value. A point assignment adjusts one block by the difference between the new value and the old value.",
    "invariant": "Each block sum equals the current total of its elements. The query adds only disjoint portions, either single elements or entire blocks, until it covers the requested range.",
    "pseudocode": "build one sum per block\nassign(i,x): total[block(i)] += x−a[i]; a[i]=x\nquery(l,r):\n  while l ≤ r:\n    add an aligned full block and skip its width, or add one element",
    "time": "O(n) setup, O(1) per point assignment, and O(√n) per range sum",
    "space": "O(n) for values and O(√n) for block totals",
    "trace": [
      [
        "Values [2,4,1,7,3,5] with width three",
        "The block totals are 7 and 15."
      ],
      [
        "Query [0,4]",
        "Take whole block [0,2] for 7, then values 7 and 3 individually."
      ],
      [
        "Assign index 1 to 0",
        "Change the first block by 0−4. Its total becomes 3."
      ],
      [
        "Query [0,4] again",
        "The answer drops from 17 to 13. The second block is unchanged."
      ]
    ],
    "misconception": "Adding the new value to a block total without subtracting the old value turns an assignment into an increment.",
    "debug": "Use a partial final block and a query ending at the last real position.",
    "fill": "What difference updates the block total on assignment?",
    "edgeCases": [
      "A one-element array uses block width one.",
      "The last block may have fewer elements.",
      "Negative values contribute to sums normally."
    ],
    "revision": "Why does choosing a much smaller block width increase the number of full blocks per query?",
    "further": "Use sorted values within each block to count values below a threshold.",
    "quiz": {
      "question": "A block contains a value 4 which is reassigned to −1. How much does the block total change?",
      "answers": [
        "−1",
        "−5",
        "5"
      ],
      "correct": 1,
      "feedback": "Subtract the old 4 and add the new −1, giving a change of −5."
    },
    "practice": {
      "title": "Maintain block totals for station readings",
      "description": "Apply point assignments and answer inclusive range sums using precomputed blocks.",
      "format": "Read n q, then n initial values. Each operation is 1 index value or 2 left right. Print each queried sum.",
      "constraints": "1 ≤ n ≤ 400, 1 ≤ q ≤ 300, indices are zero-based, left ≤ right, and |value| ≤ 10⁵.",
      "input": "6 3\n2 4 1 7 3 5\n2 0 4\n1 1 0\n2 0 4\n",
      "output": "17\n13\n",
      "hints": [
        "Use a block only when the current position is aligned and its entire width fits.",
        "Store original values so an assignment can remove the old contribution."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, q, values[400], total[400] = {0}, width = 1;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    while (width * width < n) width++;
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
        total[i / width] += values[i];
    }
    for (int operation = 0; operation < q; operation++) {
        int type, a, b;
        scanf("%d%d%d", &type, &a, &b);
        if (type == 1) {
            total[a / width] += b - values[a];
            values[a] = b;
        } else {
            int answer = 0;
            while (a <= b) {
                if (a % width == 0 && a + width - 1 <= b) {
                    answer += total[a / width];
                    a += width;
                } else answer += values[a++];
            }
            printf("%d\\n", answer);
        }
    }
    return 0;
}`,
      python: `from math import isqrt
n, q = map(int, input().split())
values = list(map(int, input().split()))
width = isqrt(n - 1) + 1
total = [0] * ((n + width - 1) // width)
for index, value in enumerate(values):
    total[index // width] += value
for _ in range(q):
    kind, a, b = map(int, input().split())
    if kind == 1:
        total[a // width] += b - values[a]
        values[a] = b
    else:
        answer = 0
        while a <= b:
            if a % width == 0 and a + width - 1 <= b:
                answer += total[a // width]
                a += width
            else:
                answer += values[a]
                a += 1
        print(answer)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), width = 1;
        while (width * width < n) width++;
        int[] values = new int[n], total = new int[(n + width - 1) / width];
        for (int i = 0; i < n; i++) {
            values[i] = in.nextInt();
            total[i / width] += values[i];
        }
        for (int operation = 0; operation < q; operation++) {
            int kind = in.nextInt(), a = in.nextInt(), b = in.nextInt();
            if (kind == 1) {
                total[a / width] += b - values[a];
                values[a] = b;
            } else {
                int answer = 0;
                while (a <= b) {
                    if (a % width == 0 && a + width - 1 <= b) {
                        answer += total[a / width];
                        a += width;
                    } else answer += values[a++];
                }
                System.out.println(answer);
            }
        }
    }
}`,
    },
  }
]);
