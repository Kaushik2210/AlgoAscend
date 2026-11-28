import { defineTopics } from "./define.ts";

export const lazySegments = defineTopics([
  {
    "id": "lazy-segment-tree",
    "stage": 11,
    "title": "Lazy propagation in segment trees",
    "objective": "Apply an addition to an inclusive range and query range sums in logarithmic time.",
    "prerequisites": "Segment trees, recursive intervals, and range sums.",
    "analogy": "Add the same amount to every account in a department. Record a single pending adjustment on the department until someone asks about a smaller group.",
    "explanation": "Each covered node immediately updates its sum by delta times segment length, and records delta as pending for its children. A fully covered operation can stop there. Before descending into a partially covered node, push its pending addition to both children and clear the parent’s tag. Then use the children normally and recompute the parent after updates.",
    "invariant": "A node’s sum includes all updates applied to its interval at that node or pushed into it. A pending tag is already counted in that sum but still needs to be forwarded to children before they are inspected.",
    "pseudocode": "apply(node, delta):\n  sum[node] += delta × length(node)\n  pending[node] += delta\nrange add/query(node):\n  skip disjoint nodes\n  handle a fully covered node directly\n  push any pending addition before descending into both children\n  after an update, sum the two child aggregates",
    "time": "O(log(n+1)) per contiguous range update or query",
    "space": "O(n) for the tree and O(log(n+1)) recursion depth",
    "trace": [
      [
        "Four values start at zero",
        "The root covers [0,3]. Its sum and pending tag are zero."
      ],
      [
        "Add 5 to [0,3]",
        "The root sum becomes 20 and its pending tag becomes 5. No children change yet."
      ],
      [
        "Query [1,2]",
        "Push the tag while descending so both selected leaves include the five-unit increase."
      ],
      [
        "Return 10",
        "Two covered values contribute five each. The root can still answer a full-range query in one step."
      ]
    ],
    "misconception": "A pending tag is already included in its own node sum. Adding it again when returning a full-range answer double-counts the update.",
    "debug": "Add to the full range, query one cell, then apply a negative update to part of that same range.",
    "fill": "When applying delta to a completed segment of length k, by how much does its sum change?",
    "edgeCases": [
      "Zero and negative additions are valid.",
      "A one-element range is always a leaf.",
      "Repeated additions compose by summing their pending tags."
    ],
    "revision": "Which guarantee makes it safe to defer an update to children?",
    "further": "Try range assignment and addition together. Decide how to compose the two different kinds of pending tags.",
    "quiz": {
      "question": "A five-element segment receives an addition of −2. What is the change to its sum?",
      "answers": [
        "−2",
        "−5",
        "−10"
      ],
      "correct": 2,
      "feedback": "Every one of the five entries loses two, so the segment sum changes by −10."
    },
    "practice": {
      "title": "Adjust workloads across teams",
      "description": "All team workloads start at zero. Apply inclusive range additions and report requested workload sums.",
      "format": "Read n q. Each of the next q lines is 1 left right delta for an addition or 2 left right for a sum query. Print each queried sum.",
      "constraints": "1 ≤ n,q ≤ 350, 0 ≤ left ≤ right < n, and |delta| ≤ 10⁶.",
      "input": "4 5\n1 0 3 5\n2 1 2\n1 2 3 -3\n2 0 3\n2 3 3\n",
      "output": "10\n14\n2\n",
      "hints": [
        "Apply an addition to the sum and the lazy tag together.",
        "Push tags before accessing children of a partially covered node."
      ]
    },
    code: {
      c: `#include <stdio.h>
static long long sum[1400], lazy[1400];
static void apply(int node, int lo, int hi, long long delta) {
    sum[node] += delta * (hi - lo + 1);
    lazy[node] += delta;
}
static void push(int node, int lo, int mid, int hi) {
    if (!lazy[node]) return;
    apply(2 * node, lo, mid, lazy[node]);
    apply(2 * node + 1, mid + 1, hi, lazy[node]);
    lazy[node] = 0;
}
static void add(int node, int lo, int hi, int l, int r, int delta) {
    if (r < lo || hi < l) return;
    if (l <= lo && hi <= r) { apply(node, lo, hi, delta); return; }
    int mid = (lo + hi) / 2;
    push(node, lo, mid, hi);
    add(2 * node, lo, mid, l, r, delta);
    add(2 * node + 1, mid + 1, hi, l, r, delta);
    sum[node] = sum[2 * node] + sum[2 * node + 1];
}
static long long query(int node, int lo, int hi, int l, int r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return sum[node];
    int mid = (lo + hi) / 2;
    push(node, lo, mid, hi);
    return query(2 * node, lo, mid, l, r) + query(2 * node + 1, mid + 1, hi, l, r);
}
int main(void) {
    int n, q;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < q; i++) {
        int type, l, r, delta;
        scanf("%d%d%d", &type, &l, &r);
        if (type == 1) { scanf("%d", &delta); add(1, 0, n - 1, l, r, delta); }
        else printf("%lld\\n", query(1, 0, n - 1, l, r));
    }
    return 0;
}`,
      python: `n, q = map(int, input().split())
sums, lazy = [0] * (4 * n), [0] * (4 * n)

def apply(node, lo, hi, delta):
    sums[node] += delta * (hi - lo + 1)
    lazy[node] += delta

def push(node, lo, mid, hi):
    if lazy[node]:
        apply(2 * node, lo, mid, lazy[node])
        apply(2 * node + 1, mid + 1, hi, lazy[node])
        lazy[node] = 0

def add(node, lo, hi, left, right, delta):
    if right < lo or hi < left:
        return
    if left <= lo and hi <= right:
        apply(node, lo, hi, delta)
        return
    mid = (lo + hi) // 2
    push(node, lo, mid, hi)
    add(2 * node, lo, mid, left, right, delta)
    add(2 * node + 1, mid + 1, hi, left, right, delta)
    sums[node] = sums[2 * node] + sums[2 * node + 1]

def query(node, lo, hi, left, right):
    if right < lo or hi < left:
        return 0
    if left <= lo and hi <= right:
        return sums[node]
    mid = (lo + hi) // 2
    push(node, lo, mid, hi)
    return query(2 * node, lo, mid, left, right) + query(2 * node + 1, mid + 1, hi, left, right)

for _ in range(q):
    kind, left, right, *delta = map(int, input().split())
    if kind == 1:
        add(1, 0, n - 1, left, right, delta[0])
    else:
        print(query(1, 0, n - 1, left, right))`,
      java: `import java.util.Scanner;
class Main {
    static long[] sum, lazy;
    static void apply(int node, int lo, int hi, long delta) {
        sum[node] += delta * (hi - lo + 1);
        lazy[node] += delta;
    }
    static void push(int node, int lo, int mid, int hi) {
        if (lazy[node] == 0) return;
        apply(2 * node, lo, mid, lazy[node]);
        apply(2 * node + 1, mid + 1, hi, lazy[node]);
        lazy[node] = 0;
    }
    static void add(int node, int lo, int hi, int left, int right, int delta) {
        if (right < lo || hi < left) return;
        if (left <= lo && hi <= right) { apply(node, lo, hi, delta); return; }
        int mid = (lo + hi) / 2;
        push(node, lo, mid, hi);
        add(2 * node, lo, mid, left, right, delta);
        add(2 * node + 1, mid + 1, hi, left, right, delta);
        sum[node] = sum[2 * node] + sum[2 * node + 1];
    }
    static long query(int node, int lo, int hi, int left, int right) {
        if (right < lo || hi < left) return 0;
        if (left <= lo && hi <= right) return sum[node];
        int mid = (lo + hi) / 2;
        push(node, lo, mid, hi);
        return query(2 * node, lo, mid, left, right) + query(2 * node + 1, mid + 1, hi, left, right);
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        sum = new long[4 * n];
        lazy = new long[4 * n];
        for (int i = 0; i < q; i++) {
            int type = in.nextInt(), left = in.nextInt(), right = in.nextInt();
            if (type == 1) add(1, 0, n - 1, left, right, in.nextInt());
            else System.out.println(query(1, 0, n - 1, left, right));
        }
    }
}`,
    },
  }
]);
