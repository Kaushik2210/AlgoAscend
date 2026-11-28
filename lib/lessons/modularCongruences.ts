import { defineTopics } from "./define.ts";

export const modularCongruences = defineTopics([
  {
    "id": "chinese-remainder-theorem",
    "stage": 10,
    "title": "Chinese remainder theorem and compatible residues",
    "objective": "Merge two congruences, including the case of shared factors.",
    "prerequisites": "GCD, LCM, and extended Euclid.",
    "analogy": "Find the first tick matching two clock faces with different lengths. The two clocks need compatible readings at their shared scale.",
    "explanation": "Write x=a+m×k. Requiring x≡b mod n gives m×k≡b−a mod n. Let g=gcd(m,n). A solution exists only when g divides b−a. Divide by g; the reduced coefficient is coprime to n/g. Extended Euclid supplies its inverse. Normalize k into [0,n/g), then x is the least nonnegative solution and repeats every lcm(m,n).",
    "invariant": "Every candidate a+m×k satisfies the first congruence. The Bézout coefficient of m is also the inverse of m/g modulo n/g, so the normalized k enforces the second.",
    "pseudocode": "(g, coefficient) = extended_gcd(m,n), tracking the coefficient of m\nif (b−a) mod g ≠ 0: return NONE\nk = normalize(((b−a)/g)×coefficient, n/g)\nreturn a + m×k",
    "time": "O(log(max(m,n)+1)) Euclidean steps per pair",
    "space": "O(1) space",
    "trace": [
      [
        "x≡1 mod 4 and x≡3 mod 6",
        "The gcd is 2, which divides the difference 2."
      ],
      [
        "Set x=1+4k",
        "The reduced equation is 2k≡1 mod 3."
      ],
      [
        "k≡2 mod 3",
        "Two has inverse two modulo three."
      ],
      [
        "Least solution x=9",
        "Other solutions differ by lcm(4,6)=12."
      ]
    ],
    "misconception": "Shared factors can give compatible or incompatible congruences. Test their residue difference before trying an inverse.",
    "debug": "Compare residues 1 and 3 with residues 1 and 2 under moduli 4 and 6.",
    "fill": "Which divisor must divide b−a?",
    "edgeCases": [
      "A modulus of one imposes no restriction.",
      "If one modulus divides the other, the larger modulus already sets the period.",
      "Normalize a negative intermediate remainder."
    ],
    "revision": "Why is the repeat period the least common multiple?",
    "further": "Merge several congruences in sequence while checking for overflow of the combined period.",
    "quiz": {
      "question": "Can x be 1 modulo 4 and 2 modulo 6?",
      "answers": [
        "Yes",
        "No",
        "Only when x is large"
      ],
      "correct": 1,
      "feedback": "The first residue makes x odd, while the second makes it even."
    },
    "practice": {
      "title": "Align pairs of modular clocks",
      "description": "Find the least nonnegative number satisfying both supplied congruences, or report no solution.",
      "format": "Read q, then q lines a m b n representing x≡a mod m and x≡b mod n. Print each least solution or NONE.",
      "constraints": "1 ≤ q ≤ 200, 1 ≤ m,n ≤ 10⁶, 0 ≤ a < m, and 0 ≤ b < n.",
      "input": "3\n2 3 3 5\n1 4 3 6\n1 4 2 6\n",
      "output": "8\n9\nNONE\n",
      "hints": [
        "Express all solutions to the first congruence as a+m×k.",
        "Normalize k using the reduced modulus n/g."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int q;
    if (scanf("%d", &q) != 1) return 0;
    while (q--) {
        long long a, m, b, n;
        scanf("%lld%lld%lld%lld", &a, &m, &b, &n);
        long long r = m, s = n, x = 1, y = 0;
        while (s) {
            long long k = r / s, next = r - k * s, coefficient = x - k * y;
            r = s; s = next; x = y; y = coefficient;
        }
        if ((b - a) % r) { puts("NONE"); continue; }
        long long reduced = n / r, k = ((b - a) / r * x) % reduced;
        if (k < 0) k += reduced;
        printf("%lld\\n", a + m * k);
    }
    return 0;
}`,
      python: `for _ in range(int(input())):
    a, m, b, n = map(int, input().split())
    r, s, x, y = m, n, 1, 0
    while s:
        k, rest = divmod(r, s)
        r, s = s, rest
        x, y = y, x - k * y
    if (b - a) % r:
        print("NONE")
    else:
        k = ((b - a) // r * x) % (n // r)
        print(a + m * k)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int q = in.nextInt();
        while (q-- > 0) {
            long a = in.nextLong(), m = in.nextLong(), b = in.nextLong(), n = in.nextLong();
            long r = m, s = n, x = 1, y = 0;
            while (s != 0) {
                long k = r / s, next = r - k * s, coefficient = x - k * y;
                r = s; s = next; x = y; y = coefficient;
            }
            if ((b - a) % r != 0) { System.out.println("NONE"); continue; }
            long reduced = n / r, k = ((b - a) / r * x) % reduced;
            if (k < 0) k += reduced;
            System.out.println(a + m * k);
        }
    }
}`,
    },
  }
]);
