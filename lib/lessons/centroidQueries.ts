import { defineTopics } from "./define.ts";

export const centroidQueries = defineTopics([
  {
    "id": "centroid-decomposition",
    "stage": 11,
    "title": "Centroid decomposition for nearest marked vertices",
    "objective": "Precompute centroid ancestors to answer nearest-marked queries while new marks arrive.",
    "prerequisites": "Trees, subtree sizes, and DFS distances.",
    "analogy": "Divide a campus at a central station, then repeat within each smaller district. Every station keeps the distance to the nearest marked relay in its district.",
    "explanation": "A centroid is a vertex whose removal leaves no component larger than half the current size. Compute distances from it to all vertices in its component, remove it, and recursively decompose the remaining components. On marking a vertex, update the best known distance at each of its centroid ancestors. On querying, combine those best distances with the query vertex’s distance to the same centroid.",
    "invariant": "For each centroid, best[c] is the minimum recorded distance to a marked vertex in its decomposition component. A candidate path via a shared centroid never underestimates the true minimum. For a nearest marked vertex, the first centroid that separates it from the query vertex lies on their actual path, so that candidate is exact.",
    "pseudocode": "decompose a component at its centroid\nrecord (centroid, distance) for each vertex before removing the centroid\nmark(v): lower best[c] using each distance from v to a recorded centroid c\nquery(v): take the minimum of dist(v,c)+best[c] across its recorded centroids",
    "time": "O(n log(n+1)) preprocessing and O(log(n+1)) per mark or query",
    "space": "O(n log(n+1)) for the recorded centroid distances",
    "trace": [
      [
        "Path 0—1—2—3—4",
        "The centroid is 2. Removing it leaves two components of size two."
      ],
      [
        "Mark vertex 1",
        "At centroid 2 record a best distance of one. Also update the centroid of the left component."
      ],
      [
        "Query vertex 4",
        "Its distance to 2 is two, giving route length three to the marked vertex."
      ],
      [
        "Mark vertex 4 and query 3",
        "The smaller right component provides a candidate of one, which beats the route through 2."
      ]
    ],
    "misconception": "A centroid minimizes the largest remaining component by size. It is not generally the center of every longest-path criterion.",
    "debug": "Query before any mark, mark the same vertex twice, and query two vertices in one small decomposition component.",
    "fill": "Which centroid makes the distance calculation exact for a pair separated by the decomposition?",
    "edgeCases": [
      "Before any mark, return −1.",
      "Repeated marking is harmless.",
      "Querying a marked vertex returns zero."
    ],
    "revision": "Why can a vertex belong to only logarithmically many recorded centroid components?",
    "further": "Support unmarking by maintaining a multiset of marked distances at each centroid.",
    "quiz": {
      "question": "Which quantity is stored at each centroid to answer nearest-marked queries?",
      "answers": [
        "The largest marked distance",
        "The smallest marked distance in its component",
        "The first marked vertex’s ID"
      ],
      "correct": 1,
      "feedback": "The query needs the cheapest possible route through that centroid."
    },
    "practice": {
      "title": "Find the nearest active relay",
      "description": "Activate relay vertices in a tree and query the distance to the closest active relay.",
      "format": "Read n q, then parents of vertices 1 through n−1. Operation 1 v marks v; operation 2 v prints the nearest marked distance or −1 if none.",
      "constraints": "1 ≤ n ≤ 250, 1 ≤ q ≤ 300, parent of i belongs to 0…i−1, and 0 ≤ v < n. All vertices start unmarked.",
      "input": "5 5\n0 1 2 3\n2 4\n1 1\n2 4\n1 4\n2 3\n",
      "output": "-1\n3\n1\n",
      "hints": [
        "Record every vertex’s distance to the current centroid before removing it.",
        "Cache the best distance from each centroid to any marked vertex in its component."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define INF 1000000000
static int first[250], other[500], edge_next[500], edges;
static int size[250], removed[250], count[250], centroids[250][9], distances[250][9], best[250];
static void connect(int u, int v) {
    other[edges] = v; edge_next[edges] = first[u]; first[u] = edges++;
}
static int measure(int v, int parent) {
    size[v] = 1;
    for (int e = first[v]; e != -1; e = edge_next[e]) {
        int u = other[e];
        if (u != parent && !removed[u]) size[v] += measure(u, v);
    }
    return size[v];
}
static int centroid(int v, int parent, int total) {
    for (int e = first[v]; e != -1; e = edge_next[e]) {
        int u = other[e];
        if (u != parent && !removed[u] && size[u] > total / 2) return centroid(u, v, total);
    }
    return v;
}
static void record_distances(int v, int parent, int distance, int c) {
    int i = count[v]++;
    centroids[v][i] = c; distances[v][i] = distance;
    for (int e = first[v]; e != -1; e = edge_next[e]) {
        int u = other[e];
        if (u != parent && !removed[u]) record_distances(u, v, distance + 1, c);
    }
}
static void decompose(int entry) {
    int total = measure(entry, -1);
    int c = centroid(entry, -1, total);
    record_distances(c, -1, 0, c);
    removed[c] = 1;
    for (int e = first[c]; e != -1; e = edge_next[e]) {
        if (!removed[other[e]]) decompose(other[e]);
    }
}
int main(void) {
    int n, q;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) { first[i] = -1; best[i] = INF; }
    for (int v = 1; v < n; v++) {
        int p; scanf("%d", &p); connect(v, p); connect(p, v);
    }
    decompose(0);
    while (q--) {
        int kind, v, answer = INF;
        scanf("%d%d", &kind, &v);
        for (int i = 0; i < count[v]; i++) {
            int c = centroids[v][i], distance = distances[v][i];
            if (kind == 1 && distance < best[c]) best[c] = distance;
            if (kind == 2 && best[c] + distance < answer) answer = best[c] + distance;
        }
        if (kind == 2) printf("%d\\n", answer == INF ? -1 : answer);
    }
    return 0;
}`,
      python: `n, q = map(int, input().split())
parents = list(map(int, input().split())) if n > 1 else []
tree = [[] for _ in range(n)]
for v, parent in enumerate(parents, 1):
    tree[v].append(parent)
    tree[parent].append(v)
size, removed, paths = [0] * n, [False] * n, [[] for _ in range(n)]

def measure(v, parent):
    size[v] = 1
    for u in tree[v]:
        if u != parent and not removed[u]:
            size[v] += measure(u, v)
    return size[v]

def centroid(v, parent, total):
    for u in tree[v]:
        if u != parent and not removed[u] and size[u] > total // 2:
            return centroid(u, v, total)
    return v

def record(v, parent, distance, c):
    paths[v].append((c, distance))
    for u in tree[v]:
        if u != parent and not removed[u]:
            record(u, v, distance + 1, c)

def decompose(entry):
    total = measure(entry, -1)
    c = centroid(entry, -1, total)
    record(c, -1, 0, c)
    removed[c] = True
    for u in tree[c]:
        if not removed[u]:
            decompose(u)

decompose(0)
inf = float("inf")
best = [inf] * n
for _ in range(q):
    kind, vertex = map(int, input().split())
    if kind == 1:
        for c, distance in paths[vertex]:
            best[c] = min(best[c], distance)
    else:
        answer = min(best[c] + distance for c, distance in paths[vertex])
        print(-1 if answer == inf else answer)`,
      java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;
class Main {
    record Step(int centroid, int distance) {}
    static ArrayList<ArrayList<Integer>> tree = new ArrayList<>();
    static ArrayList<ArrayList<Step>> paths = new ArrayList<>();
    static int[] size;
    static boolean[] removed;
    static int measure(int v, int parent) {
        size[v] = 1;
        for (int u : tree.get(v)) if (u != parent && !removed[u]) size[v] += measure(u, v);
        return size[v];
    }
    static int centroid(int v, int parent, int total) {
        for (int u : tree.get(v)) {
            if (u != parent && !removed[u] && size[u] > total / 2) return centroid(u, v, total);
        }
        return v;
    }
    static void recordDistances(int v, int parent, int distance, int c) {
        paths.get(v).add(new Step(c, distance));
        for (int u : tree.get(v)) if (u != parent && !removed[u]) recordDistances(u, v, distance + 1, c);
    }
    static void decompose(int entry) {
        int total = measure(entry, -1);
        int c = centroid(entry, -1, total);
        recordDistances(c, -1, 0, c);
        removed[c] = true;
        for (int u : tree.get(c)) if (!removed[u]) decompose(u);
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), inf = 1_000_000_000;
        size = new int[n]; removed = new boolean[n];
        int[] best = new int[n];
        Arrays.fill(best, inf);
        for (int v = 0; v < n; v++) { tree.add(new ArrayList<>()); paths.add(new ArrayList<>()); }
        for (int v = 1; v < n; v++) {
            int parent = in.nextInt();
            tree.get(v).add(parent); tree.get(parent).add(v);
        }
        decompose(0);
        for (int i = 0; i < q; i++) {
            int kind = in.nextInt(), v = in.nextInt(), answer = inf;
            for (Step step : paths.get(v)) {
                int c = step.centroid(), distance = step.distance();
                if (kind == 1) best[c] = Math.min(best[c], distance);
                else answer = Math.min(answer, best[c] + distance);
            }
            if (kind == 2) System.out.println(answer == inf ? -1 : answer);
        }
    }
}`,
    },
  }
]);
