import { defineTopics } from "./define.ts";

export const offlineConnectivity = defineTopics([
  {
    "id": "offline-threshold-queries",
    "stage": 11,
    "title": "Offline threshold queries with disjoint sets",
    "objective": "Process many connectivity queries with one weight-ordered sweep.",
    "prerequisites": "Sorting, edge lists, and disjoint-set union.",
    "analogy": "Open roads in order of difficulty. At each requested difficulty, check which towns are already connected.",
    "explanation": "Each query asks whether a path exists using only edges up to a weight limit. Read all queries, save their original IDs, and sort them by limit. Sort edges by weight. As the limit rises, activate all newly eligible edges and union their endpoints. Unlike a moving Mo window, this sweep only adds information. Queries with equal limits see the same edge set.",
    "invariant": "Immediately before answering a query of limit t, the disjoint sets describe exactly the components of the subgraph with edges of weight at most t. Each edge is added once, and it stays eligible for every later query.",
    "pseudocode": "sort edges by weight and queries by limit\nstart separate sets and an edge cursor at zero\nfor query in increasing limit order:\n  while next edge exists and its weight ≤ limit: union endpoints\n  save whether the queried endpoints have equal roots\nprint results in original order",
    "time": "O(m log(m+1) + q log(q+1) + (m+q) α(n) + n)",
    "space": "O(n+m+q) for components, edges, queries, and answers",
    "trace": [
      [
        "Edges 0—1 (1), 1—2 (4), 0—2 (5)",
        "Queries for (0,2) arrive with limits 5, 0, and 4."
      ],
      [
        "Process limit 0 first",
        "No edges are active, so save NO under the second query’s ID."
      ],
      [
        "At limit 4, activate edges of weights 1 and 4",
        "Vertices 0 and 2 now share a component."
      ],
      [
        "At limit 5, the last edge changes nothing",
        "Output YES, NO, YES in the original input order."
      ]
    ],
    "misconception": "Edges whose weight equals the threshold must be activated before answering an inclusive query.",
    "debug": "Use queries with decreasing limits, multiple equal limits, and a vertex queried against itself.",
    "fill": "Which ID is needed to print answers after reordering queries?",
    "edgeCases": [
      "An empty edge set connects each vertex only to itself.",
      "Negative and equal weights follow normal numeric sorting.",
      "A zero-query input produces no lines."
    ],
    "revision": "Why can the edge cursor advance without ever needing to roll back a union?",
    "further": "Determine the earliest threshold that connects a pair by combining this idea with parallel binary search.",
    "quiz": {
      "question": "If an edge weighs 4 and the query limit is 4, should the edge be active?",
      "answers": [
        "Yes",
        "No",
        "Only if it was mentioned first"
      ],
      "correct": 0,
      "feedback": "The query allows weights up to and including its limit."
    },
    "practice": {
      "title": "Check which relays connect at each limit",
      "description": "Answer undirected connectivity queries where each query supplies its own maximum edge weight.",
      "format": "Read n m q, then m lines u v weight, then q lines a b limit. Print YES when a and b connect using only edges of weight at most limit, otherwise NO.",
      "constraints": "1 ≤ n ≤ 150, 0 ≤ m,q ≤ 250, vertices are zero-based, and |weight|, |limit| ≤ 10⁵.",
      "input": "3 3 3\n0 1 1\n1 2 4\n0 2 5\n0 2 5\n0 2 0\n0 2 4\n",
      "output": "YES\nNO\nYES\n",
      "hints": [
        "Sort both edges and queries in increasing threshold order.",
        "Keep an original index on each query."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>
typedef struct { int a, b, weight, id; } Entry;
static int parent[150], size[150];
static int compare(const void *a, const void *b) {
    return ((const Entry *)a)->weight - ((const Entry *)b)->weight;
}
static int root(int v) {
    while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
    return v;
}
static void join(int a, int b) {
    a = root(a); b = root(b);
    if (a == b) return;
    if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
    parent[b] = a; size[a] += size[b];
}
int main(void) {
    int n, m, q, cursor = 0, answer[250];
    Entry edges[250], queries[250];
    if (scanf("%d%d%d", &n, &m, &q) != 3) return 0;
    for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
    for (int i = 0; i < m; i++) scanf("%d%d%d", &edges[i].a, &edges[i].b, &edges[i].weight);
    for (int i = 0; i < q; i++) {
        scanf("%d%d%d", &queries[i].a, &queries[i].b, &queries[i].weight);
        queries[i].id = i;
    }
    qsort(edges, (size_t)m, sizeof(Entry), compare);
    qsort(queries, (size_t)q, sizeof(Entry), compare);
    for (int i = 0; i < q; i++) {
        Entry query = queries[i];
        while (cursor < m && edges[cursor].weight <= query.weight) {
            join(edges[cursor].a, edges[cursor].b);
            cursor++;
        }
        answer[query.id] = root(query.a) == root(query.b);
    }
    for (int i = 0; i < q; i++) puts(answer[i] ? "YES" : "NO");
    return 0;
}`,
      python: `n, m, q = map(int, input().split())
edges = [tuple(map(int, input().split())) for _ in range(m)]
queries = [(*map(int, input().split()), i) for i in range(q)]
parent, size = list(range(n)), [1] * n

def root(v):
    while v != parent[v]:
        parent[v] = parent[parent[v]]
        v = parent[v]
    return v

def join(a, b):
    a, b = root(a), root(b)
    if a == b:
        return
    if size[a] < size[b]:
        a, b = b, a
    parent[b] = a
    size[a] += size[b]

edges.sort(key=lambda edge: edge[2])
queries.sort(key=lambda query: query[2])
cursor = 0
answers = [""] * q
for a, b, limit, index in queries:
    while cursor < m and edges[cursor][2] <= limit:
        join(edges[cursor][0], edges[cursor][1])
        cursor += 1
    answers[index] = "YES" if root(a) == root(b) else "NO"
for answer in answers:
    print(answer)`,
      java: `import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;
class Main {
    record Entry(int a, int b, int weight, int id) {}
    static int[] parent, size;
    static int root(int v) {
        while (v != parent[v]) { parent[v] = parent[parent[v]]; v = parent[v]; }
        return v;
    }
    static void join(int a, int b) {
        a = root(a); b = root(b);
        if (a == b) return;
        if (size[a] < size[b]) { int swap = a; a = b; b = swap; }
        parent[b] = a; size[a] += size[b];
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), q = in.nextInt(), cursor = 0;
        parent = new int[n]; size = new int[n];
        for (int v = 0; v < n; v++) { parent[v] = v; size[v] = 1; }
        Entry[] edges = new Entry[m], queries = new Entry[q];
        for (int i = 0; i < m; i++) edges[i] = new Entry(in.nextInt(), in.nextInt(), in.nextInt(), -1);
        for (int i = 0; i < q; i++) queries[i] = new Entry(in.nextInt(), in.nextInt(), in.nextInt(), i);
        Arrays.sort(edges, Comparator.comparingInt(Entry::weight));
        Arrays.sort(queries, Comparator.comparingInt(Entry::weight));
        String[] answer = new String[q];
        for (Entry query : queries) {
            while (cursor < m && edges[cursor].weight() <= query.weight()) {
                Entry edge = edges[cursor++];
                join(edge.a(), edge.b());
            }
            answer[query.id()] = root(query.a()) == root(query.b()) ? "YES" : "NO";
        }
        for (String result : answer) System.out.println(result);
    }
}`,
    },
  }
]);
