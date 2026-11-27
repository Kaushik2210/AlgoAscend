import { defineTopics } from "./define.ts";

export const graphAndDp = defineTopics([
  {
    "id": "disjoint-set-union",
    "stage": 6,
    "title": "Disjoint set union",
    "objective": "Answer whether two nodes belong to the same group as connections are added.",
    "prerequisites": "Arrays, trees and connected components.",
    "analogy": "Every club has a leader. When two clubs merge, the smaller club's leader reports to the larger club's leader.",
    "explanation": "Each node stores a parent. Follow parents to reach a root. During find, point visited nodes closer to the root. To merge separate sets, attach the smaller root to the larger root and update its size.",
    "invariant": "Two nodes are connected exactly when their parent chains end at the same root. A union of different roots merges exactly their two components because it changes only one root's parent.",
    "pseudocode": "find(x): shorten the parent chain while walking to its root\nmerge(a, b):\n  a, b = find(a), find(b)\n  if a == b: return\n  make smaller root a child of larger root\n  update size at the surviving root",
    "time": "O(n + q α(n)) time for n nodes and q operations, where the inverse Ackermann function α grows extremely slowly",
    "space": "O(n) for parents and sizes. The Python version also buffers O(q) tokens",
    "trace": [
      [
        "{0}, {1}, {2}, {3}",
        "Start with one component for each node."
      ],
      [
        "{0, 2}, {1}, {3}",
        "Join 0 with 2. They now have the same root."
      ],
      [
        "{0, 2}, {1, 3}",
        "Join 1 with 3. A query for 2 and 3 still answers NO."
      ],
      [
        "{0, 1, 2, 3}",
        "Join 2 with 3. A query for 0 and 1 now answers YES."
      ]
    ],
    "misconception": "Setting parent[a] directly can move only part of a component. Find both roots before a union.",
    "debug": "Join 0 with 1 and 2 with 3, then join 1 with 3. Verify that every pair now has the same root.",
    "fill": "Which two roots should have their sizes compared?",
    "edgeCases": [
      "A node is always connected to itself.",
      "Repeated unions leave both component size and connectivity unchanged.",
      "Queries before any unions see isolated nodes."
    ],
    "revision": "Why must a link operation attach one root to another root?",
    "further": "Maintain the number of connected components as a separate counter.",
    "quiz": {
      "question": "When should a union update the root size?",
      "answers": [
        "Whenever the original node labels differ",
        "Only when the roots differ",
        "Only when the components have equal size"
      ],
      "correct": 1,
      "feedback": "Equal roots already represent a single component. Counting it again would inflate its size."
    },
    "practice": {
      "title": "Radio relays",
      "description": "Add permanent links between radio relays and answer reachability queries as they arrive.",
      "format": "Read n q. Each of the next q lines is type a b for zero-based relays. Type 1 adds a link and type 2 prints YES or NO.",
      "constraints": "1 ≤ n ≤ 500, 0 ≤ q ≤ 400, type ∈ {1,2}, and 0 ≤ a,b < n.",
      "input": "4 6\n1 0 2\n1 1 3\n2 2 3\n1 2 3\n2 0 1\n2 3 3\n",
      "output": "NO\nYES\nYES\n",
      "hints": [
        "Store a parent and a size for each root.",
        "Check root equality before changing sizes."
      ]
    },
    code:{
      c: `#include <stdio.h>
static int parent[500], count[500];
static int find(int node) {
    while (node != parent[node]) {
        parent[node] = parent[parent[node]];
        node = parent[node];
    }
    return node;
}
int main(void) {
    int n, q;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) { parent[i] = i; count[i] = 1; }
    for (int i = 0; i < q; i++) {
        int type, a, b;
        scanf("%d%d%d", &type, &a, &b);
        a = find(a);
        b = find(b);
        if (type == 2) {
            puts(a == b ? "YES" : "NO");
        } else if (a != b) {
            if (count[a] < count[b]) { int swap = a; a = b; b = swap; }
            parent[b] = a;
            count[a] += count[b];
        }
    }
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
parent = list(range(n))
size = [1] * n

def find(node):
    while parent[node] != node:
        parent[node] = parent[parent[node]]
        node = parent[node]
    return node

for _ in range(q):
    kind, a, b = next(tokens), find(next(tokens)), find(next(tokens))
    if kind == 2:
        print("YES" if a == b else "NO")
    elif a != b:
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]`,
      java: `import java.util.Scanner;
class Main {
    static int[] parent;
    static int find(int node) {
        while (parent[node] != node) {
            parent[node] = parent[parent[node]];
            node = parent[node];
        }
        return node;
    }
    public static void main(String[] args) {
        var input = new Scanner(System.in);
        int n = input.nextInt(), q = input.nextInt();
        parent = new int[n];
        int[] size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        for (int i = 0; i < q; i++) {
            int type = input.nextInt(), a = find(input.nextInt()), b = find(input.nextInt());
            if (type == 2) {
                System.out.println(a == b ? "YES" : "NO");
            } else if (a != b) {
                if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
                parent[b] = a;
                size[a] += size[b];
            }
        }
    }
}`,
    },
  },
  {
    "id": "longest-common-subsequence",
    "stage": 9,
    "title": "Longest common subsequence",
    "objective": "Find the longest ordered sequence shared by two strings using a prefix table.",
    "prerequisites": "Strings, two-dimensional arrays and tabulation.",
    "analogy": "Two music playlists can share a sequence of tracks even if each has unrelated tracks between the shared ones.",
    "explanation": "Let dp[i][j] hold the answer for the first i and j characters. Matching final characters let an optimal sequence extend the diagonal state by one. If the final characters differ, an optimal solution skips at least one of them, so choose the larger adjacent state.",
    "invariant": "Every cell depends only on strictly shorter prefixes. Equal final characters can end a longest common subsequence because any earlier matching copy can move to the final position without changing the length. Unequal final characters cannot both be the final match.",
    "pseudocode": "start with a zero row and column\nfor each i from 1 to n:\n  for each j from 1 to m:\n    if a[i−1] == b[j−1]: dp[i][j] = 1 + dp[i−1][j−1]\n    else: dp[i][j] = max(dp[i−1][j], dp[i][j−1])\nreturn dp[n][m]",
    "time": "O(nm) time for strings of lengths n and m",
    "space": "O(nm) for the table",
    "trace": [
      [
        "dp[0][*] = dp[*][0] = 0",
        "An empty prefix has no characters to match."
      ],
      [
        "A = A → 1",
        "For A and A, extend the empty diagonal."
      ],
      [
        "AB vs AC → 1",
        "The unequal final characters give the larger of the adjacent states."
      ],
      [
        "ABC vs AC → 2",
        "Match the two final Cs after the shared A. The subsequence AC has length 2."
      ]
    ],
    "misconception": "A subsequence may skip characters. A substring must occupy contiguous positions.",
    "debug": "Compare AXBYC with ABC. An answer of 1 suggests substring logic or a reset at mismatches.",
    "fill": "Complete the match transition: 1 + dp[___][___].",
    "edgeCases": [
      "No shared character yields zero.",
      "Identical strings yield their full length.",
      "Repeated letters can lead to multiple equally long sequences."
    ],
    "revision": "Which two states should a mismatch compare?",
    "further": "Reconstruct one longest subsequence by walking backwards through the table. Then try keeping only two rows when you need just the length.",
    "quiz": {
      "question": "What is the longest common subsequence length of ABC and AC?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 1,
      "feedback": "AC appears in both strings in order. Skipping B is allowed."
    },
    "practice": {
      "title": "Playlist overlap",
      "description": "Find the maximum number of track codes appearing in the same order in two playlists.",
      "format": "Read two nonempty lowercase strings. Print their longest common subsequence length.",
      "constraints": "Each string has from 1 through 200 ASCII lowercase letters.",
      "input": "abc ac\n",
      "output": "2\n",
      "hints": [
        "Use the first i and first j characters as the state.",
        "A mismatch can skip a character from either playlist."
      ]
    },
    code:{
      c: `#include <stdio.h>
#include <string.h>
static int dp[201][201];
int main(void) {
    char a[201], b[201];
    if (scanf("%200s%200s", a, b) != 2) return 0;
    int n = (int)strlen(a), m = (int)strlen(b);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            int above = dp[i - 1][j], left = dp[i][j - 1];
            dp[i][j] = a[i - 1] == b[j - 1] ? 1 + dp[i - 1][j - 1] : (above > left ? above : left);
        }
    }
    printf("%d\\n", dp[n][m]);
    return 0;
}`,
      python: `import sys
a, b = sys.stdin.read().split()
dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
for i, first in enumerate(a, 1):
    for j, second in enumerate(b, 1):
        if first == second:
            dp[i][j] = 1 + dp[i - 1][j - 1]
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
print(dp[-1][-1])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var input = new Scanner(System.in);
        String a = input.next(), b = input.next();
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                    ? 1 + dp[i - 1][j - 1]
                    : Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
        System.out.println(dp[a.length()][b.length()]);
    }
}`,
    },
  }
]);
