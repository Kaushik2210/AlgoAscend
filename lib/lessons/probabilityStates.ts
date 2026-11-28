import { defineTopics } from "./define.ts";

export const probabilityStates = defineTopics([
  {
    "id": "probability-dp",
    "stage": 9,
    "title": "Probability DP for independent trials",
    "objective": "Track the distribution of successes across independent trials with unequal probabilities.",
    "prerequisites": "Tabulation, counting, and reduced fractions.",
    "analogy": "Expand a diagram of choices six ways for every die. Keep only how many paths arrive at each success count.",
    "explanation": "Each six-sided trial has s successful faces. Track the number of equally likely outcome sequences with j successes. An old sequence extends in 6−s failure ways into the same count and s success ways into the next count. Independence lets you multiply by these choices. Divide the requested count by 6ⁿ and reduce the fraction.",
    "invariant": "After processing i trials, ways[j] counts exactly the length-i face sequences with j successes. The total across all states is 6ⁱ.",
    "pseudocode": "ways[0]=1\nrepeat for each trial with s successful faces:\n  for j from current maximum down to zero:\n    ways[j]=old[j]×(6−s)+old[j−1]×s\nreduce ways[k]/6ⁿ",
    "time": "O(n²) time for n trials",
    "space": "O(n) for the rolling count table",
    "trace": [
      [
        "Success faces [2,4], target one success",
        "There are 36 equally likely two-trial outcomes."
      ],
      [
        "First trial gives ways [4,2]",
        "Four outcomes are failures and two are successes."
      ],
      [
        "Exactly one after the second trial",
        "Combine 4×4 outcomes with a second success and 2×2 outcomes with a second failure."
      ],
      [
        "20/36 = 5/9",
        "The recurrence counts two disjoint groups. Reduce by four."
      ]
    ],
    "misconception": "With different trial probabilities, choosing which trials succeed does not make every success pattern equally likely.",
    "debug": "Include a trial with zero successful faces and one with six.",
    "fill": "How many next faces keep the same success count for a trial with s successful faces?",
    "edgeCases": [
      "Zero trials gives one sequence with zero successes.",
      "An impossible target prints 0/1.",
      "All arithmetic fits in 64 bits for at most twenty trials."
    ],
    "revision": "What assumption permits multiplying the previous count by the number of next faces?",
    "further": "Replace the outcome counts with doubles for arbitrary input probabilities and compare numerical error.",
    "quiz": {
      "question": "What happens when the next trial has six successful faces?",
      "answers": [
        "Every reachable count stays unchanged",
        "Every reachable count shifts up one",
        "The prior counts all disappear"
      ],
      "correct": 1,
      "feedback": "Every face is a success, so every existing outcome adds one success."
    },
    "practice": {
      "title": "Compute the exact success probability",
      "description": "Given counts of successful faces on independent fair six-sided trials, find the probability of exactly k successful trials.",
      "format": "Read n k followed by n integers giving the number of successful faces. Print the reduced fraction numerator/denominator.",
      "constraints": "0 ≤ k ≤ n ≤ 20 and 0 ≤ successful faces ≤ 6.",
      "input": "2 1\n2 4\n",
      "output": "5/9\n",
      "hints": [
        "Track integer counts of face sequences.",
        "Process counts downward when updating one array."
      ]
    },
    code: {
      c: `#include <stdio.h>
static long long gcd(long long a, long long b) {
    while (b) { long long rest = a % b; a = b; b = rest; }
    return a;
}
int main(void) {
    int n, k;
    long long ways[21] = {1}, denominator = 1;
    if (scanf("%d%d", &n, &k) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int s; scanf("%d", &s);
        for (int j = i + 1; j >= 0; j--) ways[j] = ways[j] * (6 - s) + (j ? ways[j - 1] * s : 0);
        denominator *= 6;
    }
    long long divisor = gcd(ways[k], denominator);
    printf("%lld/%lld\\n", ways[k] / divisor, denominator / divisor);
    return 0;
}`,
      python: `from fractions import Fraction
import sys
n, k, *faces = map(int, sys.stdin.read().split())
ways = [1] + [0] * n
for i, s in enumerate(faces):
    for j in range(i + 1, -1, -1):
        ways[j] = ways[j] * (6 - s) + (ways[j - 1] * s if j else 0)
answer = Fraction(ways[k], 6**n)
print(f"{answer.numerator}/{answer.denominator}")`,
      java: `import java.util.Scanner;
class Main {
    static long gcd(long a, long b) {
        while (b != 0) { long rest = a % b; a = b; b = rest; }
        return a;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), k = in.nextInt();
        long[] ways = new long[n + 1];
        ways[0] = 1;
        long denominator = 1;
        for (int i = 0; i < n; i++) {
            int s = in.nextInt();
            for (int j = i + 1; j >= 0; j--) ways[j] = ways[j] * (6 - s) + (j > 0 ? ways[j - 1] * s : 0);
            denominator *= 6;
        }
        long divisor = gcd(ways[k], denominator);
        System.out.println((ways[k] / divisor) + "/" + (denominator / divisor));
    }
}`,
    },
  }
]);
