import { defineTopics } from "./define.ts";

export const numberTheory = defineTopics([
  {
    "id": "modular-exponentiation",
    "stage": 10,
    "title": "Modular exponentiation",
    "objective": "Compute a large power modulo m by scanning the bits of its exponent.",
    "prerequisites": "Binary representation and integer division.",
    "analogy": "To make copies in powers of two, double the current stack at each bit and keep only the stacks requested by the exponent.",
    "explanation": "Square the base to move from one power of two to the next. When the current least significant exponent bit is set, multiply its power into the answer. Reduce after each multiplication.",
    "invariant": "At the start of every iteration, answer × base^remaining is congruent to the original power modulo m. An odd remaining exponent contributes one base factor before the exponent is halved and the base squared.",
    "pseudocode": "answer = 1 mod m\nbase = a mod m\nwhile exponent > 0:\n  if exponent is odd: answer = answer × base mod m\n  base = base × base mod m\n  exponent = floor(exponent / 2)\nreturn answer",
    "time": "O(log(e+1)) modular steps for exponent e, plus constant setup",
    "space": "O(1) for a fixed-width input",
    "trace": [
      [
        "answer=1, base=3, e=5",
        "Compute 3⁵ modulo 7."
      ],
      [
        "answer=3, base=2, e=2",
        "The lowest bit is 1, so multiply by 3. Squaring the base gives 9 mod 7 = 2."
      ],
      [
        "answer=3, base=4, e=1",
        "The current bit is 0, so only square and halve."
      ],
      [
        "answer=5, e=0",
        "The final bit is 1. The answer is 3 × 4 mod 7 = 5."
      ]
    ],
    "misconception": "Computing the full power before taking the remainder overflows fixed-width integers. The intermediate modular product also needs a wide enough type.",
    "debug": "Use a large base with exponent 2 to check that multiplication is carried out in 64 bits.",
    "fill": "What is the initial value of answer when m = 1?",
    "edgeCases": [
      "A zero exponent returns 1 mod m by the empty-product convention.",
      "Every answer is zero when m = 1.",
      "The modulus need not be prime."
    ],
    "revision": "Why does the exponent get halved when the base gets squared?",
    "further": "Use the same repeated-squaring structure to compute powers of a matrix.",
    "quiz": {
      "question": "Which powers of a multiply together to form a¹³?",
      "answers": [
        "a⁸, a⁴ and a",
        "a⁸ and a⁴",
        "a⁴, a² and a"
      ],
      "correct": 0,
      "feedback": "13 is 1101 in binary, so the selected powers are 8, 4 and 1."
    },
    "practice": {
      "title": "Power remainder",
      "description": "Compute a^e modulo m without forming the full power.",
      "format": "Read a e m as three nonnegative integers with m at least 1. Print one remainder.",
      "constraints": "0 ≤ a,m ≤ 10⁹, 1 ≤ m, and 0 ≤ e ≤ 10¹⁸. Use the empty-product convention for exponent zero.",
      "input": "3 5 7\n",
      "output": "5\n",
      "hints": [
        "Inspect the low bit of the exponent before halving it.",
        "In C and Java, use 64-bit integers for the multiplication."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    long long base, exponent, mod;
    if (scanf("%lld%lld%lld", &base, &exponent, &mod) != 3) return 0;
    base %= mod;
    long long answer = 1 % mod;
    while (exponent > 0) {
        if (exponent % 2) answer = answer * base % mod;
        base = base * base % mod;
        exponent /= 2;
    }
    printf("%lld\\n", answer);
    return 0;
}`,
      python: `base, exponent, mod = map(int, input().split())
base %= mod
answer = 1 % mod
while exponent:
    if exponent % 2:
        answer = answer * base % mod
    base = base * base % mod
    exponent //= 2
print(answer)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var input = new Scanner(System.in);
        long base = input.nextLong(), exponent = input.nextLong(), mod = input.nextLong();
        base %= mod;
        long answer = 1 % mod;
        while (exponent > 0) {
            if (exponent % 2 != 0) answer = answer * base % mod;
            base = base * base % mod;
            exponent /= 2;
        }
        System.out.println(answer);
    }
}`,
    },
  },
  {
    "id": "sieve-of-eratosthenes",
    "stage": 10,
    "title": "Sieve of Eratosthenes",
    "objective": "Generate prime information up to a bound by marking multiples.",
    "prerequisites": "Arrays, loops and divisibility.",
    "analogy": "Cross every composite off a numbered chart by moving in strides of each remaining prime.",
    "explanation": "Visit potential prime factors in ascending order. When p is unmarked, it is prime. Mark its multiples from p² because smaller multiples already contain a smaller prime factor. Count unmarked integers from 2 through the limit.",
    "invariant": "After processing factors through p, every composite with a prime factor at most p is marked. Every composite at most n has a prime factor at most √n, so the remaining candidates from 2 through n are prime.",
    "pseudocode": "marked = false for indices 0 through n\nfor p from 2 while p×p ≤ n:\n  if not marked[p]:\n    for multiple from p×p through n in steps of p:\n      marked[multiple] = true\nreturn count of unmarked indices 2 through n",
    "time": "O(n log log n) time for n ≥ 3",
    "space": "O(n) space",
    "trace": [
      [
        "n=12",
        "Begin with candidates 2 through 12."
      ],
      [
        "2 → 4, 6, 8, 10, 12",
        "Mark multiples of 2 from 4. Keep 2 itself."
      ],
      [
        "3 → 9, 12",
        "Mark multiples of 3 from 9. Smaller multiples were handled by 2."
      ],
      [
        "2, 3, 5, 7, 11",
        "Stop when the next possible factor exceeds √12. Five primes remain."
      ]
    ],
    "misconception": "Marking from p removes the prime itself. Start at p².",
    "debug": "Use n = 49 to catch a loop that stops before processing 7.",
    "fill": "What increment should the inner marking loop use for factor p?",
    "edgeCases": [
      "0 and 1 are outside the candidate range.",
      "A perfect square still needs its square-root factor processed.",
      "A composite that is marked repeatedly remains marked."
    ],
    "revision": "Why can the outer loop stop after floor(√n)?",
    "further": "Build a smallest-prime-factor table and use it to factor repeated queries.",
    "quiz": {
      "question": "What is the first multiple to mark when processing prime 5?",
      "answers": [
        "5",
        "10",
        "25"
      ],
      "correct": 2,
      "feedback": "The smaller composite multiples of 5 have a smaller prime factor. The first new one can be 25."
    },
    "practice": {
      "title": "Prime inventory",
      "description": "Count the prime labels available from 2 through n inclusive.",
      "format": "Read one integer n. Print how many primes are at most n.",
      "constraints": "0 ≤ n ≤ 100,000.",
      "input": "12\n",
      "output": "5\n",
      "hints": [
        "Only an unmarked candidate needs to mark multiples.",
        "Check the case where n is exactly a prime square."
      ]
    },
    code:{
      c: `#include <stdio.h>
static unsigned char marked[100001];
int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    for (int p = 2; p * p <= n; p++) {
        if (!marked[p]) {
            for (int m = p * p; m <= n; m += p) marked[m] = 1;
        }
    }
    int count = 0;
    for (int i = 2; i <= n; i++) if (!marked[i]) count++;
    printf("%d\\n", count);
    return 0;
}`,
      python: `from math import isqrt
n = int(input())
marked = bytearray(n + 1)
for p in range(2, isqrt(n) + 1):
    if not marked[p]:
        for multiple in range(p * p, n + 1, p):
            marked[multiple] = 1
print(sum(not marked[i] for i in range(2, n + 1)))`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        boolean[] marked = new boolean[n + 1];
        for (int p = 2; p * p <= n; p++) {
            if (!marked[p]) {
                for (int m = p * p; m <= n; m += p) marked[m] = true;
            }
        }
        int count = 0;
        for (int i = 2; i <= n; i++) if (!marked[i]) count++;
        System.out.println(count);
    }
}`,
    },
  }
]);
