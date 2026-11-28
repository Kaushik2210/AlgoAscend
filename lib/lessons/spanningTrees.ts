import { defineTopics } from "./define.ts";

export const spanningTrees = defineTopics([
  {
    "id": "kruskal-spanning-tree",
    "stage": 6,
    "title": "Kruskal’s algorithm and minimum spanning trees",
    "objective": "Connect all vertices at minimum total weight by adding safe edges in sorted order.",
    "prerequisites": "Undirected graphs, sorting, and disjoint-set union.",
    "analogy": "Choose the cheapest cable that currently joins two separate buildings or networks. Skip a cable when its endpoints are already connected.",
    "explanation": "Sort the undirected edges by weight. Inspect them in order, using disjoint-set union to track the components of chosen edges. Add an edge only if it joins two components. An edge chosen this way is a cheapest edge crossing the cut around one component. The cut argument allows some minimum spanning tree to contain it. If the graph is disconnected, the result is a forest.",
    "invariant": "The chosen edges are acyclic and can be extended to a minimum spanning tree when the graph is connected. Adding a crossing edge never forms a cycle. In an optimal tree lacking it, replacing another crossing edge on the resulting cycle preserves connectivity and cannot raise weight.",
    "pseudocode": "sort edges ascending by weight\nstart with a separate set for each vertex\nfor edge u,v,w:\n  if union(u,v) merges two sets:\n    add w to total and increment selected count\nreturn total if selected count is n−1, otherwise DISCONNECTED",
    "time": "O(m log(m+1) + (n+m) α(n)) for comparison sorting and disjoint-set operations",
    "space": "O(n+m) for sets and edges, plus any sorting workspace",
    "trace": [
      [
        "Edges 0—1 (3), 1—2 (1), 0—2 (2)",
        "Sort by weights 1, 2, 3."
      ],
      [
        "Take 1—2 at weight 1",
        "Merge the components of 1 and 2."
      ],
      [
        "Take 0—2 at weight 2",
        "Vertex 0 joins the other component."
      ],
      [
        "Skip 0—1",
        "It would create a cycle. The minimum total is 3."
      ]
    ],
    "misconception": "A minimum spanning tree minimizes total connection cost. It may give longer routes between particular pairs than the original graph.",
    "debug": "Try equal weights, negative weights, and a disconnected graph.",
    "fill": "What test tells you that adding an edge would create a cycle?",
    "edgeCases": [
      "A single vertex needs no edges and costs zero.",
      "Self-loops cannot merge components.",
      "Duplicate or tied edges may yield different trees of the same total cost."
    ],
    "revision": "Why does a cheapest edge crossing a component’s cut remain safe?",
    "further": "Compare this edge-sorting approach with Prim’s growth from one component.",
    "quiz": {
      "question": "What should happen when an edge’s endpoints already share a set?",
      "answers": [
        "Add it if its weight is negative",
        "Skip it",
        "Restart from the smaller endpoint"
      ],
      "correct": 1,
      "feedback": "The chosen forest already connects those endpoints. Adding their edge would form a cycle."
    },
    "practice": {
      "title": "Connect the campus at minimum cost",
      "description": "Choose an undirected spanning tree or report that no spanning tree exists.",
      "format": "Read n m, then m undirected edges u v weight. Print the minimum total cost or DISCONNECTED.",
      "constraints": "1 ≤ n ≤ 200, 0 ≤ m ≤ 400, vertices are zero-based, and |weight| ≤ 10⁶.",
      "input": "3 3\n0 1 3\n1 2 1\n0 2 2\n",
      "output": "3\n",
      "hints": [
        "Add edges in nondecreasing weight order.",
        "Compare the roots before attempting a union."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>
typedef struct { int u, v, weight; } Edge;
static int parent[200], size[200];
static int root(int v) {
    while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
    return v;
}
static int by_weight(const void *a, const void *b) {
    const Edge *x = a, *y = b;
    return (x->weight > y->weight) - (x->weight < y->weight);
}
int main(void) {
    int n, m, selected = 0, total = 0;
    Edge edges[400];
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
    for (int i = 0; i < m; i++) scanf("%d%d%d", &edges[i].u, &edges[i].v, &edges[i].weight);
    qsort(edges, (size_t)m, sizeof(Edge), by_weight);
    for (int i = 0; i < m && selected < n - 1; i++) {
        int a = root(edges[i].u), b = root(edges[i].v);
        if (a == b) continue;
        if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
        parent[b] = a;
        size[a] += size[b];
        total += edges[i].weight;
        selected++;
    }
    if (selected == n - 1) printf("%d\\n", total);
    else puts("DISCONNECTED");
    return 0;
}`,
      python: `n, m = map(int, input().split())
edges = [tuple(map(int, input().split())) for _ in range(m)]
parent, sizes = list(range(n)), [1] * n

def root(v):
    while v != parent[v]:
        parent[v] = parent[parent[v]]
        v = parent[v]
    return v

selected = total = 0
for u, v, weight in sorted(edges, key=lambda edge: edge[2]):
    a, b = root(u), root(v)
    if a == b:
        continue
    if sizes[a] < sizes[b]:
        a, b = b, a
    parent[b] = a
    sizes[a] += sizes[b]
    total += weight
    selected += 1
    if selected == n - 1:
        break
print(total if selected == n - 1 else "DISCONNECTED")`,
      java: `import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;
class Main {
    record Edge(int u, int v, int weight) {}
    static int root(int[] parent, int v) {
        while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
        return v;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), selected = 0, total = 0;
        int[] parent = new int[n], size = new int[n];
        for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
        Edge[] edges = new Edge[m];
        for (int i = 0; i < m; i++) edges[i] = new Edge(in.nextInt(), in.nextInt(), in.nextInt());
        Arrays.sort(edges, Comparator.comparingInt(Edge::weight));
        for (Edge edge : edges) {
            if (selected == n - 1) break;
            int a = root(parent, edge.u()), b = root(parent, edge.v());
            if (a == b) continue;
            if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
            parent[b] = a;
            size[a] += size[b];
            total += edge.weight();
            selected++;
        }
        System.out.println(selected == n - 1 ? String.valueOf(total) : "DISCONNECTED");
    }
}`,
    },
  }
]);
