import { defineTopics } from "./define.ts";

export const combinatorics = defineTopics([
  {
    "id": "counting-combinations",
    "stage": 10,
    "title": "Combinations and Pascal’s recurrence",
    "objective": "Count unordered selections by splitting on whether a distinguished item is chosen.",
    "prerequisites": "Arrays and dynamic programming.",
    "analogy": "To count committees, set one candidate aside. Count committees that leave that candidate out, then count smaller committees that include them.",
    "explanation": "C(n,k) counts subsets of size k from n distinct items. Look at one fixed item. Omitting it leaves C(n−1,k) possibilities. Including it leaves C(n−1,k−1) ways to fill the remaining places. Add the disjoint counts. Store one row and update k downward so both predecessor values still belong to the previous row.",
    "invariant": "After processing i items, ways[j] counts j-element subsets from those i items. The empty subset contributes one throughout, and overlarge subset sizes remain zero.",
    "pseudocode": "ways[0] = 1\nfor items from 1 through n:\n  for choose from min(items,k) down to 1:\n    ways[choose] += ways[choose−1]\nreturn ways[k]",
    "time": "O(nk+n) time",
    "space": "O(k+1) for the current row",
    "trace": [
      [
        "n=4, k=2 | ways=[1,0,0]",
        "Before seeing any items, only the empty selection counts."
      ],
      [
        "After 1 item → [1,1,0]",
        "There is one way to select a single item."
      ],
      [
        "After 2 items → [1,2,1]",
        "The two-item selection uses both items."
      ],
      [
        "After 3 then 4 items → [1,3,3] → [1,4,6]",
        "The final pair count is 3 previous pairs plus 3 pairs containing the fourth item."
      ]
    ],
    "misconception": "Permutations distinguish order. A committee containing Ada and Bo is one combination regardless of which name is listed first.",
    "debug": "Use n=1 and k=1, then check that adding a second item creates one pair rather than reusing the first item.",
    "fill": "When the distinguished item is included, how many places remain to fill?",
    "edgeCases": [
      "Choosing zero items has one result, even from zero items.",
      "Choosing more items than available has zero results.",
      "The exercise bounds the output to fit signed 64-bit storage."
    ],
    "revision": "Why do the inclusion and exclusion groups never overlap?",
    "further": "Verify the symmetry C(n,k)=C(n,n−k) by taking complements.",
    "quiz": {
      "question": "How many pairs can be chosen from four distinct items?",
      "answers": [
        "4",
        "6",
        "12"
      ],
      "correct": 1,
      "feedback": "Each of the 12 ordered pairs appears twice when order is ignored, giving six."
    },
    "practice": {
      "title": "Count eligible committees",
      "description": "Count the distinct ways to choose a committee when seat order is irrelevant.",
      "format": "Read n and k. Print the number of k-element subsets from n distinct candidates.",
      "constraints": "0 ≤ n,k ≤ 60.",
      "input": "4 2\n",
      "output": "6\n",
      "hints": [
        "Start the empty subset count at one.",
        "Update the one-row table from larger sizes down to smaller sizes."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, k;
    long long ways[61] = {1};
    if (scanf("%d%d", &n, &k) != 2) return 0;
    for (int i = 1; i <= n; i++) {
        int highest = i < k ? i : k;
        for (int j = highest; j >= 1; j--) ways[j] += ways[j - 1];
    }
    printf("%lld\\n", ways[k]);
    return 0;
}`,
      python: `n, k = map(int, input().split())
ways = [1] + [0] * k
for i in range(1, n + 1):
    for j in range(min(i, k), 0, -1):
        ways[j] += ways[j - 1]
print(ways[k])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), k = in.nextInt();
        long[] ways = new long[k + 1];
        ways[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = Math.min(i, k); j >= 1; j--) ways[j] += ways[j - 1];
        }
        System.out.println(ways[k]);
    }
}`,
    },
  },
  {
    "id": "prime-factorization",
    "stage": 10,
    "title": "Prime factorization by trial division",
    "objective": "Find each prime factor and its multiplicity by repeatedly dividing it out.",
    "prerequisites": "Prime numbers, integer division and divisibility.",
    "analogy": "Break a number into reusable blocks. Begin with the smallest block size that divides it evenly and keep using it until it no longer fits.",
    "explanation": "Try potential divisors in increasing order. Whenever one divides the remaining number, record it and divide repeatedly. Any divisor that succeeds is prime because its smaller factors would already have been removed. Once d exceeds the square root of the remaining quotient, a quotient greater than one is itself prime.",
    "invariant": "The product of recorded factors times the remaining quotient equals the original number, and no prime below the current trial divisor divides the quotient.",
    "pseudocode": "rest = n\nfor d from 2 while d ≤ rest / d:\n  while rest is divisible by d:\n    record d\n    rest /= d\nif rest > 1: record rest",
    "time": "O(√n) trial divisions in the worst case",
    "space": "O(log n) for the recorded factors",
    "trace": [
      [
        "n=84",
        "Try divisor two first."
      ],
      [
        "84 → 42 → 21",
        "Record two copies of 2, then stop dividing by 2."
      ],
      [
        "21 → 7",
        "Dividing by 3 records the next factor."
      ],
      [
        "Factor 7 remains",
        "The next candidate 4 exceeds √7. Record 7 and print 2 2 3 7."
      ]
    ],
    "misconception": "Stopping after one successful division loses repeated prime factors.",
    "debug": "Try 64. Every factor printed must be 2, and there should be six copies.",
    "fill": "What can you conclude about the remaining quotient once all divisors up to its square root have been checked?",
    "edgeCases": [
      "One has no prime factors.",
      "A prime input is printed by the final residual check.",
      "A perfect square needs its square-root divisor checked."
    ],
    "revision": "Why can a composite trial divisor never succeed after its smaller prime factors have been removed?",
    "further": "Use a smallest-prime-factor sieve to speed up repeated factorizations.",
    "quiz": {
      "question": "Which factor list multiplies to 12?",
      "answers": [
        "2 3",
        "2 2 3",
        "3 4"
      ],
      "correct": 1,
      "feedback": "12 is divisible by 2 twice and then by 3, giving 2 × 2 × 3."
    },
    "practice": {
      "title": "Break a number into prime factors",
      "description": "Return all prime factors of the given integer with repetitions.",
      "format": "Read n. Print its prime factors in increasing order separated by spaces, or NONE if n is one.",
      "constraints": "1 ≤ n ≤ 10⁹.",
      "input": "84\n",
      "output": "2 2 3 7\n",
      "hints": [
        "Divide by one factor repeatedly before trying the next.",
        "Remember a prime residual after the loop."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, factors[30], used = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int d = 2; d <= n / d; d++) {
        while (n % d == 0) {
            factors[used++] = d;
            n /= d;
        }
    }
    if (n > 1) factors[used++] = n;
    if (!used) puts("NONE");
    else {
        for (int i = 0; i < used; i++) printf("%s%d", i ? " " : "", factors[i]);
        puts("");
    }
    return 0;
}`,
      python: `n = int(input())
factors = []
divisor = 2
while divisor <= n // divisor:
    while n % divisor == 0:
        factors.append(divisor)
        n //= divisor
    divisor += 1
if n > 1:
    factors.append(n)
if factors:
    print(*factors)
else:
    print("NONE")`,
      java: `import java.util.Scanner;
import java.util.StringJoiner;
class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        var factors = new StringJoiner(" ");
        for (int d = 2; d <= n / d; d++) {
            while (n % d == 0) {
                factors.add(String.valueOf(d));
                n /= d;
            }
        }
        if (n > 1) factors.add(String.valueOf(n));
        System.out.println(factors.length() == 0 ? "NONE" : factors.toString());
    }
}`,
    },
  }
]);
