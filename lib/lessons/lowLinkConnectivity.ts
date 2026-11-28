import { defineTopics } from "./define.ts";

export const lowLinkConnectivity = defineTopics([
  {
    "id": "bridges-articulation-points",
    "stage": 6,
    "title": "Bridges and articulation points",
    "objective": "Find single edges and vertices whose removal disconnects part of an undirected graph.",
    "prerequisites": "DFS, undirected adjacency lists, and discovery times.",
    "analogy": "Trace the support roads of a network. A shortcut from a branch to an older junction can keep the branch connected when one road or junction closes.",
    "explanation": "Assign each vertex a discovery time and compute low[v], the earliest discovery time reachable by going down the DFS subtree then taking one back edge. For tree edge v→child, low[child] greater than tin[v] makes the edge a bridge. For a nonroot v, low[child] at least tin[v] makes v an articulation vertex. A DFS root is an articulation vertex exactly when it has two or more DFS children.",
    "invariant": "After returning from a child, its low value summarizes every way to leave that subtree using a back edge. Skipping only the exact parent edge allows a parallel edge to act as a return route.",
    "pseudocode": "DFS(v, parent edge):\n  tin[v] = low[v] = next discovery time\n  for each incident edge other than the parent edge:\n    if neighbor unseen: DFS it and merge low values\n      count a bridge when low[child] > tin[v]\n      mark a nonroot articulation when low[child] ≥ tin[v]\n    otherwise lower low[v] with tin[neighbor]\n  mark a root articulation if it has multiple DFS children",
    "time": "O(n+m) because each adjacency entry is processed once",
    "space": "O(n+m) for the graph and DFS state",
    "trace": [
      [
        "Triangle 0—1—2—0 with tail 1—3",
        "The tail vertex has only one road to the rest of the graph."
      ],
      [
        "DFS records a return route inside the triangle",
        "A back edge lowers the earliest reachable discovery time of the triangle branch."
      ],
      [
        "Vertex 3 has no back edge",
        "Its low value exceeds the discovery time of 1, making 1—3 a bridge."
      ],
      [
        "Vertex 1 is a cut vertex",
        "Removing 1 disconnects 3. Removing another triangle vertex leaves the remaining roads connected."
      ]
    ],
    "misconception": "Skipping every edge whose endpoint is the parent hides parallel return edges and can report a false bridge.",
    "debug": "Use two parallel edges between the same two vertices. Neither individual edge is a bridge.",
    "fill": "Why is the test for a bridge strict while the nonroot articulation test also accepts equality?",
    "edgeCases": [
      "An isolated vertex contributes no bridges or articulation points.",
      "A self-loop never forms a DFS child.",
      "Analyze disconnected components by starting DFS at each unvisited vertex."
    ],
    "revision": "Why does the root need its own articulation rule?",
    "further": "Return the edge IDs and articulation vertex IDs instead of only their counts.",
    "quiz": {
      "question": "A child subtree has low equal to its nonroot parent’s discovery time. Is their tree edge tested as a bridge?",
      "answers": [
        "Yes",
        "No",
        "Only if the child is a leaf"
      ],
      "correct": 1,
      "feedback": "Equality means the subtree has a return route to the parent outside that tree edge. The parent itself can still be a cut vertex."
    },
    "practice": {
      "title": "Find critical roads and junctions",
      "description": "Count bridge edges and articulation vertices in an undirected multigraph.",
      "format": "Read n m, then m pairs u v. Print the bridge count and articulation count separated by one space.",
      "constraints": "1 ≤ n ≤ 120, 0 ≤ m ≤ 400, and 0 ≤ u,v < n. Parallel edges and self-loops are allowed.",
      "input": "4 4\n0 1\n1 2\n2 0\n1 3\n",
      "output": "1 1\n",
      "hints": [
        "Track edge IDs, so a parallel edge can act as a back edge.",
        "Count DFS children for a root’s articulation rule."
      ]
    },
    code: {
      c: `#include <stdio.h>
typedef struct { int v, next; } Arc;
static Arc adj[800];
static int first[120], tin[120], low[120], cut[120], tick, bridges;
static void dfs(int v, int parent_arc) {
    tin[v] = low[v] = ++tick;
    int children = 0;
    for (int arc = first[v]; arc != -1; arc = adj[arc].next) {
        if (parent_arc >= 0 && arc == (parent_arc ^ 1)) continue;
        int u = adj[arc].v;
        if (tin[u] == 0) {
            children++;
            dfs(u, arc);
            if (low[u] < low[v]) low[v] = low[u];
            if (low[u] > tin[v]) bridges++;
            if (parent_arc >= 0 && low[u] >= tin[v]) cut[v] = 1;
        } else if (tin[u] < low[v]) low[v] = tin[u];
    }
    if (parent_arc == -1 && children > 1) cut[v] = 1;
}
int main(void) {
    int n, m, articulation = 0;
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int v = 0; v < n; v++) first[v] = -1;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        adj[2 * i].v = v; adj[2 * i].next = first[u]; first[u] = 2 * i;
        adj[2 * i + 1].v = u; adj[2 * i + 1].next = first[v]; first[v] = 2 * i + 1;
    }
    for (int v = 0; v < n; v++) if (!tin[v]) dfs(v, -1);
    for (int v = 0; v < n; v++) articulation += cut[v];
    printf("%d %d\\n", bridges, articulation);
    return 0;
}`,
      python: `n, m = map(int, input().split())
graph = [[] for _ in range(n)]
for edge in range(m):
    u, v = map(int, input().split())
    graph[u].append((v, edge))
    graph[v].append((u, edge))
tin, low, cut = [0] * n, [0] * n, [False] * n
tick = bridges = 0

def dfs(v, parent_edge):
    global tick, bridges
    tick += 1
    tin[v] = low[v] = tick
    children = 0
    for u, edge in graph[v]:
        if edge == parent_edge:
            continue
        if tin[u] == 0:
            children += 1
            dfs(u, edge)
            low[v] = min(low[v], low[u])
            if low[u] > tin[v]:
                bridges += 1
            if parent_edge != -1 and low[u] >= tin[v]:
                cut[v] = True
        else:
            low[v] = min(low[v], tin[u])
    if parent_edge == -1 and children > 1:
        cut[v] = True

for vertex in range(n):
    if tin[vertex] == 0:
        dfs(vertex, -1)
print(bridges, sum(cut))`,
      java: `import java.util.ArrayList;
import java.util.Scanner;
class Main {
    record Arc(int v, int edge) {}
    static ArrayList<ArrayList<Arc>> graph = new ArrayList<>();
    static int[] tin, low;
    static boolean[] cut;
    static int tick, bridges;
    static void dfs(int v, int parentEdge) {
        tin[v] = low[v] = ++tick;
        int children = 0;
        for (Arc arc : graph.get(v)) {
            if (arc.edge() == parentEdge) continue;
            int u = arc.v();
            if (tin[u] == 0) {
                children++;
                dfs(u, arc.edge());
                low[v] = Math.min(low[v], low[u]);
                if (low[u] > tin[v]) bridges++;
                if (parentEdge != -1 && low[u] >= tin[v]) cut[v] = true;
            } else low[v] = Math.min(low[v], tin[u]);
        }
        if (parentEdge == -1 && children > 1) cut[v] = true;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), count = 0;
        tin = new int[n]; low = new int[n]; cut = new boolean[n];
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt();
            graph.get(u).add(new Arc(v, i)); graph.get(v).add(new Arc(u, i));
        }
        for (int i = 0; i < n; i++) if (tin[i] == 0) dfs(i, -1);
        for (boolean marked : cut) if (marked) count++;
        System.out.println(bridges + " " + count);
    }
}`,
    },
  }
]);
