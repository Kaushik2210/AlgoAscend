import { defineTopics } from "./define.ts";

export const graphTraversal = defineTopics([
  {
    "id": "dfs-connected-components",
    "stage": 6,
    "title": "Depth-first search and connected components",
    "objective": "Count connected components by starting depth-first search from every unvisited vertex.",
    "prerequisites": "Graph representation, arrays and stacks.",
    "analogy": "Explore one room and keep following its doors as far as possible. When that whole cluster is finished, choose a room never reached before.",
    "explanation": "An adjacency matrix records whether each undirected pair shares an edge. DFS follows each unvisited neighbor before returning. One DFS reaches exactly the connected component of its root. A scan over all vertices starts a fresh traversal whenever it finds an unvisited vertex.",
    "invariant": "A DFS marks only vertices reachable by a path from its root. When it finishes, every neighbor of every marked vertex in that traversal is marked, so no reachable vertex can remain outside the component.",
    "pseudocode": "components = 0\nfor vertex in vertices:\n  if vertex is unvisited:\n    components += 1\n    dfs(vertex)\ndfs(u):\n  mark u\n  for v adjacent to u:\n    if v is unvisited: dfs(v)",
    "time": "O(V² + E) with the displayed matrix, or O(V+E) with adjacency lists",
    "space": "O(V²) matrix and O(V) recursion stack. The Python program also buffers O(E) edge tokens",
    "trace": [
      [
        "vertices 0..4, edges 0—2, 2—1, 3—4",
        "No marks are set, so index zero starts the first DFS."
      ],
      [
        "DFS 0→2→1",
        "These vertices become marked while following the first cluster."
      ],
      [
        "Scan marked indexes 1 and 2",
        "Their component was already counted."
      ],
      [
        "DFS 3→4 | count=2",
        "The second DFS reaches the remaining cluster."
      ]
    ],
    "misconception": "A single DFS from vertex zero says nothing about isolated clusters it cannot reach.",
    "debug": "Use a graph with zero edges. Every vertex should start one new traversal.",
    "fill": "When should the outer loop increment the component count?",
    "edgeCases": [
      "An isolated vertex is a component.",
      "Repeated edges do not alter reachability.",
      "Self-loops do not create a new traversal."
    ],
    "revision": "What fact proves you cannot discover a third vertex from a completed component later?",
    "further": "Switch to adjacency lists and label each vertex with its component ID.",
    "quiz": {
      "question": "If a graph has four vertices and no edges, how many DFS roots does the scan start?",
      "answers": [
        "0",
        "1",
        "4"
      ],
      "correct": 2,
      "feedback": "Each isolated vertex remains unvisited until it becomes its own DFS root."
    },
    "practice": {
      "title": "Count separated relay networks",
      "description": "Count the connected components of an undirected relay graph.",
      "format": "Read n m, followed by m pairs of zero-based vertices. Print the number of connected components.",
      "constraints": "1 ≤ n ≤ 100, 0 ≤ m ≤ 400. Self-loops and repeated edges are allowed.",
      "input": "5 3\n0 2\n2 1\n3 4\n",
      "output": "2\n",
      "hints": [
        "Insert each edge in both directions.",
        "Scan every vertex after marking a full component."
      ]
    },
    code:{
      c: `#include <stdio.h>
static int n, edge[100][100], seen[100];
static void visit(int vertex) {
    seen[vertex] = 1;
    for (int other = 0; other < n; other++) {
        if (edge[vertex][other] && !seen[other]) visit(other);
    }
}
int main(void) {
    int m, count = 0;
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int i = 0; i < m; i++) {
        int a, b;
        scanf("%d%d", &a, &b);
        edge[a][b] = edge[b][a] = 1;
    }
    for (int i = 0; i < n; i++) {
        if (!seen[i]) { count++; visit(i); }
    }
    printf("%d\\n", count);
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, m = next(tokens), next(tokens)
edge = [[False] * n for _ in range(n)]
for _ in range(m):
    a, b = next(tokens), next(tokens)
    edge[a][b] = edge[b][a] = True
seen = [False] * n

def visit(vertex):
    seen[vertex] = True
    for other, linked in enumerate(edge[vertex]):
        if linked and not seen[other]:
            visit(other)

count = 0
for vertex in range(n):
    if not seen[vertex]:
        count += 1
        visit(vertex)
print(count)`,
      java: `import java.util.Scanner;
class Main {
    static boolean[][] edge;
    static boolean[] seen;
    static void visit(int vertex) {
        seen[vertex] = true;
        for (int other = 0; other < seen.length; other++) {
            if (edge[vertex][other] && !seen[other]) visit(other);
        }
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), count = 0;
        seen = new boolean[n];
        edge = new boolean[n][n];
        for (int i = 0; i < m; i++) {
            int a = in.nextInt(), b = in.nextInt();
            edge[a][b] = edge[b][a] = true;
        }
        for (int i = 0; i < n; i++) {
            if (!seen[i]) { count++; visit(i); }
        }
        System.out.println(count);
    }
}`,
    },
  },
  {
    "id": "topological-sorting",
    "stage": 6,
    "title": "Topological sorting and directed cycles",
    "objective": "Order prerequisites by repeatedly choosing an unblocked vertex.",
    "prerequisites": "Directed edges, adjacency matrices and indegrees.",
    "analogy": "Choose the smallest-numbered job whose prerequisites are all finished, then remove that job from later checklists.",
    "explanation": "Count each vertex’s incoming edges. Repeatedly choose a vertex of indegree zero, emit it, and reduce its outgoing neighbors’ indegrees. Selecting the smallest available index yields the lexicographically smallest valid order. If unfinished work remains and every remaining vertex has incoming edges, following those edges backward must eventually revisit a vertex, proving a cycle.",
    "invariant": "The indegree of an unfinished vertex is exactly its number of prerequisites among unfinished vertices. Adding a zero-indegree vertex therefore respects all incoming edges.",
    "pseudocode": "compute indegrees\nrepeat n times:\n  choose smallest unfinished vertex of indegree 0\n  if none exists: return CYCLE\n  append chosen vertex and mark it finished\n  decrement indegree for each remaining outgoing neighbor\nprint the order",
    "time": "O(V² + E) time for matrix storage and linear selection",
    "space": "O(V²) for the matrix. The Python program also buffers O(E) input tokens",
    "trace": [
      [
        "edges 1→2, 0→2, 2→3",
        "Initial indegrees are [0, 0, 2, 1]."
      ],
      [
        "emit 0",
        "Both 0 and 1 were ready. Choose the smaller index and drop indegree(2) to one."
      ],
      [
        "emit 1, then 2",
        "Emitting 1 makes 2 ready. Emitting 2 then frees 3."
      ],
      [
        "emit 3 | order [0,1,2,3]",
        "Every job was emitted once and prerequisites precede their dependents."
      ]
    ],
    "misconception": "A zero indegree must be evaluated in the remaining graph. A vertex initially blocked may become ready later.",
    "debug": "Try a ready vertex plus a separate two-vertex cycle. A partial order is insufficient, so print CYCLE.",
    "fill": "When removing u, which adjacent vertices have their indegrees decremented?",
    "edgeCases": [
      "A self-loop creates a cycle.",
      "Duplicate prerequisite pairs count once.",
      "Independent vertices appear in ascending order unless a smaller blocked vertex becomes ready."
    ],
    "revision": "Why does the lack of a ready vertex prove a cycle exists among unfinished vertices?",
    "further": "Use a minimum heap of ready vertices to speed up selection for a sparse graph.",
    "quiz": {
      "question": "When an edge u→v is removed because u finished, what changes?",
      "answers": [
        "The outdegree of v",
        "The indegree of v",
        "The indegree of u increases"
      ],
      "correct": 1,
      "feedback": "The edge was incoming to v. Finishing u removes one of v’s remaining prerequisites."
    },
    "practice": {
      "title": "Schedule build prerequisites",
      "description": "Print the lexicographically smallest order satisfying every dependency, or report a cycle.",
      "format": "Read n m, then m edges u v indicating u precedes v. Print n zero-based IDs separated by spaces, or CYCLE.",
      "constraints": "1 ≤ n ≤ 100, 0 ≤ m ≤ 400. Duplicate edges and self-loops are allowed.",
      "input": "4 3\n1 2\n0 2\n2 3\n",
      "output": "0 1 2 3\n",
      "hints": [
        "Keep a count of prerequisites still unfinished.",
        "Run a fresh scan for the smallest ready vertex after every removal."
      ]
    },
    code:{
      c: `#include <stdio.h>
static int edge[100][100], indegree[100], order[100];
int main(void) {
    int n, m;
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        if (!edge[u][v]) { edge[u][v] = 1; indegree[v]++; }
    }
    for (int step = 0; step < n; step++) {
        int u = 0;
        while (u < n && indegree[u] != 0) u++;
        if (u == n) { puts("CYCLE"); return 0; }
        order[step] = u;
        indegree[u] = -1;
        for (int v = 0; v < n; v++) if (edge[u][v]) indegree[v]--;
    }
    for (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", order[i]);
    puts("");
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, m = next(tokens), next(tokens)
edge = [[False] * n for _ in range(n)]
indegree = [0] * n
for _ in range(m):
    u, v = next(tokens), next(tokens)
    if not edge[u][v]:
        edge[u][v] = True
        indegree[v] += 1
order = []
for _ in range(n):
    u = next((v for v in range(n) if indegree[v] == 0), None)
    if u is None:
        print("CYCLE")
        break
    order.append(u)
    indegree[u] = -1
    for v, linked in enumerate(edge[u]):
        if linked:
            indegree[v] -= 1
else:
    print(*order)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt();
        boolean[][] edge = new boolean[n][n];
        int[] indegree = new int[n];
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt();
            if (!edge[u][v]) { edge[u][v] = true; indegree[v]++; }
        }
        var out = new StringBuilder();
        for (int step = 0; step < n; step++) {
            int u = 0;
            while (u < n && indegree[u] != 0) u++;
            if (u == n) { System.out.println("CYCLE"); return; }
            if (step > 0) out.append(' ');
            out.append(u);
            indegree[u] = -1;
            for (int v = 0; v < n; v++) if (edge[u][v]) indegree[v]--;
        }
        System.out.println(out);
    }
}`,
    },
  }
]);
