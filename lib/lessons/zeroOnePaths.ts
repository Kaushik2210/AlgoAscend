import { defineTopics } from "./define.ts";

export const zeroOnePaths = defineTopics([
  {
    "id": "zero-one-bfs",
    "stage": 6,
    "title": "0–1 BFS with a deque",
    "objective": "Find shortest paths when every edge costs either zero or one.",
    "prerequisites": "BFS, relaxation, and deques.",
    "analogy": "Give a free transfer immediate attention and put a one-ticket trip behind the current round of free transfers.",
    "explanation": "Maintain a deque of tentative distances. Relax outgoing edges of the next vertex with a current entry. A zero-weight improvement joins the front at the same distance. A one-weight improvement joins the back at the next distance. Stale entries left by an earlier, worse estimate can be skipped.",
    "invariant": "At extraction, the smallest pending distance is at the front. The deque’s recorded distances span at most two consecutive values, so a zero-weight insertion at the front and a one-weight insertion at the back preserve order.",
    "pseudocode": "put (source,0) in the deque\nwhile deque not empty:\n  pop (u,d) from front\n  if d differs from dist[u]: skip this stale entry\n  for edge (u,v,w):\n    if d+w improves dist[v]:\n      update dist[v]\n      push (v,d+w) to front for w=0, otherwise to back",
    "time": "O(n+m) because each vertex’s outgoing edges are processed once from its final distance",
    "space": "O(n+m) for the adjacency lists, deque and distances",
    "trace": [
      [
        "Edges 0→1 (1), 0→2 (0), 2→1 (0)",
        "The source is at distance zero."
      ],
      [
        "Front: (2,0), back: (1,1)",
        "The free transfer to 2 precedes the paid route to 1."
      ],
      [
        "Relax 2→1 at distance 0",
        "Push (1,0) in front of its earlier distance-one entry."
      ],
      [
        "Pop (1,0), then skip (1,1)",
        "The best route to 1 takes two edges and costs zero."
      ]
    ],
    "misconception": "Marking a vertex as finished when it is first inserted can freeze a later-improvable distance.",
    "debug": "Use a direct one-cost edge whose destination can also be reached by two free edges.",
    "fill": "Which end receives a relaxation through an edge of weight one?",
    "edgeCases": [
      "All-zero edges can make a long path cost zero.",
      "An unreachable destination prints −1.",
      "Zero-weight cycles terminate because only strict improvements are inserted."
    ],
    "revision": "Why does plain FIFO BFS fail on this graph class?",
    "further": "Use general Dijkstra when weights include values beyond zero and one.",
    "quiz": {
      "question": "A current distance of 4 follows a zero-weight edge. Where does the improved entry go?",
      "answers": [
        "Front",
        "Back",
        "Discard it"
      ],
      "correct": 0,
      "feedback": "It still has distance 4, so it should be processed before entries at distance 5."
    },
    "practice": {
      "title": "Find the fewest paid transfers",
      "description": "Find the minimum number of paid links on a route in a directed relay network.",
      "format": "Read n m source target, then m lines u v w. Print the minimum cost or −1 if no route exists.",
      "constraints": "1 ≤ n ≤ 200, 0 ≤ m ≤ 400, vertices are zero-based, and w is 0 or 1.",
      "input": "3 3 0 1\n0 1 1\n0 2 0\n2 1 0\n",
      "output": "0\n",
      "hints": [
        "Put improved zero-cost moves at the front.",
        "Store the queued cost and skip outdated entries."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define INF 1000000000
#define CAP 402
typedef struct { int vertex, distance; } Entry;
typedef struct { int v, weight, next; } Edge;
int main(void) {
    int n, m, source, target, first[200], dist[200];
    Edge edges[400];
    Entry deque[CAP];
    if (scanf("%d%d%d%d", &n, &m, &source, &target) != 4) return 0;
    for (int i = 0; i < n; i++) { first[i] = -1; dist[i] = INF; }
    for (int i = 0; i < m; i++) {
        int u, v, weight;
        scanf("%d%d%d", &u, &v, &weight);
        Edge edge = {v, weight, first[u]};
        edges[i] = edge;
        first[u] = i;
    }
    int head = 0, tail = 1;
    dist[source] = 0;
    Entry start = {source, 0};
    deque[0] = start;
    while (head != tail) {
        Entry item = deque[head];
        head = (head + 1) % CAP;
        if (item.distance != dist[item.vertex]) continue;
        for (int i = first[item.vertex]; i != -1; i = edges[i].next) {
            Edge edge = edges[i];
            int candidate = item.distance + edge.weight;
            if (candidate >= dist[edge.v]) continue;
            dist[edge.v] = candidate;
            Entry updated = {edge.v, candidate};
            if (edge.weight == 0) {
                head = (head + CAP - 1) % CAP;
                deque[head] = updated;
            } else {
                deque[tail] = updated;
                tail = (tail + 1) % CAP;
            }
        }
    }
    printf("%d\\n", dist[target] == INF ? -1 : dist[target]);
    return 0;
}`,
      python: `from collections import deque
n, m, source, target = map(int, input().split())
adjacent = [[] for _ in range(n)]
for _ in range(m):
    u, v, weight = map(int, input().split())
    adjacent[u].append((v, weight))
inf = float("inf")
dist = [inf] * n
dist[source] = 0
queue = deque([(source, 0)])
while queue:
    u, cost = queue.popleft()
    if cost != dist[u]:
        continue
    for v, weight in adjacent[u]:
        candidate = cost + weight
        if candidate >= dist[v]:
            continue
        dist[v] = candidate
        if weight == 0:
            queue.appendleft((v, candidate))
        else:
            queue.append((v, candidate))
print(-1 if dist[target] == inf else dist[target])`,
      java: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;
class Main {
    record Edge(int v, int weight) {}
    record Entry(int vertex, int cost) {}
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), source = in.nextInt(), target = in.nextInt();
        var adjacent = new ArrayList<ArrayList<Edge>>();
        for (int i = 0; i < n; i++) adjacent.add(new ArrayList<>());
        for (int i = 0; i < m; i++) adjacent.get(in.nextInt()).add(new Edge(in.nextInt(), in.nextInt()));
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[source] = 0;
        var queue = new ArrayDeque<Entry>();
        queue.add(new Entry(source, 0));
        while (!queue.isEmpty()) {
            Entry item = queue.removeFirst();
            if (item.cost() != dist[item.vertex()]) continue;
            for (Edge edge : adjacent.get(item.vertex())) {
                int candidate = item.cost() + edge.weight();
                if (candidate >= dist[edge.v()]) continue;
                dist[edge.v()] = candidate;
                Entry updated = new Entry(edge.v(), candidate);
                if (edge.weight() == 0) queue.addFirst(updated);
                else queue.addLast(updated);
            }
        }
        System.out.println(dist[target] == Integer.MAX_VALUE ? -1 : dist[target]);
    }
}`,
    },
  }
]);
