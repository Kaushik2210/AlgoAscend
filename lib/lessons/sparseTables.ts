import { defineTopics } from "./define.ts";

export const sparseTables = defineTopics([
  {
    "id": "sparse-tables",
    "stage": 11,
    "title": "Sparse tables for static range minima",
    "objective": "Answer inclusive minimum queries in constant time after preprocessing a fixed array.",
    "prerequisites": "Powers of two, arrays and range minimum queries.",
    "analogy": "Precompute summaries for every starting point at lengths 1, 2, 4 and so on. Two summaries can cover a request even when they overlap.",
    "explanation": "Table level j stores the minimum for each complete interval of length 2ʲ. Build a level from two neighboring half-blocks. For a query of length L, choose j=floor(log₂ L). Combine the two length-2ʲ blocks anchored at the left and right ends. They cover the interval and may overlap. Duplicate values do not change a minimum.",
    "invariant": "Every built entry is the minimum of its stated block. The two chosen query blocks lie within the query and cover it, so the smaller block minimum is the correct answer.",
    "pseudocode": "table[0] = values\nfor each level j above zero:\n  for each valid block start i:\n    table[j][i] = min(table[j−1][i],table[j−1][i+2^(j−1)])\nfor [l,r]:\n  j = floor_log2(r−l+1)\n  print min(table[j][l],table[j][r−2^j+1])",
    "time": "O(n log(n+1)) preprocessing and O(1) per query with precomputed logarithms",
    "space": "O(n log(n+1)) for the table. The Python program additionally buffers input query tokens",
    "trace": [
      [
        "Values [8,6,3,7,2]",
        "Level 0 stores the input."
      ],
      [
        "Level 1 → [6,3,3,2]",
        "Each entry combines two adjacent length-one blocks."
      ],
      [
        "Level 2 → [3,2]",
        "Length-four blocks cover indices 0 through 3 and 1 through 4."
      ],
      [
        "Query [0,4] → min(3,2) = 2",
        "The two length-four blocks overlap but still cover the range."
      ]
    ],
    "misconception": "The two-block overlap works for minimum. Applying the same rule to sums can double-count values.",
    "debug": "Try a range of length five and confirm both selected length-four blocks stay inside it.",
    "fill": "What starting index gives a block of width w ending at inclusive index r?",
    "edgeCases": [
      "For length one, the two blocks are the same cell.",
      "When the query length is a power of two, both blocks can coincide.",
      "An update can invalidate many entries, so this exercise uses static input."
    ],
    "revision": "Which property of min makes duplicate coverage harmless?",
    "further": "Implement static range maximum and compare memory with a segment tree.",
    "quiz": {
      "question": "What block width should cover a query of length 6?",
      "answers": [
        "2",
        "4",
        "8"
      ],
      "correct": 1,
      "feedback": "Four is the largest power of two at most six. Two length-four blocks can cover all six positions."
    },
    "practice": {
      "title": "Query archived temperatures",
      "description": "Report the lowest reading in each specified range of an unchanging archive.",
      "format": "Read n q, then n integer temperatures, then q inclusive zero-based ranges l r. Print one minimum per range.",
      "constraints": "1 ≤ n ≤ 400, 0 ≤ q ≤ 400, and values are between −10⁶ and 10⁶. 0 ≤ l ≤ r < n.",
      "input": "5 3\n8 6 3 7 2\n0 4\n1 3\n1 1\n",
      "output": "2\n3\n6\n",
      "hints": [
        "Precompute floor(log₂ length) for each positive length.",
        "Anchor one block at each query end."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int levels[9][400], logs[401];
static int minimum(int a, int b) { return a < b ? a : b; }
int main(void) {
    int n, q;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &levels[0][i]);
    for (int length = 2; length <= n; length++) logs[length] = logs[length / 2] + 1;
    for (int j = 1; j <= logs[n]; j++) {
        int width = 1 << j, half = width / 2;
        for (int i = 0; i + width <= n; i++) {
            levels[j][i] = minimum(levels[j - 1][i], levels[j - 1][i + half]);
        }
    }
    for (int i = 0; i < q; i++) {
        int left, right;
        scanf("%d%d", &left, &right);
        int j = logs[right - left + 1];
        printf("%d\\n", minimum(levels[j][left], levels[j][right - (1 << j) + 1]));
    }
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
levels = [[next(tokens) for _ in range(n)]]
logs = [0] * (n + 1)
for width in range(2, n + 1):
    logs[width] = logs[width // 2] + 1
for level in range(1, logs[n] + 1):
    width = 1 << level
    half = width // 2
    prior = levels[-1]
    levels.append([min(prior[i], prior[i + half]) for i in range(n - width + 1)])
for _ in range(q):
    left, right = next(tokens), next(tokens)
    level = logs[right - left + 1]
    print(min(levels[level][left], levels[level][right - (1 << level) + 1]))`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        int[] logs = new int[n + 1];
        for (int length = 2; length <= n; length++) logs[length] = logs[length / 2] + 1;
        int[][] levels = new int[logs[n] + 1][n];
        for (int i = 0; i < n; i++) levels[0][i] = in.nextInt();
        for (int j = 1; j <= logs[n]; j++) {
            int width = 1 << j, half = width / 2;
            for (int i = 0; i + width <= n; i++) {
                levels[j][i] = Math.min(levels[j - 1][i], levels[j - 1][i + half]);
            }
        }
        for (int i = 0; i < q; i++) {
            int left = in.nextInt(), right = in.nextInt();
            int j = logs[right - left + 1];
            System.out.println(Math.min(levels[j][left], levels[j][right - (1 << j) + 1]));
        }
    }
}`,
    },
  }
]);
