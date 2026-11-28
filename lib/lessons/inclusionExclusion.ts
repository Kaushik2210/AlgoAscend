import { defineTopics } from "./define.ts";

export const inclusionExclusion = defineTopics([
  {
    "id": "inclusion-exclusion",
    "stage": 10,
    "title": "Inclusion–exclusion for overlapping conditions",
    "objective": "Count a union of divisibility conditions without counting intersections multiple times.",
    "prerequisites": "Subsets, divisibility, GCD, and LCM.",
    "analogy": "When merging guest lists, subtract the people counted by two lists, then restore those subtracted too many times.",
    "explanation": "For a nonempty subset of divisors, the intersection consists of multiples of their least common multiple. Add its size when the subset has odd cardinality and subtract it when even. For any number satisfying r conditions, the alternating binomial sum contributes one if r is positive and zero if r is zero. Skip an intersection as soon as its running LCM exceeds N.",
    "invariant": "Each retained subset contributes exactly its signed intersection count. A subset whose LCM exceeds N contributes zero and can be discarded without changing the final union.",
    "pseudocode": "answer=0\nfor every nonempty subset:\n  compute its LCM with safe multiplication\n  add N/LCM if subset size odd, subtract otherwise\nprint answer",
    "time": "O(k 2ᵏ log(max divisor+1)) for k divisors",
    "space": "O(k) for the input divisors",
    "trace": [
      [
        "N=12, divisors 2 and 3",
        "There are six multiples of two and four multiples of three."
      ],
      [
        "Pair intersection uses lcm(2,3)=6",
        "The numbers 6 and 12 were counted twice."
      ],
      [
        "Subtract two from 6+4",
        "Their contribution becomes one each."
      ],
      [
        "Result 8",
        "Both tests overlap, but each qualifying integer is counted once."
      ]
    ],
    "misconception": "The intersection uses the LCM. Multiplying divisors can miss valid intersections when they share factors.",
    "debug": "Use divisors 2, 2, and 4. The final count must equal the number of multiples of two.",
    "fill": "What sign is used for a three-divisor intersection?",
    "edgeCases": [
      "N=0 gives zero.",
      "A divisor of one makes every positive integer qualify.",
      "Repeated divisors are allowed."
    ],
    "revision": "Why can a running LCM that exceeds N never become useful after multiplying in another divisor?",
    "further": "Filter dominated divisors before subset enumeration and compare the number of states.",
    "quiz": {
      "question": "For two overlapping sets, what do you do after adding their sizes?",
      "answers": [
        "Add their intersection",
        "Subtract their intersection",
        "Divide by two"
      ],
      "correct": 1,
      "feedback": "Each intersection member was counted twice, so remove one copy."
    },
    "practice": {
      "title": "Count eligible serial numbers",
      "description": "Count positive integers at most N divisible by at least one listed divisor.",
      "format": "Read N k, then k divisors. Print the union count.",
      "constraints": "0 ≤ N ≤ 10¹², 1 ≤ k ≤ 10, and 1 ≤ divisor ≤ 10⁶.",
      "input": "12 2\n2 3\n",
      "output": "8\n",
      "hints": [
        "Alternate signs by subset size.",
        "Check division bounds before multiplying a candidate LCM."
      ]
    },
    code: {
      c: `#include <stdio.h>
static long long gcd(long long a, long long b) {
    while (b) { long long rest = a % b; a = b; b = rest; }
    return a;
}
int main(void) {
    long long n, divisors[10], answer = 0;
    int k;
    if (scanf("%lld%d", &n, &k) != 2) return 0;
    for (int i = 0; i < k; i++) scanf("%lld", &divisors[i]);
    for (int mask = 1; mask < (1 << k); mask++) {
        long long multiple = 1;
        int odd = 0;
        for (int i = 0; i < k; i++) if (mask & (1 << i)) {
            long long reduced = multiple / gcd(multiple, divisors[i]);
            if (reduced > n / divisors[i]) { multiple = n + 1; break; }
            multiple = reduced * divisors[i];
            odd ^= 1;
        }
        if (multiple <= n) answer += odd ? n / multiple : -(n / multiple);
    }
    printf("%lld\\n", answer);
    return 0;
}`,
      python: `from math import lcm
n, k = map(int, input().split())
divisors = list(map(int, input().split()))
answer = 0
for mask in range(1, 1 << k):
    multiple = 1
    for i, divisor in enumerate(divisors):
        if mask & (1 << i):
            multiple = lcm(multiple, divisor)
            if multiple > n:
                break
    else:
        count = n // multiple
        answer += count if mask.bit_count() % 2 else -count
print(answer)`,
      java: `import java.util.Scanner;
class Main {
    static long gcd(long a, long b) {
        while (b != 0) { long rest = a % b; a = b; b = rest; }
        return a;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        long n = in.nextLong(), answer = 0;
        int k = in.nextInt();
        long[] divisors = new long[k];
        for (int i = 0; i < k; i++) divisors[i] = in.nextLong();
        for (int mask = 1; mask < (1 << k); mask++) {
            long multiple = 1;
            for (int i = 0; i < k; i++) if ((mask & (1 << i)) != 0) {
                long reduced = multiple / gcd(multiple, divisors[i]);
                if (reduced > n / divisors[i]) { multiple = n + 1; break; }
                multiple = reduced * divisors[i];
            }
            if (multiple <= n) answer += Integer.bitCount(mask) % 2 != 0 ? n / multiple : -(n / multiple);
        }
        System.out.println(answer);
    }
}`,
    },
  }
]);
