import { defineTopics } from "./define.ts";

export const strongComponents = defineTopics([
  {
    "id": "strongly-connected-components",
    "stage": 6,
    "title": "Strongly connected components",
    "objective": "Partition a directed graph into groups whose vertices can all reach one another.",
    "prerequisites": "Depth-first search, finishing order, and directed adjacency lists.",
    "analogy": "A one-way street map may contain neighborhoods where you can always return to your starting point. Reverse every street to expose the boundaries between those groups.",
    "explanation": "Kosaraju’s algorithm first records vertices when DFS finishes them. Reverse all edges. Process vertices in decreasing finishing order, starting a reversed-graph DFS only for an unassigned vertex. In the original component DAG, an edge from one component to another implies that the first component has a larger maximum finishing time. So the next chosen component has no incoming edge from an unassigned component. Reversing edges prevents traversal into any other unassigned component.",
    "invariant": "Each second-pass search starts in an unassigned component whose outgoing reversed edges can lead only to itself or assigned components. All vertices of its component are still mutually reachable when edges are reversed.",
    "pseudocode": "run DFS over all vertices and record them on exit\nmark every vertex unassigned\nfor vertex in reverse finishing order:\n  if vertex unassigned:\n    assign all reachable unassigned vertices in the reversed graph to a new component\nprint the number of components",
    "time": "O(n+m) with forward and reverse adjacency lists",
    "space": "O(n+m) for graphs, finishing order, marks, and recursion",
    "trace": [
      [
        "Edges 0↔1, 1→2, 2↔3",
        "There are two internally reachable groups and a one-way connection between them."
      ],
      [
        "First DFS exit order can be [3,2,1,0]",
        "Record exits, rather than the order in which vertices are discovered."
      ],
      [
        "Reverse edges and start at 0",
        "Reach 1 but no unassigned vertex in the other group."
      ],
      [
        "Next unassigned vertex is 2",
        "Reach 3. The reversed link toward 1 leads to an already assigned component."
      ]
    ],
    "misconception": "An undirected connected component can include two vertices that cannot reach one another in both directions.",
    "debug": "Use a directed chain. It is weakly connected, but every vertex belongs to a different strong component.",
    "fill": "Which DFS event determines a vertex’s place in the first-pass order?",
    "edgeCases": [
      "A vertex with no edges is its own component.",
      "Self-loops do not merge components.",
      "Parallel edges do not change which vertices can reach each other."
    ],
    "revision": "Why must the second DFS pass reverse edges and visit in reverse finishing order?",
    "further": "Build the component DAG and use a topological order to aggregate data.",
    "quiz": {
      "question": "In 0→1→2 with no other edges, how many strongly connected components exist?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 2,
      "feedback": "Progress along the chain cannot be reversed, so each vertex forms its own component."
    },
    "practice": {
      "title": "Count mutual-reachability districts",
      "description": "Count the strongly connected components of a directed transit graph.",
      "format": "Read n m, followed by m directed edges u v. Print the number of strongly connected components.",
      "constraints": "1 ≤ n ≤ 120, 0 ≤ m ≤ 400, and 0 ≤ u,v < n.",
      "input": "4 5\n0 1\n1 0\n1 2\n2 3\n3 2\n",
      "output": "2\n",
      "hints": [
        "Save each vertex only when its DFS call finishes.",
        "Use the reverse graph for the second traversal."
      ]
    },
    code: {
      c: `#include <stdio.h>
typedef struct { int v, next; } Edge;
static int first[2][120], seen[120], order[120], count;
static Edge edges[2][400];
static void dfs(int v, int reverse) {
    seen[v] = 1;
    for (int i = first[reverse][v]; i != -1; i = edges[reverse][i].next) {
        int other = edges[reverse][i].v;
        if (!seen[other]) dfs(other, reverse);
    }
    if (!reverse) order[count++] = v;
}
int main(void) {
    int n, m, components = 0;
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int i = 0; i < n; i++) first[0][i] = first[1][i] = -1;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        edges[0][i].v = v; edges[0][i].next = first[0][u]; first[0][u] = i;
        edges[1][i].v = u; edges[1][i].next = first[1][v]; first[1][v] = i;
    }
    for (int i = 0; i < n; i++) if (!seen[i]) dfs(i, 0);
    for (int i = 0; i < n; i++) seen[i] = 0;
    for (int i = count - 1; i >= 0; i--) {
        if (!seen[order[i]]) { components++; dfs(order[i], 1); }
    }
    printf("%d\\n", components);
    return 0;
}`,
      python: `n, m = map(int, input().split())
forward = [[] for _ in range(n)]
reverse = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    forward[u].append(v)
    reverse[v].append(u)
seen = [False] * n
exits = []

def dfs(v, graph, on_exit):
    seen[v] = True
    for other in graph[v]:
        if not seen[other]:
            dfs(other, graph, on_exit)
    if on_exit is not None:
        on_exit.append(v)

for vertex in range(n):
    if not seen[vertex]:
        dfs(vertex, forward, exits)
seen = [False] * n
components = 0
for vertex in reversed(exits):
    if not seen[vertex]:
        components += 1
        dfs(vertex, reverse, None)
print(components)`,
      java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;
class Main {
    static void dfs(int vertex, ArrayList<ArrayList<Integer>> graph, boolean[] seen, ArrayList<Integer> exits) {
        seen[vertex] = true;
        for (int other : graph.get(vertex)) if (!seen[other]) dfs(other, graph, seen, exits);
        if (exits != null) exits.add(vertex);
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), components = 0;
        var forward = new ArrayList<ArrayList<Integer>>();
        var reverse = new ArrayList<ArrayList<Integer>>();
        for (int i = 0; i < n; i++) { forward.add(new ArrayList<>()); reverse.add(new ArrayList<>()); }
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt();
            forward.get(u).add(v); reverse.get(v).add(u);
        }
        boolean[] seen = new boolean[n];
        var exits = new ArrayList<Integer>();
        for (int i = 0; i < n; i++) if (!seen[i]) dfs(i, forward, seen, exits);
        Arrays.fill(seen, false);
        for (int i = exits.size() - 1; i >= 0; i--) {
            int v = exits.get(i);
            if (!seen[v]) { components++; dfs(v, reverse, seen, null); }
        }
        System.out.println(components);
    }
}`,
    },
  }
]);
