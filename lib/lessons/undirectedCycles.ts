import { defineTopics } from "./define.ts";

export const undirectedCycles = defineTopics([
  {
    "id": "undirected-cycle-detection",
    "stage": 6,
    "title": "Cycle detection in undirected graphs",
    "objective": "Find the first edge that closes a cycle in an undirected edge stream.",
    "prerequisites": "Connected components, edge lists, and disjoint-set union.",
    "analogy": "When laying roads one at a time, a new road makes a loop if you could already travel between its endpoints.",
    "explanation": "Process edges in order. Before adding an edge, compare the sets of its endpoints. If they differ, union them. If they agree, the previous edges already contain a path between those endpoints, and the new edge closes a cycle. An online disjoint-set check avoids recomputing reachability after every insertion.",
    "invariant": "The disjoint-set partition after each processed edge is exactly the connected components of the processed graph. Before the first repeated root, those edges form a forest.",
    "pseudocode": "start with one set per vertex\nfor edge index i with endpoints u,v:\n  if find(u) == find(v): return i\n  union(u,v)\nreturn −1",
    "time": "O((n+m) α(n)) with union by size and path compression",
    "space": "O(n) for the disjoint sets",
    "trace": [
      [
        "Read edge 0: 0—1",
        "The endpoints belong to separate sets. Merge them."
      ],
      [
        "Read edge 1: 1—2",
        "Vertex 2 joins the component of 0 and 1."
      ],
      [
        "Read edge 2: 0—2",
        "The roots agree before adding the edge."
      ],
      [
        "Report index 2",
        "The new connection makes a cycle with the earlier path 0—1—2."
      ]
    ],
    "misconception": "In multigraphs, two different edges between the same endpoints already make a cycle of length two.",
    "debug": "Try a forest, a self-loop as the first edge, and two parallel edges.",
    "fill": "What are you comparing before performing union?",
    "edgeCases": [
      "An empty stream reports −1.",
      "A self-loop closes a length-one cycle.",
      "Disconnected components can be processed together."
    ],
    "revision": "Why does adding an edge between distinct components preserve acyclicity?",
    "further": "Recover a witness path between the endpoints using the forest kept so far.",
    "quiz": {
      "question": "A second edge connects the same pair of vertices. What should the detector report?",
      "answers": [
        "A cycle on the second edge",
        "No cycle unless there is a third vertex",
        "Only a larger component"
      ],
      "correct": 0,
      "feedback": "The first edge already forms a path between the endpoints. The second edge closes a multigraph cycle."
    },
    "practice": {
      "title": "Find the first redundant road",
      "description": "Report the first undirected road that closes a cycle in the input order.",
      "format": "Read n m followed by m undirected edges u v. Print the zero-based index of the first cycle-closing edge or −1.",
      "constraints": "1 ≤ n ≤ 200, 0 ≤ m ≤ 400, and 0 ≤ u,v < n. Self-loops and parallel edges are allowed.",
      "input": "3 3\n0 1\n1 2\n0 2\n",
      "output": "2\n",
      "hints": [
        "Compare the component roots before union.",
        "Stop on the first edge in input order that cannot merge distinct sets."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int parent[200], size[200];
static int root(int v) {
    while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
    return v;
}
int main(void) {
    int n, m;
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        int a = root(u), b = root(v);
        if (a == b) { printf("%d\\n", i); return 0; }
        if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
        parent[b] = a;
        size[a] += size[b];
    }
    puts("-1");
    return 0;
}`,
      python: `n, m = map(int, input().split())
parent, size = list(range(n)), [1] * n

def root(v):
    while v != parent[v]:
        parent[v] = parent[parent[v]]
        v = parent[v]
    return v

for i in range(m):
    u, v = map(int, input().split())
    a, b = root(u), root(v)
    if a == b:
        print(i)
        break
    if size[a] < size[b]:
        a, b = b, a
    parent[b] = a
    size[a] += size[b]
else:
    print(-1)`,
      java: `import java.util.Scanner;
class Main {
    static int root(int[] parent, int v) {
        while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
        return v;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt();
        int[] parent = new int[n], size = new int[n];
        for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
        for (int i = 0; i < m; i++) {
            int a = root(parent, in.nextInt()), b = root(parent, in.nextInt());
            if (a == b) { System.out.println(i); return; }
            if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
            parent[b] = a;
            size[a] += size[b];
        }
        System.out.println(-1);
    }
}`,
    },
  }
]);
