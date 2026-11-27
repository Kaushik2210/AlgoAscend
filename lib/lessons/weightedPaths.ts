import { defineTopics } from "./define.ts";

export const weightedPaths = defineTopics([
  {
    "id": "dijkstra-shortest-path",
    "stage": 6,
    "title": "Dijkstra’s shortest paths",
    "objective": "Find shortest travel costs in a graph with nonnegative edge weights.",
    "prerequisites": "Breadth-first search, adjacency matrices and comparison loops.",
    "analogy": "Expand from the cheapest known stop. Any route through a more expensive stop can only stay as expensive or get more expensive.",
    "explanation": "Initialize the source distance to zero and every other distance to infinity. Repeatedly settle the unsettled vertex with the smallest tentative distance and use each outgoing edge to try to improve its neighbor’s distance. This lesson uses an adjacency matrix and a linear minimum scan.",
    "invariant": "Every settled vertex has its final distance. On a hypothetical shorter path to the next vertex, the first unsettled vertex would already have a tentative distance at most the path's total cost. Nonnegative weights make that a contradiction to the chosen minimum.",
    "pseudocode": "distance[source] = 0; all other distances = infinity\nwhile a reachable unsettled vertex remains:\n  u = unsettled vertex with minimum distance\n  settle u\n  for each edge u → v with weight w:\n    distance[v] = min(distance[v], distance[u] + w)",
    "time": "O(n² + m) time for the matrix implementation with n vertices and m input edges",
    "space": "O(n²) for the adjacency matrix. The Python program also buffers O(m) edge tokens",
    "trace": [
      [
        "A=0, B=∞, C=∞, D=∞",
        "Begin at A. The edges are A→B (6), A→C (2), C→B (1), C→D (8), and B→D (2)."
      ],
      [
        "A settled | B=6, C=2, D=∞",
        "Relax A’s two outgoing edges."
      ],
      [
        "C settled | B=3, D=10",
        "C costs 2 to reach. It offers a cheaper route to B and the first route to D."
      ],
      [
        "B settled | D=5",
        "The route through B improves D from 10 to 5."
      ],
      [
        "D settled | shortest cost 5",
        "No unsettled vertex has a lower tentative cost. The answer is final."
      ]
    ],
    "misconception": "Marking a vertex settled when it is first discovered can freeze a tentative cost before a cheaper path arrives.",
    "debug": "Use an expensive direct edge followed by a cheaper route with two edges.",
    "fill": "When settling u, what expression using distance[u] and w can improve distance[v]?",
    "edgeCases": [
      "Zero-weight edges are valid.",
      "Parallel edges keep the minimum weight.",
      "An unreachable destination prints −1.",
      "The source has distance zero to itself."
    ],
    "revision": "Where does the correctness proof use nonnegative weights?",
    "further": "Use adjacency lists and a min-heap for sparse graphs. Compare the running times.",
    "quiz": {
      "question": "Why can the distance to B change from 6 to 3 before B is settled?",
      "answers": [
        "B was discovered through a more expensive route first",
        "Dijkstra ignores direct edges",
        "The edge weights were edited"
      ],
      "correct": 0,
      "feedback": "The cheapest unsettled vertex can uncover a lower-cost route to a previously discovered vertex."
    },
    "practice": {
      "title": "Cheapest relay route",
      "description": "Find the minimum travel cost from the source relay to the destination in a directed network.",
      "format": "Read n m s t. Then read m directed edges u v w. Print the minimum cost from s to t or −1 if unreachable.",
      "constraints": "1 ≤ n ≤ 100, 0 ≤ m ≤ 400, vertices are zero-based, and 0 ≤ w ≤ 10⁶.",
      "input": "4 5 0 3\n0 1 6\n0 2 2\n2 1 1\n2 3 8\n1 3 2\n",
      "output": "5\n",
      "hints": [
        "Use a separate sentinel for a missing edge because zero is a valid weight.",
        "Stop only when the destination is settled or no reachable unsettled vertex remains."
      ]
    },
    code:{
      c: `#include <stdio.h>
#define INF 1000000000
static int edge[100][100], distance[100], settled[100];
int main(void) {
    int n, m, source, target;
    if (scanf("%d%d%d%d", &n, &m, &source, &target) != 4) return 0;
    for (int u = 0; u < n; u++) {
        distance[u] = INF;
        for (int v = 0; v < n; v++) edge[u][v] = INF;
    }
    for (int i = 0; i < m; i++) {
        int u, v, w;
        scanf("%d%d%d", &u, &v, &w);
        if (w < edge[u][v]) edge[u][v] = w;
    }
    distance[source] = 0;
    for (int i = 0; i < n; i++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!settled[v] && (u == -1 || distance[v] < distance[u])) u = v;
        }
        if (u == -1 || distance[u] == INF || u == target) break;
        settled[u] = 1;
        for (int v = 0; v < n; v++) {
            int candidate = distance[u] + edge[u][v];
            if (candidate < distance[v]) distance[v] = candidate;
        }
    }
    printf("%d\\n", distance[target] == INF ? -1 : distance[target]);
    return 0;
}`,
      python: `import sys
items = iter(map(int, sys.stdin.buffer.read().split()))
n, m, source, target = (next(items) for _ in range(4))
inf = 10**9
edge = [[inf] * n for _ in range(n)]
for _ in range(m):
    u, v, w = next(items), next(items), next(items)
    edge[u][v] = min(edge[u][v], w)

distance = [inf] * n
settled = [False] * n
distance[source] = 0
for _ in range(n):
    u = min((v for v in range(n) if not settled[v]), key=distance.__getitem__, default=-1)
    if u == -1 or distance[u] == inf or u == target:
        break
    settled[u] = True
    for v, weight in enumerate(edge[u]):
        distance[v] = min(distance[v], distance[u] + weight)
print(-1 if distance[target] == inf else distance[target])`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), source = in.nextInt(), target = in.nextInt();
        final int inf = 1_000_000_000;
        int[][] edge = new int[n][n];
        for (int[] row : edge) Arrays.fill(row, inf);
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt(), w = in.nextInt();
            edge[u][v] = Math.min(edge[u][v], w);
        }
        int[] distance = new int[n];
        boolean[] settled = new boolean[n];
        Arrays.fill(distance, inf);
        distance[source] = 0;
        for (int i = 0; i < n; i++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!settled[v] && (u == -1 || distance[v] < distance[u])) u = v;
            }
            if (u == -1 || distance[u] == inf || u == target) break;
            settled[u] = true;
            for (int v = 0; v < n; v++) {
                distance[v] = Math.min(distance[v], distance[u] + edge[u][v]);
            }
        }
        System.out.println(distance[target] == inf ? -1 : distance[target]);
    }
}`,
    },
  }
]);
