import { defineTopics } from "./define.ts";

export const networkFlow = defineTopics([
  {
    "id": "max-flow-min-cut",
    "stage": 6,
    "title": "Maximum flow and minimum cuts",
    "objective": "Use residual paths to route the most flow, then identify a cut that proves optimality.",
    "prerequisites": "Directed graphs, BFS, and path reconstruction.",
    "analogy": "Pipes carry a limited flow. Residual capacity records spare room and the ability to reroute earlier choices backward.",
    "explanation": "Start with zero flow and use BFS to find a source-to-sink path in the residual network. Push the smallest residual capacity on that path. Reduce forward residual capacities and increase their reverse counterparts so later paths can undo earlier decisions. When BFS cannot reach the sink, the reachable set defines the source side of a cut. Its original outgoing capacity equals the achieved flow.",
    "invariant": "Every augmentation preserves capacities and flow conservation. Every original edge leaving the final reachable set is saturated, and there is no net flow from its complement into the set. Thus the flow equals the cut capacity, which upper-bounds every feasible flow.",
    "pseudocode": "residual = original capacities\nwhile BFS can reach sink by positive residual edges:\n  reconstruct the BFS path\n  push = smallest capacity along it\n  subtract push along the path and add it in the reverse direction\n  add push to total\nuse the final reachable marks to sum the original outward cut",
    "time": "O(n³m+n²) as a conservative bound with matrix BFS and O(nm) augmentations. Adjacency lists give O(nm²)",
    "space": "O(n²) for original and residual capacities",
    "trace": [
      [
        "s→a (3), s→b (2), a→t (2), b→t (4)",
        "Start with zero flow and all original capacities available."
      ],
      [
        "BFS path s→a→t pushes 2",
        "The a→t capacity is the bottleneck. Each reverse edge gains capacity two."
      ],
      [
        "BFS path s→b→t pushes 2",
        "This saturates s→b. The total is four."
      ],
      [
        "Final reachable set {s,a}",
        "The cut crosses s→b (2) and a→t (2). A cut of capacity four certifies optimality."
      ]
    ],
    "misconception": "Without reverse residual capacity, an early route can block a better final arrangement.",
    "debug": "Use parallel arcs and a case with a route that must be partially undone. Check that maximum flow and cut capacity agree.",
    "fill": "Which residual value limits how much flow may be sent along the chosen path?",
    "edgeCases": [
      "No source-to-sink route gives zero flow and a zero-capacity cut.",
      "Parallel arcs add their capacities.",
      "Opposite directed arcs remain valid."
    ],
    "revision": "What does the absence of an augmenting path tell you about the reachable set?",
    "further": "Recover the individual edges crossing the minimum cut or reduce a unit-capacity bipartite matching instance to flow.",
    "quiz": {
      "question": "A residual path uses capacities 5, 2 and 4. How much can it augment?",
      "answers": [
        "2",
        "4",
        "11"
      ],
      "correct": 0,
      "feedback": "Every edge must carry the same additional amount, so the minimum available capacity is the bottleneck."
    },
    "practice": {
      "title": "Route cargo across capacity limits",
      "description": "Compute the maximum shipment and an associated minimum-cut capacity.",
      "format": "Read n m source sink, then m edges u v capacity. Print maximum flow and minimum-cut capacity separated by a space.",
      "constraints": "2 ≤ n ≤ 70, 0 ≤ m ≤ 350, 0 ≤ vertices < n, source differs from sink, and 0 ≤ capacity ≤ 10⁶.",
      "input": "4 4 0 3\n0 1 3\n0 2 2\n1 3 2\n2 3 4\n",
      "output": "4 4\n",
      "hints": [
        "A reverse residual edge can undo part of an earlier path.",
        "Reuse the marks from the final unsuccessful BFS to obtain the cut."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int original[70][70], residual[70][70], parent[70];
static int bfs(int n, int source, int sink) {
    int queue[70], head = 0, tail = 0;
    for (int v = 0; v < n; v++) parent[v] = -1;
    parent[source] = source;
    queue[tail++] = source;
    while (head < tail) {
        int u = queue[head++];
        for (int v = 0; v < n; v++) {
            if (parent[v] == -1 && residual[u][v] > 0) {
                parent[v] = u;
                if (v == sink) return 1;
                queue[tail++] = v;
            }
        }
    }
    return 0;
}
int main(void) {
    int n, m, source, sink, total = 0, cut = 0;
    if (scanf("%d%d%d%d", &n, &m, &source, &sink) != 4) return 0;
    for (int i = 0; i < m; i++) {
        int u, v, capacity;
        scanf("%d%d%d", &u, &v, &capacity);
        original[u][v] += capacity;
        residual[u][v] += capacity;
    }
    while (bfs(n, source, sink)) {
        int delta = 1000000000;
        for (int v = sink; v != source; v = parent[v]) {
            if (residual[parent[v]][v] < delta) delta = residual[parent[v]][v];
        }
        for (int v = sink; v != source; v = parent[v]) {
            int u = parent[v];
            residual[u][v] -= delta;
            residual[v][u] += delta;
        }
        total += delta;
    }
    for (int u = 0; u < n; u++) for (int v = 0; v < n; v++) {
        if (parent[u] != -1 && parent[v] == -1) cut += original[u][v];
    }
    printf("%d %d\\n", total, cut);
    return 0;
}`,
      python: `from collections import deque
n, m, source, sink = map(int, input().split())
original = [[0] * n for _ in range(n)]
for _ in range(m):
    u, v, capacity = map(int, input().split())
    original[u][v] += capacity
residual = [row[:] for row in original]

def bfs():
    parent = [-1] * n
    parent[source] = source
    queue = deque([source])
    while queue:
        u = queue.popleft()
        for v, capacity in enumerate(residual[u]):
            if parent[v] == -1 and capacity > 0:
                parent[v] = u
                if v == sink:
                    return parent
                queue.append(v)
    return parent

total = 0
while True:
    parent = bfs()
    if parent[sink] == -1:
        break
    path = []
    v = sink
    while v != source:
        u = parent[v]
        path.append((u, v))
        v = u
    delta = min(residual[u][v] for u, v in path)
    for u, v in path:
        residual[u][v] -= delta
        residual[v][u] += delta
    total += delta
cut = sum(original[u][v] for u in range(n) for v in range(n) if parent[u] != -1 and parent[v] == -1)
print(total, cut)`,
      java: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Scanner;
class Main {
    static int[] bfs(int[][] residual, int source, int sink) {
        int n = residual.length;
        int[] parent = new int[n];
        Arrays.fill(parent, -1);
        parent[source] = source;
        var queue = new ArrayDeque<Integer>();
        queue.add(source);
        while (!queue.isEmpty()) {
            int u = queue.removeFirst();
            for (int v = 0; v < n; v++) {
                if (parent[v] == -1 && residual[u][v] > 0) {
                    parent[v] = u;
                    if (v == sink) return parent;
                    queue.addLast(v);
                }
            }
        }
        return parent;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), source = in.nextInt(), sink = in.nextInt();
        int[][] original = new int[n][n], residual = new int[n][n];
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt(), capacity = in.nextInt();
            original[u][v] += capacity;
            residual[u][v] += capacity;
        }
        int total = 0, cut = 0;
        int[] parent = bfs(residual, source, sink);
        while (parent[sink] != -1) {
            int delta = Integer.MAX_VALUE;
            for (int v = sink; v != source; v = parent[v]) delta = Math.min(delta, residual[parent[v]][v]);
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                residual[u][v] -= delta;
                residual[v][u] += delta;
            }
            total += delta;
            parent = bfs(residual, source, sink);
        }
        for (int u = 0; u < n; u++) for (int v = 0; v < n; v++) {
            if (parent[u] != -1 && parent[v] == -1) cut += original[u][v];
        }
        System.out.println(total + " " + cut);
    }
}`,
    },
  }
]);
