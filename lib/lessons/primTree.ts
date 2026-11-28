import { defineTopics } from "./define.ts";

export const primTree = defineTopics([
  {
    "id": "prim-spanning-tree",
    "stage": 6,
    "title": "Prim’s algorithm and the cut property",
    "objective": "Grow a minimum spanning tree by choosing the cheapest edge leaving the current tree.",
    "prerequisites": "Undirected graphs, adjacency matrices, and minimum spanning trees.",
    "analogy": "Start at one station and extend its network using the cheapest wire to any station still offline.",
    "explanation": "Begin with vertex zero. For each outside vertex, keep the cheapest edge that connects it to a vertex already in the tree. Choose the outside vertex with the cheapest connection, add its edge, and update connections using its incident edges. The chosen edge is lightest across the current cut, so it can belong to an optimum. A missing finite connection means the graph is disconnected.",
    "invariant": "For every outside vertex, its key is the least weight among edges from the current tree to that vertex. The selected edges extend to some minimum spanning tree by the cut property.",
    "pseudocode": "key[0]=0 and other keys=infinity\nrepeat n times:\n  choose the unused vertex u with smallest key\n  if key is infinity: report DISCONNECTED\n  take u, add its key, and minimize outside keys using edges from u\nreturn total",
    "time": "O(n² + m) with the matrix and linear selection shown",
    "space": "O(n²) for the matrix and O(n) for the keys",
    "trace": [
      [
        "Edges 0—1 (5), 0—2 (4), 1—2 (1)",
        "Start at vertex 0 with key zero."
      ],
      [
        "Keys after adding 0: 1→5, 2→4",
        "Take 2 via the cheapest edge leaving the current tree."
      ],
      [
        "Keys after adding 2: 1→1",
        "The direct connection from 2 to 1 is cheaper."
      ],
      [
        "Add 1, total 4+1=5",
        "All vertices are connected. The last key is an edge weight, not a route distance."
      ]
    ],
    "misconception": "A Prim key is the cost of one connecting edge. It does not add the cost of reaching the already selected endpoint like a Dijkstra relaxation.",
    "debug": "Use a triangle with weights 5, 4, and 1 so an outside key improves after the second vertex is added.",
    "fill": "What should happen when all unused vertices still have an infinite key?",
    "edgeCases": [
      "One vertex needs no edges.",
      "Use the minimum weight of parallel edges.",
      "Negative edge weights remain valid because the cut rule compares edge weights."
    ],
    "revision": "How do Prim and Kruskal choose their next edge differently?",
    "further": "Replace the matrix and minimum scan with adjacency lists and a priority queue.",
    "quiz": {
      "question": "A new tree vertex offers an edge of weight 2 to an outside vertex with key 5. What is its new key?",
      "answers": [
        "2",
        "5",
        "7"
      ],
      "correct": 0,
      "feedback": "The key stores the cheapest single connecting edge, so it improves to 2."
    },
    "practice": {
      "title": "Extend the fiber network",
      "description": "Grow a minimum spanning tree of the undirected fiber options, or report disconnection.",
      "format": "Read n m, then m undirected edges u v w. Print the total minimum spanning tree weight or DISCONNECTED.",
      "constraints": "1 ≤ n ≤ 120, 0 ≤ m ≤ 400, vertices are zero-based, and |weight| ≤ 10⁶.",
      "input": "3 3\n0 1 5\n0 2 4\n1 2 1\n",
      "output": "5\n",
      "hints": [
        "Track the cheapest single edge from the tree to each outside vertex.",
        "Use vertex zero’s key as the zero cost of starting."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define INF 1000000000
static int w[120][120], key[120], used[120];
int main(void) {
    int n, m, total = 0;
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int u = 0; u < n; u++) {
        key[u] = INF;
        for (int v = 0; v < n; v++) w[u][v] = INF;
    }
    for (int i = 0; i < m; i++) {
        int u, v, weight;
        scanf("%d%d%d", &u, &v, &weight);
        if (weight < w[u][v]) w[u][v] = w[v][u] = weight;
    }
    key[0] = 0;
    for (int i = 0; i < n; i++) {
        int u = -1;
        for (int v = 0; v < n; v++) if (!used[v] && (u < 0 || key[v] < key[u])) u = v;
        if (key[u] == INF) { puts("DISCONNECTED"); return 0; }
        total += key[u];
        used[u] = 1;
        for (int v = 0; v < n; v++) if (!used[v] && w[u][v] < key[v]) key[v] = w[u][v];
    }
    printf("%d\\n", total);
    return 0;
}`,
      python: `n, m = map(int, input().split())
inf = float("inf")
weights = [[inf] * n for _ in range(n)]
for _ in range(m):
    u, v, weight = map(int, input().split())
    weights[u][v] = weights[v][u] = min(weights[u][v], weight)
key, used = [inf] * n, [False] * n
key[0] = total = 0
for _ in range(n):
    u = min((v for v in range(n) if not used[v]), key=key.__getitem__)
    if key[u] == inf:
        print("DISCONNECTED")
        break
    total += key[u]
    used[u] = True
    for v, weight in enumerate(weights[u]):
        if not used[v]:
            key[v] = min(key[v], weight)
else:
    print(total)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), inf = 1_000_000_000, total = 0;
        int[][] weights = new int[n][n];
        for (int[] row : weights) Arrays.fill(row, inf);
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt(), weight = in.nextInt();
            weights[u][v] = weights[v][u] = Math.min(weights[u][v], weight);
        }
        int[] key = new int[n];
        boolean[] used = new boolean[n];
        Arrays.fill(key, inf);
        key[0] = 0;
        for (int i = 0; i < n; i++) {
            int u = -1;
            for (int v = 0; v < n; v++) if (!used[v] && (u < 0 || key[v] < key[u])) u = v;
            if (key[u] == inf) { System.out.println("DISCONNECTED"); return; }
            total += key[u];
            used[u] = true;
            for (int v = 0; v < n; v++) if (!used[v]) key[v] = Math.min(key[v], weights[u][v]);
        }
        System.out.println(total);
    }
}`,
    },
  }
]);
