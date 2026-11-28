import { defineTopics } from "./define.ts";

export const negativePaths = defineTopics([
  {
    "id": "bellman-ford",
    "stage": 6,
    "title": "Bellman–Ford and reachable negative cycles",
    "objective": "Find single-source shortest paths with negative edges and detect reachable negative cycles.",
    "prerequisites": "Directed graphs, weighted paths and relaxation.",
    "analogy": "Each sweep through the road list gives every recorded route a chance to extend by one road. A reachable discount loop can keep reducing the price indefinitely.",
    "explanation": "Start with distance zero at the source and infinity elsewhere. Repeatedly relax every directed edge from a reachable vertex. With no reachable negative cycle, an optimal path can avoid repeated vertices and has at most n−1 edges. One more sweep tests for a reachable negative cycle.",
    "invariant": "Every finite entry is the cost of a real walk. After k full sweeps the entry is at most the cost of every walk using at most k edges. After n−1 sweeps this gives exact finite shortest distances if no reachable negative cycle exists.",
    "pseudocode": "distance[source] = 0\nrepeat n times:\n  for edge u→v with weight w:\n    if u is reachable and distance[u]+w < distance[v]:\n      update distance[v]\n      record that this sweep changed something\n  if nothing changed: stop\nif sweep n changed a distance: report NEGATIVE CYCLE",
    "time": "O(nm+n) worst case for n vertices and m edges",
    "space": "O(n+m) for distances and the edge list",
    "trace": [
      [
        "Edges 1→2 (−4), 0→1 (3), 0→2 (5)",
        "Source 0 starts at zero. The other distances are infinite."
      ],
      [
        "After sweep 1 → [0,3,5]",
        "Edge 1→2 was considered before 1 became reachable."
      ],
      [
        "After sweep 2 → [0,3,−1]",
        "The path via 1 costs 3−4 and improves vertex 2."
      ],
      [
        "Sweep 3 records no change",
        "The distances are final. If another improvement were possible on sweep 3, a reachable negative cycle would exist."
      ]
    ],
    "misconception": "A negative edge alone does not imply a negative cycle. An unreachable negative cycle cannot affect the source traversal.",
    "debug": "Try separate reachable and unreachable negative loops. Only the reachable one changes the answer to NEGATIVE CYCLE.",
    "fill": "Which guard prevents relaxing from a vertex that the source cannot reach?",
    "edgeCases": [
      "Zero edges leave only the source reachable.",
      "A reachable negative self-loop is a negative cycle.",
      "Parallel edges are valid."
    ],
    "revision": "Why are n−1 edges enough when an optimal path can omit cycles?",
    "further": "Mark which destinations are affected by a reachable negative cycle instead of reporting one global status.",
    "quiz": {
      "question": "Which observation proves a reachable negative cycle?",
      "answers": [
        "A negative edge exists",
        "A reachable distance improves on sweep n",
        "Some distance remains infinite"
      ],
      "correct": 1,
      "feedback": "Without a reachable negative cycle, every finite optimum has already been found after n−1 full sweeps."
    },
    "practice": {
      "title": "Price the directed routes",
      "description": "Report the source distances, or report a reachable negative cycle.",
      "format": "Read n m source, then m lines u v weight. Print n distances in vertex order, using INF for unreachable vertices. Print NEGATIVE CYCLE instead if any negative cycle is reachable.",
      "constraints": "1 ≤ n ≤ 120, 0 ≤ m ≤ 400, 0 ≤ u,v,source < n, and |weight| ≤ 10³.",
      "input": "3 3 0\n1 2 -4\n0 1 3\n0 2 5\n",
      "output": "0 3 -1\n",
      "hints": [
        "Only relax an edge when its start is reachable.",
        "Use a final extra sweep after the usual n−1 sweeps."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define INF 1000000000
typedef struct { int u, v, weight; } Edge;
int main(void) {
    int n, m, source, distance[120];
    Edge edges[400];
    if (scanf("%d%d%d", &n, &m, &source) != 3) return 0;
    for (int i = 0; i < m; i++) scanf("%d%d%d", &edges[i].u, &edges[i].v, &edges[i].weight);
    for (int i = 0; i < n; i++) distance[i] = INF;
    distance[source] = 0;
    for (int sweep = 0; sweep < n; sweep++) {
        int changed = 0;
        for (int i = 0; i < m; i++) {
            Edge edge = edges[i];
            if (distance[edge.u] != INF && distance[edge.u] + edge.weight < distance[edge.v]) {
                distance[edge.v] = distance[edge.u] + edge.weight;
                changed = 1;
            }
        }
        if (!changed) break;
        if (sweep == n - 1) { puts("NEGATIVE CYCLE"); return 0; }
    }
    for (int v = 0; v < n; v++) {
        if (v > 0) putchar(' ');
        if (distance[v] == INF) printf("INF");
        else printf("%d", distance[v]);
    }
    puts("");
    return 0;
}`,
      python: `n, m, source = map(int, input().split())
edges = [tuple(map(int, input().split())) for _ in range(m)]
inf = float("inf")
distance = [inf] * n
distance[source] = 0
negative_cycle = False
for sweep in range(n):
    changed = False
    for u, v, weight in edges:
        if distance[u] != inf and distance[u] + weight < distance[v]:
            distance[v] = distance[u] + weight
            changed = True
    if not changed:
        break
    negative_cycle = sweep == n - 1
if negative_cycle:
    print("NEGATIVE CYCLE")
else:
    print(*("INF" if value == inf else value for value in distance))`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    record Edge(int u, int v, int weight) {}
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), source = in.nextInt(), inf = 1_000_000_000;
        Edge[] edges = new Edge[m];
        for (int i = 0; i < m; i++) edges[i] = new Edge(in.nextInt(), in.nextInt(), in.nextInt());
        int[] distance = new int[n];
        Arrays.fill(distance, inf);
        distance[source] = 0;
        for (int sweep = 0; sweep < n; sweep++) {
            boolean changed = false;
            for (Edge edge : edges) {
                if (distance[edge.u()] != inf && distance[edge.u()] + edge.weight() < distance[edge.v()]) {
                    distance[edge.v()] = distance[edge.u()] + edge.weight();
                    changed = true;
                }
            }
            if (!changed) break;
            if (sweep == n - 1) { System.out.println("NEGATIVE CYCLE"); return; }
        }
        var output = new StringBuilder();
        for (int v = 0; v < n; v++) {
            if (v > 0) output.append(' ');
            if (distance[v] == inf) output.append("INF");
            else output.append(distance[v]);
        }
        System.out.println(output);
    }
}`,
    },
  },
  {
    "id": "floyd-warshall",
    "stage": 6,
    "title": "Floyd–Warshall and all-pairs shortest paths",
    "objective": "Answer many shortest-path queries after allowing each possible intermediate vertex in turn.",
    "prerequisites": "Weighted graphs, adjacency matrices and dynamic programming.",
    "analogy": "Open one transfer station at a time. Every route can keep its old price or try going through the new station.",
    "explanation": "Initialize the diagonal to zero, direct edges to their minimum weights, and absent pairs to infinity. For each intermediate k, try routing every ordered pair i,j through k. Put k in the outer loop. The exercise permits negative edges but guarantees no negative cycles, so adding k cannot make its own diagonal negative.",
    "invariant": "After finishing phase k, the matrix holds minimum path costs using only vertices 0 through k as intermediate vertices. A path newly allowed in this phase can be split at k into two previously allowed paths.",
    "pseudocode": "initialize distances from direct edges and empty paths\nfor k in vertices:\n  for i in vertices:\n    for j in vertices:\n      if both legs exist: d[i][j]=min(d[i][j],d[i][k]+d[k][j])\nanswer queries from d",
    "time": "O(n³+m+q) for n vertices, m edges and q queries",
    "space": "O(n²) for the distance matrix",
    "trace": [
      [
        "Edges 0→1 (4), 1→2 (−2), 0→2 (7)",
        "The direct distance from 0 to 2 starts at 7."
      ],
      [
        "Allow intermediate 0",
        "No path to vertex 0 improves another pair."
      ],
      [
        "Allow intermediate 1",
        "0→1→2 costs 2, improving the distance 0→2."
      ],
      [
        "Allow intermediate 2",
        "No new improvement occurs. There is still no route from 2 to 0."
      ]
    ],
    "misconception": "Looping over the endpoints before the intermediate vertex can use incomplete phase information.",
    "debug": "Test two parallel edges and a reverse-direction unreachable query.",
    "fill": "Which index belongs in the outer loop?",
    "edgeCases": [
      "Self-distance is zero under the no-negative-cycle guarantee.",
      "Keep the minimum of parallel edge weights.",
      "Never add an absent leg to a finite cost."
    ],
    "revision": "What vertices may appear inside a path at the end of phase k?",
    "further": "Store next-hop information to reconstruct a route, then compare with running Dijkstra from every source when all weights are nonnegative.",
    "quiz": {
      "question": "If d[0][1]=4 and d[1][2]=−2, what candidate does phase 1 offer for d[0][2]?",
      "answers": [
        "−6",
        "2",
        "6"
      ],
      "correct": 1,
      "feedback": "The new route concatenates the two legs and costs 4 + (−2) = 2."
    },
    "practice": {
      "title": "Answer archive route costs",
      "description": "Precompute directed shortest paths and answer the requested route costs.",
      "format": "Read n m q, then m edges u v weight, then q query pairs a b. Print one minimum cost per query or INF.",
      "constraints": "1 ≤ n ≤ 60, 0 ≤ m,q ≤ 250, |weight| ≤ 10³, and no negative cycles exist. Vertices are zero-based.",
      "input": "3 3 3\n0 1 4\n1 2 -2\n0 2 7\n0 2\n2 0\n1 1\n",
      "output": "2\nINF\n0\n",
      "hints": [
        "Try intermediate vertices one at a time.",
        "Initialize the zero-edge path from each vertex to itself."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define INF 1000000000
static int d[60][60];
int main(void) {
    int n, m, q;
    if (scanf("%d%d%d", &n, &m, &q) != 3) return 0;
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) d[i][j] = i == j ? 0 : INF;
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d%d%d", &u, &v, &w);
        if (w < d[u][v]) d[u][v] = w;
    }
    for (int k = 0; k < n; k++) for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) {
        if (d[i][k] != INF && d[k][j] != INF && d[i][k] + d[k][j] < d[i][j]) {
            d[i][j] = d[i][k] + d[k][j];
        }
    }
    for (int i = 0; i < q; i++) {
        int a, b;
        scanf("%d%d", &a, &b);
        if (d[a][b] == INF) puts("INF");
        else printf("%d\\n", d[a][b]);
    }
    return 0;
}`,
      python: `n, m, q = map(int, input().split())
inf = float("inf")
d = [[inf] * n for _ in range(n)]
for i in range(n):
    d[i][i] = 0
for _ in range(m):
    u, v, w = map(int, input().split())
    d[u][v] = min(d[u][v], w)
for k in range(n):
    for i in range(n):
        for j in range(n):
            if d[i][k] != inf and d[k][j] != inf:
                d[i][j] = min(d[i][j], d[i][k] + d[k][j])
for _ in range(q):
    a, b = map(int, input().split())
    print("INF" if d[a][b] == inf else d[a][b])`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), q = in.nextInt(), inf = 1_000_000_000;
        int[][] d = new int[n][n];
        for (int i = 0; i < n; i++) { Arrays.fill(d[i], inf); d[i][i] = 0; }
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt(), w = in.nextInt();
            d[u][v] = Math.min(d[u][v], w);
        }
        for (int k = 0; k < n; k++) for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) {
            if (d[i][k] != inf && d[k][j] != inf) d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
        }
        for (int i = 0; i < q; i++) {
            int a = in.nextInt(), b = in.nextInt();
            if (d[a][b] == inf) System.out.println("INF");
            else System.out.println(d[a][b]);
        }
    }
}`,
    },
  }
]);
