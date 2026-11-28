import { defineTopics } from "./define.ts";

export const commonMultiples = defineTopics([
  {
    "id": "gcd-and-lcm",
    "stage": 10,
    "title": "GCD, LCM, and shared periods",
    "objective": "Use Euclid’s algorithm to compute the first shared repeat of two schedules.",
    "prerequisites": "Divisibility, remainders, and 64-bit integers.",
    "analogy": "Two signals repeat at their own intervals. Their first common flash occurs at the smallest positive tick divisible by both periods.",
    "explanation": "For positive a and b, their greatest common divisor counts each shared prime factor to the smaller exponent. Their least common multiple uses the larger exponent for each factor. Thus gcd(a,b)×lcm(a,b)=a×b. Compute the gcd using remainders and divide one operand by it before multiplying. The exercise defines the lcm with a zero operand as zero.",
    "invariant": "Replacing (a,b) by (b,a mod b) preserves the set of common divisors. After b reaches zero the remaining a is the gcd.",
    "pseudocode": "if a or b is zero: print 0\notherwise g = Euclid(a,b)\nprint (a/g)×b",
    "time": "O(log(min(a,b)+1)) Euclidean remainder steps for positive inputs",
    "space": "O(1) space",
    "trace": [
      [
        "Periods 12 and 18",
        "Find the shared factor before multiplying."
      ],
      [
        "Euclid: (18,12) → (12,6) → (6,0)",
        "The gcd is 6."
      ],
      [
        "Compute (12/6)×18",
        "Both periods divide 36."
      ],
      [
        "Answer 36",
        "The prime-factor identity makes this the least positive shared multiple."
      ]
    ],
    "misconception": "The gcd is a common divisor. A shared period needs a common multiple.",
    "debug": "Try equal periods, coprime periods, and one zero.",
    "fill": "Which operand can be divided by gcd before the multiplication?",
    "edgeCases": [
      "LCM of equal positive periods equals that period.",
      "LCM of coprime positive numbers is their product.",
      "Handle (0,0) before dividing."
    ],
    "revision": "What does the product identity imply when one period divides the other?",
    "further": "Fold LCM across multiple periods while rejecting a result above a supplied limit.",
    "quiz": {
      "question": "What is lcm(6, 8)?",
      "answers": [
        "2",
        "24",
        "48"
      ],
      "correct": 1,
      "feedback": "The gcd is two, so divide six by two before multiplying by eight."
    },
    "practice": {
      "title": "Synchronize two signals",
      "description": "Find the least common multiple for each pair of nonnegative periods.",
      "format": "Read q and q lines a b. Print one LCM per line, using zero when either operand is zero.",
      "constraints": "1 ≤ q ≤ 300 and 0 ≤ a,b ≤ 10⁹.",
      "input": "3\n12 18\n7 7\n0 9\n",
      "output": "36\n7\n0\n",
      "hints": [
        "Check for zero before dividing.",
        "Use 64-bit multiplication after dividing by gcd."
      ]
    },
    code: {
      c: `#include <stdio.h>
static long long gcd(long long a, long long b) {
    while (b) { long long rest = a % b; a = b; b = rest; }
    return a;
}
int main(void) {
    int q;
    if (scanf("%d", &q) != 1) return 0;
    while (q--) {
        long long a, b;
        scanf("%lld%lld", &a, &b);
        printf("%lld\\n", a && b ? (a / gcd(a, b)) * b : 0LL);
    }
    return 0;
}`,
      python: `from math import gcd
for _ in range(int(input())):
    a, b = map(int, input().split())
    print(a // gcd(a, b) * b if a and b else 0)`,
      java: `import java.util.Scanner;
class Main {
    static long gcd(long a, long b) {
        while (b != 0) { long rest = a % b; a = b; b = rest; }
        return a;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int q = in.nextInt();
        while (q-- > 0) {
            long a = in.nextLong(), b = in.nextLong();
            System.out.println(a != 0 && b != 0 ? (a / gcd(a, b)) * b : 0);
        }
    }
}`,
    },
  }
]);
