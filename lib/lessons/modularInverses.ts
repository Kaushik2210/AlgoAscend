import { defineTopics } from "./define.ts";

export const modularInverses = defineTopics([
  {
    "id": "modular-inverses",
    "stage": 10,
    "title": "Modular inverses and Fermat’s little theorem",
    "objective": "Decide when a multiplicative inverse exists and compute it for prime or composite moduli.",
    "prerequisites": "Modular remainders, Euclid’s algorithm, and binary exponentiation.",
    "analogy": "An inverse step in a clock puzzle undoes multiplication and returns the hand to position one.",
    "explanation": "An inverse x satisfies a×x ≡ 1 mod m. Extended Euclid produces coefficients x and y with a×x+m×y=gcd(a,m), so a unit inverse exists exactly when that gcd is one. When m=p is prime and a is nonzero modulo p, Fermat’s little theorem gives a^(p−1) ≡ 1, so a^(p−2) is another way to obtain the inverse. The exercise uses extended Euclid, which also works for coprime composite moduli.",
    "invariant": "Every current remainder equals an integer combination of the original operands. The coefficient update uses the same quotient subtraction as the remainder update.",
    "pseudocode": "(r,s) = (a,m); (x,y) = (1,0)\nwhile s ≠ 0:\n  q = floor(r/s)\n  (r,s) = (s,r−q×s)\n  (x,y) = (y,x−q×y)\nif r=1 return normalized x mod m; otherwise NONE",
    "time": "O(log(max(a,m)+1)) remainder steps per query",
    "space": "O(1) space",
    "trace": [
      [
        "a=3, m=11",
        "Find a coefficient for 3 in an integer combination that equals one."
      ],
      [
        "11=3×3+2 and 3=1×2+1",
        "Substitute to get 1=4×3−11."
      ],
      [
        "Read inverse 4",
        "Multiplying 3×4 gives 12, which is 1 modulo 11."
      ],
      [
        "Fermat check: 3⁹ mod 11 is 4",
        "The prime-modulus formula agrees with extended Euclid."
      ]
    ],
    "misconception": "The exponent m−2 has the stated guarantee for prime modulus. A composite modulus requires another verified method.",
    "debug": "Try 2 modulo 4, 3 modulo 8, and 0 modulo 7.",
    "fill": "Which gcd value is required for a multiplicative inverse?",
    "edgeCases": [
      "Zero has no inverse for the allowed moduli.",
      "A coprime composite modulus still permits an inverse.",
      "Normalize a negative Bézout coefficient before printing."
    ],
    "revision": "Why does reducing the Bézout identity modulo m eliminate one term?",
    "further": "Batch inverse queries for the same prime modulus or implement modular division using the returned inverse.",
    "quiz": {
      "question": "Which is the inverse of 3 modulo 8?",
      "answers": [
        "2",
        "3",
        "5"
      ],
      "correct": 1,
      "feedback": "3×3=9≡1 modulo 8. The inverse exists even though 8 is composite."
    },
    "practice": {
      "title": "Undo modular multipliers",
      "description": "For each pair, find the least nonnegative multiplicative inverse or report that it does not exist.",
      "format": "Read q and q lines a m. Print the inverse of a modulo m, or NONE.",
      "constraints": "1 ≤ q ≤ 250, 0 ≤ a ≤ 10⁹, and 2 ≤ m ≤ 10⁹.",
      "input": "3\n3 11\n3 8\n2 4\n",
      "output": "4\n3\nNONE\n",
      "hints": [
        "Track the coefficient of a through the remainder recurrence.",
        "Check the final gcd before normalizing the coefficient."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int q;
    if (scanf("%d", &q) != 1) return 0;
    while (q--) {
        long long a, m, x = 1, y = 0;
        scanf("%lld%lld", &a, &m);
        long long r = a, s = m;
        while (s) {
            long long k = r / s, next = r - k * s, coefficient = x - k * y;
            r = s; s = next; x = y; y = coefficient;
        }
        if (r == 1) printf("%lld\\n", (x % m + m) % m);
        else puts("NONE");
    }
    return 0;
}`,
      python: `for _ in range(int(input())):
    a, m = map(int, input().split())
    r, s, x, y = a, m, 1, 0
    while s:
        quotient, remainder = divmod(r, s)
        r, s = s, remainder
        x, y = y, x - quotient * y
    print(x % m if r == 1 else "NONE")`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int q = in.nextInt();
        while (q-- > 0) {
            long r = in.nextLong(), m = in.nextLong(), s = m, x = 1, y = 0;
            while (s != 0) {
                long k = r / s, next = r - k * s, coefficient = x - k * y;
                r = s; s = next; x = y; y = coefficient;
            }
            if (r == 1) System.out.println((x % m + m) % m);
            else System.out.println("NONE");
        }
    }
}`,
    },
  }
]);
