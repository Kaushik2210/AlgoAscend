import { defineTopics } from "./define.ts";

export const digitStates = defineTopics([
  {
    "id": "digit-dp",
    "stage": 9,
    "title": "Digit DP with a tight bound",
    "objective": "Count bounded integers without enumerating them individually.",
    "prerequisites": "Tabulation, remainders, and decimal place value.",
    "analogy": "Copy a maximum serial number one digit at a time. While your chosen prefix still matches it, the next digit has a limit.",
    "explanation": "Read the digits of N from left to right. A state stores the digit-sum remainder and whether its prefix still equals the bound. A tight prefix can choose at most the corresponding bound digit. A smaller prefix can choose any later digits. Give every integer the same width using leading zeros. That preserves its digit sum and gives exactly one way to represent it.",
    "invariant": "After each position, dp[tight][remainder] counts exactly the prefixes of that length with the indicated relation to the bound and digit-sum remainder.",
    "pseudocode": "dp[tight=1][remainder=0] = 1\nfor each bound digit b:\n  clear next\n  for each old state and allowed digit d:\n    next[tight and d=b][(remainder+d) mod k] += dp[state]\n  dp = next\nsum both remainder-zero states",
    "time": "O(Dk) for D digits and divisor k with at most ten transitions per state",
    "space": "O(k) using rolling tables",
    "trace": [
      [
        "N=23, k=3",
        "Begin with the empty prefix in the tight, remainder-zero state."
      ],
      [
        "Choose first digit 0, 1, or 2",
        "Prefixes 0 and 1 become loose. Prefix 2 stays tight."
      ],
      [
        "Choose the last digit",
        "Loose prefixes allow 0 through 9. Tight prefix 2 permits 0 through 3."
      ],
      [
        "Valid: 0, 3, 6, 9, 12, 15, 18, 21",
        "The remainder-zero cells count eight integers."
      ]
    ],
    "misconception": "A loose state never becomes tight again, even if its current digit matches the bound digit.",
    "debug": "Try N=0 and k=1. The answer must be exactly one.",
    "fill": "Which two conditions keep the new state tight?",
    "edgeCases": [
      "Zero is included.",
      "For k=1 every integer qualifies.",
      "Leading zeros represent smaller numbers once."
    ],
    "revision": "What extra state would you add to count numbers that contain exactly two nonzero digits?",
    "further": "Count qualifying integers on [L,R] with the difference of two prefix counts.",
    "quiz": {
      "question": "A prefix is already less than the bound. Which digits can extend it?",
      "answers": [
        "Only digits up to the bound digit",
        "All digits 0 through 9",
        "Only zero"
      ],
      "correct": 1,
      "feedback": "Later digits cannot undo a strict comparison at an earlier position."
    },
    "practice": {
      "title": "Count valid serial numbers",
      "description": "Count integers from 0 through N whose decimal digit sum is divisible by k.",
      "format": "Read N k and print the inclusive count.",
      "constraints": "0 ≤ N ≤ 10¹² and 1 ≤ k ≤ 20.",
      "input": "23 3\n",
      "output": "8\n",
      "hints": [
        "Keep a separate tight flag from the remainder.",
        "Use 64-bit counts in C and Java."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <string.h>
int main(void) {
    char bound[14];
    int k;
    long long dp[2][20] = {{0}};
    if (scanf("%13s%d", bound, &k) != 2) return 0;
    dp[1][0] = 1;
    for (int i = 0; bound[i]; i++) {
        int b = bound[i] - '0';
        long long next[2][20] = {{0}};
        for (int t = 0; t < 2; t++) for (int r = 0; r < k; r++) {
            for (int d = 0; d <= (t ? b : 9); d++) {
                next[t && d == b][(r + d) % k] += dp[t][r];
            }
        }
        memcpy(dp, next, sizeof dp);
    }
    printf("%lld\\n", dp[0][0] + dp[1][0]);
    return 0;
}`,
      python: `bound, k = input().split()
k = int(k)
dp = [[0] * k for _ in range(2)]
dp[1][0] = 1
for digit in bound:
    b = int(digit)
    nxt = [[0] * k for _ in range(2)]
    for tight in range(2):
        for r in range(k):
            for d in range((b if tight else 9) + 1):
                nxt[tight and d == b][(r + d) % k] += dp[tight][r]
    dp = nxt
print(dp[0][0] + dp[1][0])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        String bound = in.next();
        int k = in.nextInt();
        long[][] dp = new long[2][k];
        dp[1][0] = 1;
        for (char digit : bound.toCharArray()) {
            int b = digit - '0';
            long[][] next = new long[2][k];
            for (int t = 0; t < 2; t++) for (int r = 0; r < k; r++) {
                for (int d = 0; d <= (t == 1 ? b : 9); d++) {
                    next[t == 1 && d == b ? 1 : 0][(r + d) % k] += dp[t][r];
                }
            }
            dp = next;
        }
        System.out.println(dp[0][0] + dp[1][0]);
    }
}`,
    },
  }
]);
