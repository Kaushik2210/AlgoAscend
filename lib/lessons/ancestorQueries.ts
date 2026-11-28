import { defineTopics } from "./define.ts";

export const ancestorQueries = defineTopics([
  {
    "id": "lowest-common-ancestor",
    "stage": 5,
    "title": "Lowest common ancestors and binary lifting",
    "objective": "Answer ancestor queries by jumping up a rooted tree in powers of two.",
    "prerequisites": "Rooted trees, depths and binary representation.",
    "analogy": "Use express elevators that climb 1, 2, 4, or more levels. Bring two people to the same height, then move both up as far as possible while keeping them on different branches.",
    "explanation": "Store up[j][v], the ancestor 2ʲ steps above v. Compose two half-jumps to build each row. For a query, raise the deeper vertex to match depths. If the vertices now coincide, that vertex is the answer. Otherwise scan jump lengths from largest to smallest and raise both whenever the resulting ancestors differ. They finish as children of their lowest common ancestor.",
    "invariant": "Once the depths match, any jump that leaves the vertices distinct stays below the lowest common ancestor. Rejecting jumps to equal ancestors preserves the distinction until a one-step climb reaches the answer.",
    "pseudocode": "up[0][v] = parent[v]\nup[j][v] = up[j−1][up[j−1][v]]\nraise the deeper vertex using the bits of the depth difference\nif vertices match: return it\nfor j from largest down to zero:\n  if up[j][a] differs from up[j][b]: raise both by 2^j\nreturn up[0][a]",
    "time": "O(n log(n+1)) preprocessing and O(log(n+1)) per query",
    "space": "O(n log(n+1)) for ancestors. The Python program also buffers query tokens",
    "trace": [
      [
        "parents: 0→0, 1→0, 2→0, 3→1, 4→3",
        "Root 0 is its own stored ancestor."
      ],
      [
        "Query (4,2), depths 3 and 1",
        "Raise vertex 4 by two edges. It becomes vertex 1."
      ],
      [
        "Vertices 1 and 2",
        "Their parents already agree. Any jump to the root would merge them."
      ],
      [
        "Return parent(1)=0",
        "Vertex 0 is the lowest common ancestor. For query (4,1), depth alignment would already find 1."
      ]
    ],
    "misconception": "Jumping both vertices up before equalizing their depths can return an ancestor too high or stop before finding a shared vertex.",
    "debug": "Query a vertex with its own ancestor and then a pair from different branches.",
    "fill": "Which two entries combine to compute a four-edge ancestor from two-edge jumps?",
    "edgeCases": [
      "A vertex is its own lowest common ancestor.",
      "The root can be the answer and is its own stored parent.",
      "The guarantee that parent IDs precede child IDs allows depths to be computed in input order."
    ],
    "revision": "When should the algorithm return immediately after lifting the deeper vertex?",
    "further": "Use depths and the lowest common ancestor to compute the path length between two nodes.",
    "quiz": {
      "question": "What is the lowest common ancestor of vertex 4 and its ancestor 1?",
      "answers": [
        "0",
        "1",
        "4"
      ],
      "correct": 1,
      "feedback": "A vertex is an ancestor of itself. Vertex 1 is the deepest ancestor shared by 4 and 1."
    },
    "practice": {
      "title": "Find the nearest shared supervisor",
      "description": "For each pair, find their deepest common supervisor, including a vertex itself when it is an ancestor of the other.",
      "format": "Read n q. Read parents of vertices 1 through n−1 in order. Then read q pairs a b and print one zero-based ancestor per line.",
      "constraints": "1 ≤ n ≤ 300, 0 ≤ q ≤ 300. Every parent of i is from 0 through i−1. Query vertices are from 0 through n−1.",
      "input": "5 3\n0 0 1 3\n4 2\n4 1\n3 4\n",
      "output": "0\n1\n3\n",
      "hints": [
        "Store the root as its own parent.",
        "Lift the deepest vertex first and check whether the vertices now coincide."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int up[9][300], depth[300];
static int lca(int a, int b, int levels) {
    if (depth[a] < depth[b]) { int swap = a; a = b; b = swap; }
    int difference = depth[a] - depth[b];
    for (int j = 0; j < levels; j++) if (difference & (1 << j)) a = up[j][a];
    if (a == b) return a;
    for (int j = levels - 1; j >= 0; j--) {
        if (up[j][a] != up[j][b]) { a = up[j][a]; b = up[j][b]; }
    }
    return up[0][a];
}
int main(void) {
    int n, q, levels = 1;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    while ((1 << levels) <= n) levels++;
    for (int i = 1; i < n; i++) {
        scanf("%d", &up[0][i]);
        depth[i] = depth[up[0][i]] + 1;
    }
    for (int j = 1; j < levels; j++) {
        for (int v = 0; v < n; v++) up[j][v] = up[j - 1][up[j - 1][v]];
    }
    for (int i = 0; i < q; i++) {
        int a, b;
        scanf("%d%d", &a, &b);
        printf("%d\\n", lca(a, b, levels));
    }
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
depth = [0] * n
up = [[0] + [next(tokens) for _ in range(n - 1)]]
for vertex in range(1, n):
    depth[vertex] = depth[up[0][vertex]] + 1
levels = n.bit_length()
for _ in range(1, levels):
    previous = up[-1]
    up.append([previous[parent] for parent in previous])

def lca(a, b):
    if depth[a] < depth[b]:
        a, b = b, a
    difference = depth[a] - depth[b]
    for j in range(levels):
        if difference & (1 << j):
            a = up[j][a]
    if a == b:
        return a
    for j in range(levels - 1, -1, -1):
        if up[j][a] != up[j][b]:
            a, b = up[j][a], up[j][b]
    return up[0][a]

for _ in range(q):
    print(lca(next(tokens), next(tokens)))`,
      java: `import java.util.Scanner;
class Main {
    static int[][] up;
    static int[] depth;
    static int lca(int a, int b) {
        if (depth[a] < depth[b]) { int swap = a; a = b; b = swap; }
        int difference = depth[a] - depth[b];
        for (int j = 0; j < up.length; j++) if ((difference & (1 << j)) != 0) a = up[j][a];
        if (a == b) return a;
        for (int j = up.length - 1; j >= 0; j--) {
            if (up[j][a] != up[j][b]) { a = up[j][a]; b = up[j][b]; }
        }
        return up[0][a];
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), levels = 1;
        while ((1 << levels) <= n) levels++;
        up = new int[levels][n];
        depth = new int[n];
        for (int i = 1; i < n; i++) {
            up[0][i] = in.nextInt();
            depth[i] = depth[up[0][i]] + 1;
        }
        for (int j = 1; j < levels; j++) {
            for (int v = 0; v < n; v++) up[j][v] = up[j - 1][up[j - 1][v]];
        }
        for (int i = 0; i < q; i++) System.out.println(lca(in.nextInt(), in.nextInt()));
    }
}`,
    },
  }
]);
