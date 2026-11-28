import { defineTopics } from "./define.ts";

export const heavyLightPaths = defineTopics([
  {
    "id": "heavy-light-decomposition",
    "stage": 11,
    "title": "Heavy-light decomposition for path sums",
    "objective": "Turn an arbitrary tree path into a logarithmic number of array ranges, with point updates.",
    "prerequisites": "Rooted trees, subtree sizes, and Fenwick trees.",
    "analogy": "Use express routes along the largest branches. When you need to switch routes, jump across the transfer junction to the next express route.",
    "explanation": "Mark each vertex’s largest child subtree as its heavy child. Heavy edges form chains. Give vertices on each chain consecutive array positions and maintain their values in a Fenwick tree. While two path endpoints occupy different chains, consume the segment from the deeper chain head to its endpoint and jump to the head’s parent. Finish within the common chain.",
    "invariant": "After removing a deeper chain segment, its sum is included exactly once and the endpoints bound the unprocessed part of the path. A light edge heads into a subtree at most half its parent’s size, so a path crosses only logarithmically many chains.",
    "pseudocode": "compute subtree sizes and mark the largest child of each vertex\nassign consecutive positions along each heavy chain; build a Fenwick tree\nwhile heads differ:\n  choose the endpoint with the deeper head\n  add that chain interval and move the endpoint to its head’s parent\nadd the remaining within-chain interval",
    "time": "O(n log(n+1)) setup with Fenwick inserts, O(log(n+1)) assignment, and O(log²(n+1)) path sum",
    "space": "O(n) for chain metadata and the Fenwick tree",
    "trace": [
      [
        "Parents of 1…4 are [0,0,1,1] | values [2,4,1,7,3]",
        "The biggest child subtree of 0 is rooted at 1. A possible heavy chain is 0→1→3."
      ],
      [
        "Query path from 3 to 2",
        "Vertex 2 heads its own chain. Take its value 1 and jump to its parent 0."
      ],
      [
        "Both remaining endpoints share the main chain",
        "The interval 0→1→3 contributes 2+4+7 = 13."
      ],
      [
        "Total 14, then assign vertex 1 to −2",
        "Only one base array position changes. The next 3-to-2 sum becomes 8."
      ]
    ],
    "misconception": "Choose which endpoint to move using the depth of its chain head. The endpoint’s own depth can select the wrong chain.",
    "debug": "Test one endpoint that is the common ancestor and another pair whose path crosses several small chains.",
    "fill": "After consuming a chain segment up to its head, which vertex is the next endpoint?",
    "edgeCases": [
      "Include both endpoints exactly once.",
      "A vertex-to-itself query returns its stored value.",
      "Equal-size children can be broken in either order."
    ],
    "revision": "Why does crossing a light edge reduce the remaining subtree scale by at least half when viewed from the root?",
    "further": "Store edge weights at their deeper endpoint and omit the lowest common ancestor from the final range.",
    "quiz": {
      "question": "What does the algorithm do after consuming the deeper chain’s range?",
      "answers": [
        "Jump to the chain head’s parent",
        "Jump straight to the root",
        "Swap just the left and right positions"
      ],
      "correct": 0,
      "feedback": "The head was just included. Its parent starts the remainder of the path."
    },
    "practice": {
      "title": "Maintain totals along relay paths",
      "description": "Set individual relay values and query their inclusive sums along tree paths.",
      "format": "Read n q, then n values, then parents for vertices 1 through n−1. Operation 1 u value changes one relay. Operation 2 u v prints the sum on the path from u to v.",
      "constraints": "1 ≤ n ≤ 300, 1 ≤ q ≤ 250, |value| ≤ 10⁵, and each parent of i belongs to 0…i−1. Query vertices are zero-based.",
      "input": "5 4\n2 4 1 7 3\n0 0 1 1\n2 3 2\n1 1 -2\n2 3 2\n2 4 4\n",
      "output": "14\n8\n3\n",
      "hints": [
        "Lay out a chain by visiting its heavy child immediately.",
        "Use the depth of each head when selecting the chain to consume."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int n, values[300], parent[300], depth[300], sizes[300], heavy[300], head[300], pos[300], bit[301];
static void add(int i, int delta) {
    for (i++; i <= n; i += i & -i) bit[i] += delta;
}
static int prefix(int end) {
    int total = 0;
    for (; end > 0; end -= end & -end) total += bit[end];
    return total;
}
static int path_sum(int a, int b) {
    int total = 0;
    while (head[a] != head[b]) {
        if (depth[head[a]] < depth[head[b]]) { int swap = a; a = b; b = swap; }
        total += prefix(pos[a] + 1) - prefix(pos[head[a]]);
        a = parent[head[a]];
    }
    if (pos[a] > pos[b]) { int swap = a; a = b; b = swap; }
    return total + prefix(pos[b] + 1) - prefix(pos[a]);
}
int main(void) {
    int q, cursor = 0;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]); sizes[i] = 1; heavy[i] = -1;
    }
    for (int i = 1; i < n; i++) {
        scanf("%d", &parent[i]); depth[i] = depth[parent[i]] + 1;
    }
    for (int i = n - 1; i > 0; i--) {
        int p = parent[i];
        sizes[p] += sizes[i];
        if (heavy[p] == -1 || sizes[i] >= sizes[heavy[p]]) heavy[p] = i;
    }
    for (int i = 0; i < n; i++) {
        if (i > 0 && heavy[parent[i]] == i) continue;
        for (int v = i; v != -1; v = heavy[v]) {
            head[v] = i; pos[v] = cursor++; add(pos[v], values[v]);
        }
    }
    while (q--) {
        int kind, a, b;
        scanf("%d%d%d", &kind, &a, &b);
        if (kind == 1) { add(pos[a], b - values[a]); values[a] = b; }
        else printf("%d\\n", path_sum(a, b));
    }
    return 0;
}`,
      python: `n, q = map(int, input().split())
values = list(map(int, input().split()))
parent = [0] + list(map(int, input().split())) if n > 1 else [0]
depth, sizes, heavy = [0] * n, [1] * n, [-1] * n
head, pos, bit = [0] * n, [0] * n, [0] * (n + 1)

def add(i, delta):
    i += 1
    while i <= n:
        bit[i] += delta
        i += i & -i

def prefix(end):
    total = 0
    while end:
        total += bit[end]
        end -= end & -end
    return total

for i in range(1, n):
    depth[i] = depth[parent[i]] + 1
for i in range(n - 1, 0, -1):
    p = parent[i]
    sizes[p] += sizes[i]
    if heavy[p] == -1 or sizes[i] >= sizes[heavy[p]]:
        heavy[p] = i
cursor = 0
for i in range(n):
    if i > 0 and heavy[parent[i]] == i:
        continue
    v = i
    while v != -1:
        head[v], pos[v] = i, cursor
        add(cursor, values[v])
        cursor += 1
        v = heavy[v]

def path_sum(a, b):
    total = 0
    while head[a] != head[b]:
        if depth[head[a]] < depth[head[b]]:
            a, b = b, a
        total += prefix(pos[a] + 1) - prefix(pos[head[a]])
        a = parent[head[a]]
    lo, hi = sorted((pos[a], pos[b]))
    return total + prefix(hi + 1) - prefix(lo)

for _ in range(q):
    kind, a, b = map(int, input().split())
    if kind == 1:
        add(pos[a], b - values[a])
        values[a] = b
    else:
        print(path_sum(a, b))`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    static int[] parent, depth, head, pos, bit;
    static void add(int i, int delta) {
        for (i++; i < bit.length; i += i & -i) bit[i] += delta;
    }
    static int prefix(int end) {
        int total = 0;
        for (; end > 0; end -= end & -end) total += bit[end];
        return total;
    }
    static int pathSum(int a, int b) {
        int total = 0;
        while (head[a] != head[b]) {
            if (depth[head[a]] < depth[head[b]]) { int swap = a; a = b; b = swap; }
            total += prefix(pos[a] + 1) - prefix(pos[head[a]]);
            a = parent[head[a]];
        }
        return total + prefix(Math.max(pos[a], pos[b]) + 1) - prefix(Math.min(pos[a], pos[b]));
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), cursor = 0;
        int[] values = new int[n], sizes = new int[n], heavy = new int[n];
        parent = new int[n]; depth = new int[n]; head = new int[n]; pos = new int[n]; bit = new int[n + 1];
        Arrays.fill(sizes, 1); Arrays.fill(heavy, -1);
        for (int i = 0; i < n; i++) values[i] = in.nextInt();
        for (int i = 1; i < n; i++) { parent[i] = in.nextInt(); depth[i] = depth[parent[i]] + 1; }
        for (int i = n - 1; i > 0; i--) {
            int p = parent[i];
            sizes[p] += sizes[i];
            if (heavy[p] == -1 || sizes[i] >= sizes[heavy[p]]) heavy[p] = i;
        }
        for (int i = 0; i < n; i++) {
            if (i > 0 && heavy[parent[i]] == i) continue;
            for (int v = i; v != -1; v = heavy[v]) {
                head[v] = i; pos[v] = cursor++; add(pos[v], values[v]);
            }
        }
        for (int i = 0; i < q; i++) {
            int kind = in.nextInt(), a = in.nextInt(), b = in.nextInt();
            if (kind == 1) { add(pos[a], b - values[a]); values[a] = b; }
            else System.out.println(pathSum(a, b));
        }
    }
}`,
    },
  }
]);
