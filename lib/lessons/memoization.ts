import { defineTopics } from "./define.ts";

export const memoization = defineTopics([
  {
    "id": "fibonacci-memoization",
    "stage": 9,
    "title": "Memoization and the Fibonacci recurrence",
    "objective": "Evaluate a recurrence by caching repeated subproblems and sharing results across queries.",
    "prerequisites": "Recursion, function return values and arrays.",
    "analogy": "When a worksheet asks the same intermediate question repeatedly, keep the answer on a reference card and look it up next time.",
    "explanation": "A recurrence defines an answer using smaller inputs. Fibonacci starts with F(0)=0 and F(1)=1 and uses F(n)=F(n−1)+F(n−2). Direct recursion repeats some indices many times. Memoization caches an answer the first time the function computes it. Subsequent calls for that index can return the stored value. Keeping the cache between queries also avoids repeated work across separate inputs.",
    "invariant": "Every populated cache entry equals the Fibonacci value of its index. Base cases are exact and a newly stored value combines two exact answers from smaller indices.",
    "pseudocode": "fibonacci(n):\n  if n < 2: return n\n  if n has cached value: return it\n  cache[n] = fibonacci(n−1) + fibonacci(n−2)\n  return cache[n]\nanswer each query using the same cache",
    "time": "O(M+q) for q queries with maximum index M",
    "space": "O(M) cache and recursion depth",
    "trace": [
      [
        "Query F(4)",
        "To compute it, descend to F(3) then F(2)."
      ],
      [
        "Compute F(2) = 1",
        "Combine F(1)=1 and F(0)=0. Cache index 2."
      ],
      [
        "Compute F(3) = 2",
        "Use F(2) plus F(1). F(4) can reuse the cached F(2) for its second call."
      ],
      [
        "Cache F(4) = 3",
        "A later query for F(4) returns directly. No descendants run again."
      ]
    ],
    "misconception": "A memo cache stores answers by full subproblem state. Caching only one global result mixes answers for different indices.",
    "debug": "Test both base cases and ask for the same nontrivial index twice.",
    "fill": "Which two smaller indices determine F(n) for n≥2?",
    "edgeCases": [
      "F(0)=0 is valid and handled directly.",
      "Repeated queries share the cache.",
      "F(92) fits in signed 64-bit storage. F(93) exceeds it."
    ],
    "revision": "What changes when top-down memoization becomes bottom-up tabulation?",
    "further": "Tabulate the same recurrence and then reduce storage to just the previous two values for a single query.",
    "quiz": {
      "question": "What is F(5) when F(3)=2 and F(4)=3?",
      "answers": [
        "3",
        "5",
        "6"
      ],
      "correct": 1,
      "feedback": "The recurrence adds the previous two values, so F(5)=3+2."
    },
    "practice": {
      "title": "Answer recurrence queries",
      "description": "Print requested Fibonacci values while retaining a shared memo table across queries.",
      "format": "Read q, then q integers n, one on each line. Print F(n) for each query.",
      "constraints": "0 ≤ q ≤ 400 and 0 ≤ n ≤ 92.",
      "input": "4\n4\n2\n4\n0\n",
      "output": "3\n1\n3\n0\n",
      "hints": [
        "Return the two base cases directly.",
        "Keep the same cache across all queries."
      ]
    },
    code: {
      c: `#include <stdio.h>
static long long memo[93];
static long long fib(int n) {
    if (n < 2) return n;
    if (memo[n] == 0) memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}
int main(void) {
    int q;
    if (scanf("%d", &q) != 1) return 0;
    for (int i = 0; i < q; i++) {
        int n;
        scanf("%d", &n);
        printf("%lld\\n", fib(n));
    }
    return 0;
}`,
      python: `from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

for _ in range(int(input())):
    print(fib(int(input())))`,
      java: `import java.util.Scanner;
class Main {
    static final long[] memo = new long[93];
    static long fib(int n) {
        if (n < 2) return n;
        if (memo[n] == 0) memo[n] = fib(n - 1) + fib(n - 2);
        return memo[n];
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int q = in.nextInt();
        for (int i = 0; i < q; i++) System.out.println(fib(in.nextInt()));
    }
}`,
    },
  }
]);
