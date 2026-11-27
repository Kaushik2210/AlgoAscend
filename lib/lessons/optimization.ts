import { defineTopics } from "./define.ts";

export const optimization = defineTopics([
  {
    "id": "coin-change-dp",
    "stage": 9,
    "title": "Dynamic programming for minimum coins",
    "objective": "Define a state, transition, and unreachable sentinel for an unbounded coin problem.",
    "prerequisites": "Arrays, loops, and minimization.",
    "analogy": "Find a cheap path to a high floor by remembering the cheapest path to each lower floor.",
    "explanation": "Let dp[x] be the minimum number of coins totaling x. Set dp[0]=0 and give other states a sentinel larger than any feasible answer. For each amount in increasing order, try every coin and extend a reachable smaller amount.",
    "invariant": "Any solution for x ends with some coin c. Removing c gives a solution to x−c. Taking the best reachable predecessor gives the optimal count by induction.",
    "pseudocode": "dp[0] ← 0; mark other states unreachable\nfor x from 1 to target:\n    for each coin c ≤ x:\n        dp[x] ← min(dp[x], dp[x−c]+1)",
    "time": "O(target × k) time for k coins",
    "space": "O(target+k) space",
    "trace": [
      [
        "coins = [1,3,4], target = 6 | dp[0] = 0",
        "Begin with the empty payment."
      ],
      [
        "dp[3] = 1 | dp[4] = 1 | dp[5] = 2",
        "A coin equal to the amount reaches it from zero in one step."
      ],
      [
        "dp[6] = min(3,2,3) = 2",
        "Two 3s beat taking the largest coin first, which would give 4, 1, and 1."
      ]
    ],
    "misconception": "The largest usable coin does not always minimize the count.",
    "debug": "Why can an unreachable prefix not improve the state?",
    "fill": "Complete dp[x] = min(dp[x], dp[x−c] + __).",
    "edgeCases": [
      "Zero uses zero coins.",
      "Some positive amounts are unreachable.",
      "Repeated denominations do not change the minimum."
    ],
    "revision": "Derive the transition by removing the last coin.",
    "further": "Compare loop order for counting combinations.",
    "quiz": {
      "question": "With coins 1, 3, and 4, how many coins are needed for 6?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 1,
      "feedback": "Two 3s work. A single coin would have to be 6."
    },
    "practice": {
      "title": "Pay with the fewest tokens",
      "description": "Find the minimum number of reusable tokens needed to pay exactly.",
      "format": "Read k and target, then k denominations. Print the minimum count or −1.",
      "constraints": "1 ≤ k ≤ 20, 0 ≤ target ≤ 1000, and 1 ≤ denominations ≤ 1000.",
      "input": "3 6\n1 3 4\n",
      "output": "2\n",
      "hints": [
        "Store a count for each amount.",
        "Try all choices for the last token.",
        "Use a sentinel larger than any feasible count."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    int k, target, coins[20], dp[1001];
    if (scanf("%d%d", &k, &target) != 2) return 1;
    for (int i = 0; i < k; ++i) if (scanf("%d", &coins[i]) != 1) return 1;
    int unreachable = target + 1;
    dp[0] = 0;
    for (int x = 1; x <= target; ++x) {
        dp[x] = unreachable;
        for (int i = 0; i < k; ++i) {
            int c = coins[i];
            if (c <= x && dp[x-c] + 1 < dp[x]) dp[x] = dp[x-c] + 1;
        }
    }
    printf("%d\\n", dp[target] == unreachable ? -1 : dp[target]);
    return 0;
}`,
      python: `k, target = map(int, input().split())
coins = list(map(int, input().split()))
unreachable = target + 1
dp = [0] + [unreachable] * target
for x in range(1, target + 1):
    for coin in coins:
        if coin <= x:
            dp[x] = min(dp[x], dp[x-coin] + 1)
print(-1 if dp[target] == unreachable else dp[target])`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int k = in.nextInt(), target = in.nextInt(), unreachable = target + 1;
        int[] coins = new int[k], dp = new int[target+1];
        for (int i = 0; i < k; i++) coins[i] = in.nextInt();
        for (int x = 1; x <= target; x++) {
            dp[x] = unreachable;
            for (int coin : coins) {
                if (coin <= x) dp[x] = Math.min(dp[x], dp[x-coin] + 1);
            }
        }
        System.out.println(dp[target] == unreachable ? -1 : dp[target]);
    }
}`,
    },
  },
  {
    "id": "euclidean-algorithm",
    "stage": 10,
    "title": "GCD with the Euclidean algorithm",
    "objective": "Explain why the remainder step preserves the greatest common divisor.",
    "prerequisites": "Integer division and remainder.",
    "analogy": "To find a stride that tiles two lengths, remove copies of the shorter length from the longer one.",
    "explanation": "Replace (a,b) by (b,a mod b) while b is nonzero. Once the second value reaches zero, the first holds the GCD.",
    "invariant": "A number divides both a and b exactly when it divides b and a−floor(a/b)×b. The remainder is smaller than b, ensuring termination.",
    "pseudocode": "while b ≠ 0:\n    r ← a mod b\n    a ← b; b ← r\nprint a",
    "time": "O(log(min(a,b)+1)+1) remainder steps",
    "space": "O(1) auxiliary space",
    "trace": [
      [
        "(84,30)",
        "84 mod 30 is 24."
      ],
      [
        "(30,24) → (24,6)",
        "30 mod 24 is 6."
      ],
      [
        "(6,0) → 6",
        "The last nonzero divisor is the GCD."
      ]
    ],
    "misconception": "Check for a zero divisor before attempting to take a remainder.",
    "debug": "Why does assigning a=b first lose information?",
    "fill": "Save the remainder before overwriting __.",
    "edgeCases": [
      "gcd(a,0)=a for nonnegative a.",
      "This challenge defines gcd(0,0)=0.",
      "Coprime positive inputs return one."
    ],
    "revision": "The set of common divisors stays the same after each remainder.",
    "further": "Extend Euclid for Bézout coefficients and modular inverses.",
    "quiz": {
      "question": "Which pair follows (30,24)?",
      "answers": [
        "(24,6)",
        "(30,6)",
        "(6,24)"
      ],
      "correct": 0,
      "feedback": "30 mod 24 is 6. The old divisor goes first."
    },
    "practice": {
      "title": "Find the common stride",
      "description": "Compute the greatest common divisor of two distances.",
      "format": "Read a and b. Print their GCD. Define gcd(0,0)=0.",
      "constraints": "0 ≤ a,b ≤ 1,000,000,000.",
      "input": "84 30\n",
      "output": "6\n",
      "hints": [
        "Take a remainder against the second value.",
        "Save it before overwriting the pair.",
        "Stop at a zero divisor."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    int a, b;
    if (scanf("%d%d", &a, &b) != 2) return 1;
    while (b != 0) {
        int next = a % b;
        a = b;
        b = next;
    }
    printf("%d\\n", a);
    return 0;
}`,
      python: `a, b = map(int, input().split())
while b:
    a, b = b, a % b
print(a)`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt(), b = in.nextInt();
        while (b != 0) {
            int next = a % b;
            a = b;
            b = next;
        }
        System.out.println(a);
    }
}`,
    },
  },
  {
    "id": "fenwick-trees",
    "stage": 11,
    "title": "Fenwick trees for changing range sums",
    "objective": "Trace a point update and a prefix query using the lowest set bit.",
    "prerequisites": "Prefix sums, 1-based indexes, and bitwise AND.",
    "analogy": "Keep summaries for groups of logbook pages and combine the groups needed for each query.",
    "explanation": "At index i store the sum of the last lowbit(i) items ending there. Adding lowbit moves an update to the next block containing the item. Subtracting it moves a prefix query to the preceding disjoint block.",
    "invariant": "tree[i] stores the sum on [i−lowbit(i)+1,i]. Updates visit all blocks covering the changed element. Query blocks partition the prefix.",
    "pseudocode": "add(i,d): while i ≤ n: tree[i] += d; i += lowbit(i)\nprefix(i): while i > 0: sum += tree[i]; i -= lowbit(i)",
    "time": "O(log n) per operation after O(n) initialization",
    "space": "O(n) space",
    "trace": [
      [
        "n = 8 | all entries zero",
        "Begin with an empty tree."
      ],
      [
        "add(3,7) visits 3 → 4 → 8",
        "Those three stored intervals contain position 3."
      ],
      [
        "prefix(6) visits 6 → 4 → 0 | sum = 7",
        "The queried blocks cover [1,6] without overlap."
      ]
    ],
    "misconception": "Updating index zero loops forever because lowbit(0)=0.",
    "debug": "A prefix query increases its index. Which direction was copied incorrectly?",
    "fill": "A prefix query moves from i to i __ lowbit(i).",
    "edgeCases": [
      "The empty prefix is zero.",
      "Include a negative update.",
      "Use 64-bit cumulative values."
    ],
    "revision": "Update climbs through covering blocks. Query moves backwards through disjoint blocks.",
    "further": "Compare a segment tree for minimum queries.",
    "quiz": {
      "question": "Which stored blocks does prefix(6) read?",
      "answers": [
        "6,5,4",
        "6,4",
        "6,8"
      ],
      "correct": 1,
      "feedback": "lowbit(6) is 2. Then lowbit(4) is 4, ending the query."
    },
    "practice": {
      "title": "Sum a changing sensor log",
      "description": "Maintain an initially zero array with additive updates and inclusive range sums.",
      "format": "Read n q and q operations: 1 i delta or 2 L R. Print each range sum.",
      "constraints": "1 ≤ n,q ≤ 400. Indexes are 1 through n. Deltas are between −10⁹ and 10⁹.",
      "input": "8 4\n1 3 7\n1 5 -2\n2 1 6\n2 5 8\n",
      "output": "5\n-2\n",
      "hints": [
        "Apply additive updates.",
        "Subtract two prefix sums.",
        "Use i & -i to step."
      ]
    },
    code:{
      c: `#include <stdio.h>

static long long tree[401];

static long long prefix(int i) {
    long long total = 0;
    for (; i > 0; i -= i & -i) total += tree[i];
    return total;
}

int main(void) {
    int n, q;
    if (scanf("%d%d", &n, &q) != 2) return 1;
    while (q--) {
        int type, x, y;
        if (scanf("%d%d%d", &type, &x, &y) != 3) return 1;
        if (type == 1) {
            for (; x <= n; x += x & -x) tree[x] += y;
        } else {
            printf("%lld\\n", prefix(y) - prefix(x-1));
        }
    }
    return 0;
}`,
      python: `n, q = map(int, input().split())
tree = [0] * (n + 1)

def prefix(i):
    total = 0
    while i:
        total += tree[i]
        i -= i & -i
    return total

for _ in range(q):
    kind, x, y = map(int, input().split())
    if kind == 1:
        while x <= n:
            tree[x] += y
            x += x & -x
    else:
        print(prefix(y) - prefix(x-1))`,
      java: `import java.util.Scanner;

public class Main {
    static long prefix(long[] tree, int i) {
        long total = 0;
        for (; i > 0; i -= i & -i) total += tree[i];
        return total;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        long[] tree = new long[n+1];
        while (q-- > 0) {
            int kind = in.nextInt(), x = in.nextInt(), y = in.nextInt();
            if (kind == 1) {
                for (; x <= n; x += x & -x) tree[x] += y;
            } else {
                System.out.println(prefix(tree,y) - prefix(tree,x-1));
            }
        }
    }
}`,
    },
  }
]);
