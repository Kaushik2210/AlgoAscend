import { defineTopics } from "./define.ts";

export const graphColoring = defineTopics([
  {
    "id": "bipartite-graphs",
    "stage": 6,
    "title": "Bipartite graphs and two-coloring",
    "objective": "Decide whether an undirected graph can be split into two groups with every edge crossing groups.",
    "prerequisites": "Breadth-first search and connected components.",
    "analogy": "Assign neighboring buildings opposite colors. A contradiction reveals a cycle with an odd number of edges.",
    "explanation": "For each unseen component, assign its start color zero and use BFS to give each unseen neighbor the opposite color. Whenever an edge joins equal colors, the coloring is impossible. Colors are forced along paths up to swapping the two labels within each component.",
    "invariant": "Every queued vertex already has an assigned color. Every discovery edge joins different colors. A same-color edge contradicts the opposite-color requirement for at least one edge along the implied odd cycle.",
    "pseudocode": "for each uncolored source:\n  color[source]=0; enqueue source\n  while queue is not empty:\n    u=dequeue\n    for each neighbor v:\n      if uncolored: color[v]=1−color[u]; enqueue v\n      else if color[v]==color[u]: return NO\nreturn YES",
    "time": "O(V²+E) with the matrix shown, and O(V+E) with adjacency lists",
    "space": "O(V²) for the matrix and O(V) for colors and queue. The Python program also buffers O(E) edge tokens",
    "trace": [
      [
        "Edges 0—1, 1—2, 2—0",
        "The three vertices form a triangle."
      ],
      [
        "Color 0 blue",
        "Use 0 for the first group and 1 for the other."
      ],
      [
        "Color 1 and 2 gold",
        "Both touch vertex zero, so both receive the opposite color."
      ],
      [
        "Inspect edge 1—2 → conflict",
        "Both endpoints are gold, so no valid coloring exists."
      ]
    ],
    "misconception": "Starting BFS in one component can miss an odd cycle in a disconnected component.",
    "debug": "Use one isolated vertex followed by a separate triangle.",
    "fill": "If color[u] is zero, what color must each of its neighbors have?",
    "edgeCases": [
      "Isolated vertices are allowed.",
      "A self-loop fails immediately.",
      "Repeating an edge does not affect feasibility."
    ],
    "revision": "Why does changing the starting color fail to repair the contradiction?",
    "further": "Store parents during BFS and reconstruct an odd cycle after finding a conflict.",
    "quiz": {
      "question": "Can a triangle be divided into two groups with all edges crossing?",
      "answers": [
        "Yes",
        "No",
        "Only if started at a different vertex"
      ],
      "correct": 1,
      "feedback": "The start forces both other vertices into the same group. Their shared edge violates the split."
    },
    "practice": {
      "title": "Split the relay channels",
      "description": "Assign every relay to one of two channels so adjacent relays use different channels.",
      "format": "Read n m, followed by m undirected edges as zero-based pairs. Print YES if a valid assignment exists, otherwise NO.",
      "constraints": "1 ≤ n ≤ 100, 0 ≤ m ≤ 400. Self-loops and duplicate edges are allowed.",
      "input": "3 3\n0 1\n1 2\n2 0\n",
      "output": "NO\n",
      "hints": [
        "Color nodes when enqueuing them.",
        "Start from every uncolored component."
      ]
    },
    code:{
      c: `#include <stdio.h>
static int edge[100][100];
int main(void) {
    int n, m, color[100], queue[100];
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int i = 0; i < n; i++) color[i] = -1;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        edge[u][v] = edge[v][u] = 1;
    }
    for (int start = 0; start < n; start++) {
        if (color[start] >= 0) continue;
        int head = 0, tail = 0;
        color[start] = 0;
        queue[tail++] = start;
        while (head < tail) {
            int u = queue[head++];
            for (int v = 0; v < n; v++) {
                if (!edge[u][v]) continue;
                if (color[v] < 0) {
                    color[v] = 1 - color[u];
                    queue[tail++] = v;
                } else if (color[v] == color[u]) { puts("NO"); return 0; }
            }
        }
    }
    puts("YES");
    return 0;
}`,
      python: `from collections import deque
import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, m = next(tokens), next(tokens)
edge = [[False] * n for _ in range(n)]
for _ in range(m):
    u, v = next(tokens), next(tokens)
    edge[u][v] = edge[v][u] = True

def bipartite():
    color = [-1] * n
    for start in range(n):
        if color[start] >= 0:
            continue
        color[start] = 0
        queue = deque([start])
        while queue:
            u = queue.popleft()
            for v, linked in enumerate(edge[u]):
                if not linked:
                    continue
                if color[v] < 0:
                    color[v] = 1 - color[u]
                    queue.append(v)
                elif color[v] == color[u]:
                    return False
    return True

print("YES" if bipartite() else "NO")`,
      java: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt();
        boolean[][] edge = new boolean[n][n];
        int[] color = new int[n];
        Arrays.fill(color, -1);
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt();
            edge[u][v] = edge[v][u] = true;
        }
        var queue = new ArrayDeque<Integer>();
        for (int start = 0; start < n; start++) {
            if (color[start] >= 0) continue;
            color[start] = 0;
            queue.addLast(start);
            while (!queue.isEmpty()) {
                int u = queue.removeFirst();
                for (int v = 0; v < n; v++) {
                    if (!edge[u][v]) continue;
                    if (color[v] < 0) {
                        color[v] = 1 - color[u];
                        queue.addLast(v);
                    } else if (color[v] == color[u]) { System.out.println("NO"); return; }
                }
            }
        }
        System.out.println("YES");
    }
}`,
    },
  }
]);
