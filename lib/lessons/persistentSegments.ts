import { defineTopics } from "./define.ts";

export const persistentSegments = defineTopics([
  {
    "id": "persistent-segment-tree",
    "stage": 11,
    "title": "Persistent segment trees and path copying",
    "objective": "Branch from any saved version while keeping older versions queryable.",
    "prerequisites": "Segment trees, recursion, and point assignment.",
    "analogy": "Keep each edition of a binder. A changed page gets a new copy and new dividers on its path. Unchanged sections are shared with older editions.",
    "explanation": "Keep a root for each version. A point assignment copies only the nodes from the selected root to its changed leaf. The untouched child of every copied node remains shared. Version zero is all zeros, so one implicit null node can represent any untouched all-zero segment. Queries start from the requested root.",
    "invariant": "A node’s children are never mutated after it is published. New versions only add nodes, so an older root continues to point to exactly its original tree.",
    "pseudocode": "update(old, interval, position, value):\n  copy old node; on a leaf, store value\n  otherwise replace the changed child with its new path\n  recompute sum from both children and return the copied node\nstore each returned root as the next version",
    "time": "O(log(n+1)) per update or query for n positions",
    "space": "O(q + u log(n+1)) for version roots and nodes across q operations and u updates",
    "trace": [
      [
        "Version 0 → [0,0,0,0]",
        "All segments use the implicit zero node."
      ],
      [
        "Version 1 branches from 0 and sets index 1 to 7",
        "Copy the root and the nodes on the path to index 1."
      ],
      [
        "Version 2 branches from 0 and sets index 3 to −2",
        "This branch has no reference to version 1’s changed path."
      ],
      [
        "Full sums: version 0=0, version 1=7, version 2=−2",
        "Saving a new root never overwrites an old version."
      ]
    ],
    "misconception": "Copying only the root and then mutating a child changes every older version that shares that child.",
    "debug": "Create two branches from version zero, then query both branches and the original version.",
    "fill": "What happens to the untouched child when its parent is copied?",
    "edgeCases": [
      "The initial version is indexed zero.",
      "Queries do not create a version.",
      "Setting a value replaces its previous value in the chosen version."
    ],
    "revision": "Why do point updates create only logarithmically many new nodes?",
    "further": "Store frequency counts in versions of array prefixes and subtract counts across two versions to find range order statistics.",
    "quiz": {
      "question": "Which nodes must be copied for one point update?",
      "answers": [
        "Every node",
        "Only the updated leaf",
        "The updated leaf and its ancestors"
      ],
      "correct": 2,
      "feedback": "Each ancestor needs a new child pointer and sum. Other branches can be reused safely."
    },
    "practice": {
      "title": "Query saved inventory versions",
      "description": "Branch from any version of an initially zero inventory and answer sums from any saved version.",
      "format": "Read n q. Each line is 1 version index value to append a new version, or 2 version left right to print an inclusive range sum. New versions are numbered consecutively from 1.",
      "constraints": "1 ≤ n,q ≤ 350. Versions and zero-based indices must exist at use, left ≤ right, and |value| ≤ 10⁶.",
      "input": "4 5\n1 0 1 7\n1 0 3 -2\n2 0 0 3\n2 1 0 3\n2 2 0 3\n",
      "output": "0\n7\n-2\n",
      "hints": [
        "Store an array of version roots.",
        "Clone only the path whose leaf changes."
      ]
    },
    code: {
      c: `#include <stdio.h>
typedef struct { int left, right, sum; } Node;
static Node nodes[4000];
static int used;
static int update(int old, int lo, int hi, int index, int value) {
    int node = ++used;
    nodes[node] = nodes[old];
    if (lo == hi) { nodes[node].sum = value; return node; }
    int mid = (lo + hi) / 2;
    if (index <= mid) nodes[node].left = update(nodes[old].left, lo, mid, index, value);
    else nodes[node].right = update(nodes[old].right, mid + 1, hi, index, value);
    nodes[node].sum = nodes[nodes[node].left].sum + nodes[nodes[node].right].sum;
    return node;
}
static int query(int node, int lo, int hi, int l, int r) {
    if (!node || r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return nodes[node].sum;
    int mid = (lo + hi) / 2;
    return query(nodes[node].left, lo, mid, l, r) + query(nodes[node].right, mid + 1, hi, l, r);
}
int main(void) {
    int n, q, roots[351] = {0}, versions = 1;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < q; i++) {
        int type, version, a, b;
        scanf("%d%d%d%d", &type, &version, &a, &b);
        if (type == 1) roots[versions++] = update(roots[version], 0, n - 1, a, b);
        else printf("%d\\n", query(roots[version], 0, n - 1, a, b));
    }
    return 0;
}`,
      python: `n, q = map(int, input().split())
nodes = [(0, 0, 0)]
roots = [0]

def update(old, lo, hi, index, value):
    if lo == hi:
        nodes.append((0, 0, value))
    else:
        left, right, _ = nodes[old]
        mid = (lo + hi) // 2
        if index <= mid:
            left = update(left, lo, mid, index, value)
        else:
            right = update(right, mid + 1, hi, index, value)
        nodes.append((left, right, nodes[left][2] + nodes[right][2]))
    return len(nodes) - 1

def query(node, lo, hi, l, r):
    if node == 0 or r < lo or hi < l:
        return 0
    left, right, total = nodes[node]
    if l <= lo and hi <= r:
        return total
    mid = (lo + hi) // 2
    return query(left, lo, mid, l, r) + query(right, mid + 1, hi, l, r)

for _ in range(q):
    kind, version, a, b = map(int, input().split())
    if kind == 1:
        roots.append(update(roots[version], 0, n - 1, a, b))
    else:
        print(query(roots[version], 0, n - 1, a, b))`,
      java: `import java.util.Scanner;
class Main {
    record Node(Node left, Node right, int sum) {}
    static int sum(Node node) { return node == null ? 0 : node.sum(); }
    static Node update(Node old, int lo, int hi, int index, int value) {
        if (lo == hi) return new Node(null, null, value);
        Node left = old == null ? null : old.left();
        Node right = old == null ? null : old.right();
        int mid = (lo + hi) / 2;
        if (index <= mid) left = update(left, lo, mid, index, value);
        else right = update(right, mid + 1, hi, index, value);
        return new Node(left, right, sum(left) + sum(right));
    }
    static int query(Node node, int lo, int hi, int l, int r) {
        if (node == null || r < lo || hi < l) return 0;
        if (l <= lo && hi <= r) return node.sum();
        int mid = (lo + hi) / 2;
        return query(node.left(), lo, mid, l, r) + query(node.right(), mid + 1, hi, l, r);
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), versions = 1;
        Node[] roots = new Node[q + 1];
        for (int i = 0; i < q; i++) {
            int kind = in.nextInt(), version = in.nextInt(), a = in.nextInt(), b = in.nextInt();
            if (kind == 1) roots[versions++] = update(roots[version], 0, n - 1, a, b);
            else System.out.println(query(roots[version], 0, n - 1, a, b));
        }
    }
}`,
    },
  }
]);
