import { defineTopics } from "./define.ts";

export const intervalSplits = defineTopics([
  {
    "id": "interval-dp",
    "stage": 9,
    "title": "Interval DP for matrix-chain multiplication",
    "objective": "Optimize a sequence of combinations by considering the final split of each interval.",
    "prerequisites": "Bottom-up DP, matrix dimensions, and interval indices.",
    "analogy": "Plan the order of a chain of assembly jobs. The final join divides the work into two smaller jobs that can be planned separately.",
    "explanation": "For matrices Aᵢ of shape d[i]×d[i+1], dp[l][r] is the minimum work to multiply Aₗ through Aᵣ. Try the final split k between l and r. The left result has dimensions d[l]×d[k+1] and the right d[k+1]×d[r+1]. Add the two subcosts and the final multiplication cost. Compute by increasing interval length.",
    "invariant": "Before computing intervals of length s, all shorter intervals have their exact minimum cost. Every parenthesization has one final split covered by the recurrence.",
    "pseudocode": "dp[i][i]=0\nfor length from 2 to n:\n  for each interval [l,r] of this length:\n    dp[l][r]=min over l≤k<r of dp[l][k]+dp[k+1][r]+d[l]×d[k+1]×d[r+1]",
    "time": "O(n³) for n matrices",
    "space": "O(n²) for the table",
    "trace": [
      [
        "Dimensions [10,30,5,60]",
        "The three matrices are 10×30, 30×5, and 5×60."
      ],
      [
        "Multiply the first pair for 1500",
        "Then multiply its 10×5 result by the final matrix for 3000."
      ],
      [
        "Multiply the last pair for 9000",
        "Then multiply the first matrix by the 30×60 result for 18000."
      ],
      [
        "Choose 4500",
        "The final split after the second matrix yields the smaller total."
      ]
    ],
    "misconception": "The dimensions of an interval’s product depend only on its endpoints. The cost of obtaining that product depends on the split choices.",
    "debug": "Try one matrix and a chain in which changing parentheses greatly changes the cost.",
    "fill": "If the final split follows k, what dimension is shared by the two resulting matrices?",
    "edgeCases": [
      "A single matrix needs zero multiplications.",
      "Split points never separate a matrix from itself.",
      "Store the split to reconstruct the optimal order."
    ],
    "revision": "Why does filling by increasing interval length make every transition available?",
    "further": "Print an optimal parenthesization using the selected split at each interval.",
    "quiz": {
      "question": "What is the multiplication cost for a 10×30 matrix times a 30×5 matrix?",
      "answers": [
        "150",
        "1500",
        "4500"
      ],
      "correct": 1,
      "feedback": "The standard algorithm computes 10×5 entries with 30 multiplications each."
    },
    "practice": {
      "title": "Plan a matrix assembly chain",
      "description": "Find the minimum number of scalar multiplications for a compatible chain.",
      "format": "Read n followed by n+1 dimensions. Matrix i has shape d[i]×d[i+1]. Print the optimum.",
      "constraints": "1 ≤ n ≤ 80 and 1 ≤ d[i] ≤ 100.",
      "input": "3\n10 30 5 60\n",
      "output": "4500\n",
      "hints": [
        "Try the final split of each interval.",
        "Use zero cost on the diagonal."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int dp[80][80];
int main(void) {
    int n, d[81];
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i <= n; i++) scanf("%d", &d[i]);
    for (int len = 2; len <= n; len++) for (int l = 0; l + len <= n; l++) {
        int r = l + len - 1, best = 1000000000;
        for (int k = l; k < r; k++) {
            int candidate = dp[l][k] + dp[k + 1][r] + d[l] * d[k + 1] * d[r + 1];
            if (candidate < best) best = candidate;
        }
        dp[l][r] = best;
    }
    printf("%d\\n", dp[0][n - 1]);
    return 0;
}`,
      python: `n = int(input())
d = list(map(int, input().split()))
dp = [[0] * n for _ in range(n)]
for length in range(2, n + 1):
    for left in range(n - length + 1):
        right = left + length - 1
        dp[left][right] = min(dp[left][k] + dp[k + 1][right] + d[left] * d[k + 1] * d[right + 1]
                              for k in range(left, right))
print(dp[0][-1])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        int[] d = new int[n + 1];
        int[][] dp = new int[n][n];
        for (int i = 0; i <= n; i++) d[i] = in.nextInt();
        for (int len = 2; len <= n; len++) for (int l = 0; l + len <= n; l++) {
            int r = l + len - 1, best = Integer.MAX_VALUE;
            for (int k = l; k < r; k++) {
                best = Math.min(best, dp[l][k] + dp[k + 1][r] + d[l] * d[k + 1] * d[r + 1]);
            }
            dp[l][r] = best;
        }
        System.out.println(dp[0][n - 1]);
    }
}`,
    },
  }
]);
