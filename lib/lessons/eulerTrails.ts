import { defineTopics } from "./define.ts";

export const eulerTrails = defineTopics([
  {
    "id": "eulerian-trails",
    "stage": 6,
    "title": "Eulerian trails and edge-use conditions",
    "objective": "Decide whether one walk can cross every undirected edge exactly once.",
    "prerequisites": "Undirected multigraphs, degree, and connected components.",
    "analogy": "Plan a street sweep that uses every road once. Arriving at a junction normally pairs with leaving it. Only the starting and ending junctions may be unmatched.",
    "explanation": "Ignore isolated vertices when checking connectivity. If all positive-degree vertices belong to one component, a trail exists exactly when zero or two vertices have odd degree. With zero odd vertices there is a closed trail. With two, the odd vertices are its endpoints. Pairing arrivals with departures gives the degree condition. To construct a trail, start at a valid endpoint and splice closed edge-disjoint walks into the current walk, as in Hierholzer’s algorithm.",
    "invariant": "An undirected edge contributes one degree at each endpoint, so a self-loop contributes two at the same vertex. During the component check, vertices joined by an input edge end up in the same set.",
    "pseudocode": "add each edge to both endpoint degrees and union endpoints\ncheck that all vertices of nonzero degree share one component\ncount vertices of odd degree\nreturn YES when connected and odd count is zero or two",
    "time": "O((n+m) α(n)) using union by size and path compression",
    "space": "O(n) for degrees and disjoint sets",
    "trace": [
      [
        "Edges 0—1, 1—2, 2—0, 1—3",
        "Vertices 0 and 2 have even degree. Vertices 1 and 3 are odd."
      ],
      [
        "Nonisolated vertices share one component",
        "The traversal can cover every road without jumping between components."
      ],
      [
        "Odd endpoints are 1 and 3",
        "Start at 3 and finish at 1."
      ],
      [
        "Walk 3→1→0→2→1",
        "Every edge is used exactly once. Returning to an earlier vertex is allowed."
      ]
    ],
    "misconception": "An Eulerian trail uses each edge once. A vertex can appear several times.",
    "debug": "Use two disjoint triangles. Every vertex is even, but the roads cannot be covered by one walk.",
    "fill": "Which vertices must be the endpoints when exactly two degrees are odd?",
    "edgeCases": [
      "The empty edge set admits an empty trail.",
      "Isolated vertices do not affect edge connectivity.",
      "Parallel edges count independently.",
      "A self-loop adds two to its vertex’s degree."
    ],
    "revision": "Why does checking only degree parity miss disconnected examples?",
    "further": "Produce a witness by implementing Hierholzer with edge IDs and a stack.",
    "quiz": {
      "question": "For a connected graph with exactly two odd-degree vertices, where must an Eulerian trail start and end?",
      "answers": [
        "At the two odd-degree vertices",
        "At the same vertex",
        "At any two vertices"
      ],
      "correct": 0,
      "feedback": "Only the start and end can have unmatched arrivals or departures."
    },
    "practice": {
      "title": "Check whether every street can be swept once",
      "description": "Decide whether a walk can use every undirected street exactly once.",
      "format": "Read n m, followed by m undirected edges u v. Print YES if an Eulerian trail exists, otherwise NO.",
      "constraints": "1 ≤ n ≤ 150, 0 ≤ m ≤ 400, and 0 ≤ u,v < n. Self-loops and parallel edges are allowed.",
      "input": "4 4\n0 1\n1 2\n2 0\n1 3\n",
      "output": "YES\n",
      "hints": [
        "Compare only positive-degree vertices for connectivity.",
        "A self-loop contributes twice to the same degree."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int parent[150], size[150], degree[150];
static int root(int v) {
    while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
    return v;
}
int main(void) {
    int n, m, component = -1, odd = 0;
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        degree[u]++; degree[v]++;
        int a = root(u), b = root(v);
        if (a == b) continue;
        if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
        parent[b] = a;
        size[a] += size[b];
    }
    for (int v = 0; v < n; v++) if (degree[v]) {
        int current = root(v);
        if (component == -1) component = current;
        if (component != current) { puts("NO"); return 0; }
        odd += degree[v] % 2;
    }
    puts(odd == 0 || odd == 2 ? "YES" : "NO");
    return 0;
}`,
      python: `n, m = map(int, input().split())
parent, size, degree = list(range(n)), [1] * n, [0] * n

def root(v):
    while v != parent[v]:
        parent[v] = parent[parent[v]]
        v = parent[v]
    return v

for _ in range(m):
    u, v = map(int, input().split())
    degree[u] += 1
    degree[v] += 1
    a, b = root(u), root(v)
    if a == b:
        continue
    if size[a] < size[b]:
        a, b = b, a
    parent[b] = a
    size[a] += size[b]
components = {root(v) for v in range(n) if degree[v]}
odd = sum(value % 2 for value in degree)
print("YES" if len(components) <= 1 and odd in (0, 2) else "NO")`,
      java: `import java.util.Scanner;
class Main {
    static int root(int[] parent, int v) {
        while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
        return v;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), component = -1, odd = 0;
        int[] parent = new int[n], size = new int[n], degree = new int[n];
        for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt();
            degree[u]++; degree[v]++;
            int a = root(parent, u), b = root(parent, v);
            if (a == b) continue;
            if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
            parent[b] = a;
            size[a] += size[b];
        }
        for (int v = 0; v < n; v++) if (degree[v] > 0) {
            int current = root(parent, v);
            if (component == -1) component = current;
            if (component != current) { System.out.println("NO"); return; }
            odd += degree[v] % 2;
        }
        System.out.println(odd == 0 || odd == 2 ? "YES" : "NO");
    }
}`,
    },
  }
]);
