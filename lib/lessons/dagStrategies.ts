import { defineTopics } from "./define.ts";

export const dagStrategies = defineTopics([
  {
    "id": "dag-dp",
    "stage": 9,
    "title": "Dynamic programming on directed acyclic graphs",
    "objective": "Count routes by processing every dependency before its destinations.",
    "prerequisites": "Directed acyclic graphs, topological order, and modular addition.",
    "analogy": "Deliver tally cards along one-way streets that always lead forward. Every incoming card arrives before the destination sends its own total onward.",
    "explanation": "In topological order all predecessors appear before a vertex. Start the source with one empty route. Push each vertex’s count along its outgoing edges. Each route to a nonsource vertex has exactly one final edge, so incoming contributions add without double-counting. The exercise supplies vertex indices in topological order.",
    "invariant": "Immediately before processing vertex v, ways[v] counts every route from the source to v, modulo the requested modulus.",
    "pseudocode": "ways[source]=1\nfor u in topological order:\n  for edge u→v:\n    ways[v]=(ways[v]+ways[u]) mod M\nprint ways[target]",
    "time": "O(n+m) when topological order is known",
    "space": "O(n+m) for adjacency lists and states",
    "trace": [
      [
        "Edges 0→1, 0→2, 1→3, 2→3",
        "Only vertex 0 has an initial count."
      ],
      [
        "Process 0",
        "Vertices 1 and 2 each receive one route."
      ],
      [
        "Process 1 then 2",
        "Both contribute to 3, using different final edges."
      ],
      [
        "ways[3]=2",
        "The two complete routes run through different middle vertices."
      ]
    ],
    "misconception": "Processing vertices in arbitrary order can forward a partial count before some predecessors have contributed.",
    "debug": "Use a disconnected source and a DAG where two different predecessors feed the target.",
    "fill": "Which order ensures every predecessor contributes before a vertex is processed?",
    "edgeCases": [
      "Source equal to target gives one empty route.",
      "Unreachable target stays zero.",
      "Parallel edges count as distinct choices in this exercise."
    ],
    "revision": "What changes if the requested aggregate is the maximum score along a route?",
    "further": "Produce a topological order first when the input’s vertex IDs are arbitrary.",
    "quiz": {
      "question": "Why can a vertex send its count just once?",
      "answers": [
        "It has at most one predecessor",
        "All predecessors have already been processed",
        "Every edge has equal cost"
      ],
      "correct": 1,
      "feedback": "Topological order makes the count final before its outgoing edges are visited."
    },
    "practice": {
      "title": "Count routes through a forward network",
      "description": "Count distinct edge routes from a source to a target in a topologically numbered graph.",
      "format": "Read n m source target, then m lines u v with u<v. Print the count modulo 1,000,000,007.",
      "constraints": "1 ≤ n ≤ 300, 0 ≤ m ≤ 600. Vertices are zero-based. Parallel edges are distinct.",
      "input": "4 4 0 3\n0 1\n0 2\n1 3\n2 3\n",
      "output": "2\n",
      "hints": [
        "Store outgoing edges by their source.",
        "An empty route contributes one at the source."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define MOD 1000000007
int main(void) {
    int n, m, source, target, head[300], next[600], end[600], ways[300] = {0};
    if (scanf("%d%d%d%d", &n, &m, &source, &target) != 4) return 0;
    for (int v = 0; v < n; v++) head[v] = -1;
    for (int e = 0; e < m; e++) {
        int u;
        scanf("%d%d", &u, &end[e]);
        next[e] = head[u]; head[u] = e;
    }
    ways[source] = 1;
    for (int u = 0; u < n; u++) for (int e = head[u]; e != -1; e = next[e]) {
        int v = end[e];
        ways[v] = (ways[v] + ways[u]) % MOD;
    }
    printf("%d\\n", ways[target]);
    return 0;
}`,
      python: `n, m, source, target = map(int, input().split())
graph = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
ways = [0] * n
ways[source] = 1
for u in range(n):
    for v in graph[u]:
        ways[v] = (ways[v] + ways[u]) % 1_000_000_007
print(ways[target])`,
      java: `import java.util.ArrayList;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), source = in.nextInt(), target = in.nextInt();
        var graph = new ArrayList<ArrayList<Integer>>();
        for (int v = 0; v < n; v++) graph.add(new ArrayList<>());
        for (int e = 0; e < m; e++) graph.get(in.nextInt()).add(in.nextInt());
        int[] ways = new int[n];
        ways[source] = 1;
        for (int u = 0; u < n; u++) for (int v : graph.get(u)) ways[v] = (ways[v] + ways[u]) % 1_000_000_007;
        System.out.println(ways[target]);
    }
}`,
    },
  }
]);
