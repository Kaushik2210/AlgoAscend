import { defineTopics } from "./define.ts";

export const sequenceDp = defineTopics([
  {
    "id": "zero-one-knapsack",
    "stage": 9,
    "title": "0/1 knapsack and space optimization",
    "objective": "Select items within a weight limit while using each item at most once.",
    "prerequisites": "Tabulation and arrays.",
    "analogy": "A rescue kit has one of each tool. Each added tool improves some weight budgets, and any budget can use that tool only once.",
    "explanation": "Let best[c] hold the maximum value with total weight at most c after processing earlier items. For each item, update capacities in descending order. The take transition reads best[c−weight] from the earlier row because that smaller capacity has yet to be updated. The skip transition retains best[c]. This compresses a two-dimensional table to one row.",
    "invariant": "After processing an item, every entry is the maximum of excluding it and including it once with an optimal subset of previous items. Descending capacity preserves the previous-row value used by the take transition.",
    "pseudocode": "best[0..W] = 0\nfor each item with positive weight w and value v:\n  for c from W down to w:\n    best[c] = max(best[c], best[c−w]+v)\nreturn best[W]",
    "time": "O(nW) time for n items and capacity W",
    "space": "O(W) for the state. The Python program also buffers O(n) item tokens",
    "trace": [
      [
        "capacity=4, first item weight=2 value=3",
        "Start with all zero entries."
      ],
      [
        "best[4]=3, best[3]=3, best[2]=3",
        "Inspect capacity 4 before changing capacity 2, so the first item contributes once."
      ],
      [
        "Next item weight=2 value=5",
        "At capacity 4, read previous best[2]=3 and add 5."
      ],
      [
        "best[4]=8",
        "Taking both distinct items gives the maximum."
      ]
    ],
    "misconception": "Scanning capacities upward can reuse a newly updated state, effectively taking the same item more than once.",
    "debug": "One weight-two item of value three and capacity four must return three.",
    "fill": "Which direction ensures the source entry best[c−weight] still belongs to the previous item row?",
    "edgeCases": [
      "Capacity zero gives zero under positive weights.",
      "A heavier-than-capacity item changes no state.",
      "Two items with identical weights and values remain distinct items."
    ],
    "revision": "How would the loop direction change for unbounded copies?",
    "further": "Keep the full table to reconstruct one optimal set of chosen items.",
    "quiz": {
      "question": "Why iterate downward over capacities?",
      "answers": [
        "To place heavy items first",
        "To read the previous row at smaller capacities",
        "To skip the zero-capacity state"
      ],
      "correct": 1,
      "feedback": "Smaller entries have not yet been overwritten for the current item."
    },
    "practice": {
      "title": "Choose the emergency kit",
      "description": "Choose distinct supplies to maximize total usefulness within a weight limit.",
      "format": "Read n and capacity. Then read n weight/value pairs. Print the maximum value achievable.",
      "constraints": "0 ≤ n ≤ 300, 0 ≤ capacity ≤ 400, 1 ≤ weight ≤ 1000 and 0 ≤ value ≤ 10⁶.",
      "input": "2 4\n2 3\n2 5\n",
      "output": "8\n",
      "hints": [
        "Update the one-dimensional table from larger capacities to smaller ones.",
        "Skipping an item preserves the current value."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, limit, best[401] = {0};
    if (scanf("%d%d", &n, &limit) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int weight, value;
        scanf("%d%d", &weight, &value);
        for (int c = limit; c >= weight; c--) {
            int take = best[c - weight] + value;
            if (take > best[c]) best[c] = take;
        }
    }
    printf("%d\\n", best[limit]);
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, limit = next(tokens), next(tokens)
best = [0] * (limit + 1)
for _ in range(n):
    weight, value = next(tokens), next(tokens)
    for c in range(limit, weight - 1, -1):
        best[c] = max(best[c], best[c - weight] + value)
print(best[limit])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), limit = in.nextInt();
        int[] best = new int[limit + 1];
        for (int i = 0; i < n; i++) {
            int weight = in.nextInt(), value = in.nextInt();
            for (int c = limit; c >= weight; c--) {
                best[c] = Math.max(best[c], best[c - weight] + value);
            }
        }
        System.out.println(best[limit]);
    }
}`,
    },
  },
  {
    "id": "edit-distance",
    "stage": 9,
    "title": "Edit distance",
    "objective": "Compute the minimum number of single-character edits needed to transform one string into another.",
    "prerequisites": "Prefix-based dynamic programming and nested loops.",
    "analogy": "A typesetter can erase, insert, or replace one letter at a time. Find the cheapest sequence of changes.",
    "explanation": "Let distance[i][j] be the minimum edits to transform the first i letters into the first j. Delete the last source letter from the above state, insert the last target letter from the left state, or align the final letters from the diagonal state, charging one if they differ. The empty-prefix border counts insertions or deletions.",
    "invariant": "Each alignment of two prefixes ends in a deletion, insertion, or a match/replacement. Removing that final action yields the corresponding shorter-prefix alignment and taking the lowest total yields an optimum.",
    "pseudocode": "distance[i][0] = i; distance[0][j] = j\nfor positive i,j in row-major order:\n  cost = 0 if a[i−1] == b[j−1] else 1\n  distance[i][j] = min(above+1, left+1, diagonal+cost)\nprint distance[n][m]",
    "time": "O(nm+n+m) time",
    "space": "O((n+1)(m+1)) for the table",
    "trace": [
      [
        "Source cat | target cut",
        "Initialize the empty-prefix borders with edit counts 0, 1, 2, 3."
      ],
      [
        "c → c costs 0",
        "A matching first letter extends the empty diagonal with no charge."
      ],
      [
        "ca → cu costs 1",
        "The best diagonal transition replaces a with u."
      ],
      [
        "cat → cut costs 1",
        "Matching t extends the previous cost without an additional edit."
      ]
    ],
    "misconception": "Adjacent transposition is a different edit rule. It is excluded from this exercise.",
    "debug": "Try ab versus ba. The expected answer is two under insert/delete/replace rules.",
    "fill": "Which predecessor corresponds to replacing the final source letter?",
    "edgeCases": [
      "An empty string is a valid input line.",
      "Identical strings have distance zero.",
      "Transforming an empty string requires one insertion per target character."
    ],
    "revision": "How does each table border correspond to a sequence of edits?",
    "further": "Trace back the optimal edits and then keep only two rows when you need just their count.",
    "quiz": {
      "question": "What is the edit distance from cat to cut?",
      "answers": [
        "0",
        "1",
        "2"
      ],
      "correct": 1,
      "feedback": "Replace a with u. Both remaining letters already match."
    },
    "practice": {
      "title": "Repair a text label",
      "description": "Compute the fewest insertions, deletions, and replacements to transform one label into another.",
      "format": "Read two lines, each containing zero or more lowercase ASCII letters. Print the minimum edit count.",
      "constraints": "Each line contains at most 150 letters.",
      "input": "cat\ncut\n",
      "output": "1\n",
      "hints": [
        "Initialize borders as transformations to or from an empty string.",
        "Try all three possible final alignment actions."
      ]
    },
    code:{
      c: `#include <stdio.h>
#include <string.h>
int main(void) {
    char a[154], b[154];
    if (!fgets(a, sizeof a, stdin) || !fgets(b, sizeof b, stdin)) return 0;
    int n = (int)strcspn(a, "\\r\\n"), m = (int)strcspn(b, "\\r\\n");
    int dp[151][151];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            int deletion = dp[i - 1][j] + 1, insertion = dp[i][j - 1] + 1;
            int diagonal = dp[i - 1][j - 1] + (a[i - 1] != b[j - 1]);
            int best = deletion < insertion ? deletion : insertion;
            dp[i][j] = diagonal < best ? diagonal : best;
        }
    }
    printf("%d\\n", dp[n][m]);
    return 0;
}`,
      python: `a, b = input(), input()
dp = [list(range(len(b) + 1))]
for i, first in enumerate(a, 1):
    row = [i]
    for j, second in enumerate(b, 1):
        row.append(min(dp[-1][j] + 1, row[-1] + 1, dp[-1][j - 1] + (first != second)))
    dp.append(row)
print(dp[-1][-1])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        String a = in.nextLine(), b = in.nextLine();
        int n = a.length(), m = b.length();
        int[][] dp = new int[n + 1][m + 1];
        for (int i = 0; i <= n; i++) dp[i][0] = i;
        for (int j = 0; j <= m; j++) dp[0][j] = j;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                dp[i][j] = Math.min(dp[i - 1][j - 1] + cost, 1 + Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
        System.out.println(dp[n][m]);
    }
}`,
    },
  }
]);
