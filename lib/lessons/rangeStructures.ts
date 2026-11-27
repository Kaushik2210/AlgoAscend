import { defineTopics } from "./define.ts";

export const rangeStructures = defineTopics([
  {
    "id": "segment-tree-range-minimum",
    "stage": 11,
    "title": "Segment trees for range minima",
    "objective": "Maintain the minimum of an arbitrary inclusive range while points change.",
    "prerequisites": "Array indices, binary trees and the idea of a range query.",
    "analogy": "Each scoreboard branch reports the lowest score in its section. Fixing one score only requires updating the reports above that score.",
    "explanation": "Pad to a power-of-two leaf count. Each internal node stores the minimum of its children. For a range query, cover the interval with complete tree nodes and combine their minimums. A point assignment rewrites the leaf and recomputes its ancestors.",
    "invariant": "Every node stores the minimum over its own leaf interval. The query combines disjoint node intervals whose union equals the requested interval. Taking their minimum therefore yields the requested minimum.",
    "pseudocode": "build leaves and fill internal minimums bottom-up\nfor assignment i, value: overwrite leaf i and recompute ancestors\nquery [l,r]: shift both ends to leaves; use right-exclusive r+1\nwhile l < r:\n  take and advance l if it is a right child\n  retreat and take r if it is a right child\n  move both endpoints to their parents",
    "time": "O(n) build time and O(log n) per query or update",
    "space": "O(n) for the tree. The Python program also buffers O(q) operation tokens",
    "trace": [
      [
        "Leaf values [7, 3, 9, 5]",
        "The parent minima are 3 and 5. The root minimum is 3."
      ],
      [
        "Query [1, 2] → min(3, 9) = 3",
        "This range crosses the root split. Use the leaves at indices 1 and 2."
      ],
      [
        "Assign index 1 → 8",
        "Recompute its parent from 7 and 8, giving 7. The root becomes 5."
      ],
      [
        "Query [1, 2] → min(8, 9) = 8",
        "The same query now returns 8."
      ]
    ],
    "misconception": "Zero is a bad padding value for minimum over positive values. Use an identity larger than every permitted value.",
    "debug": "Use a non-power-of-two sequence of positive values and check its full-range minimum.",
    "fill": "After updating a node at index i, its parent is at floor(i / ___).",
    "edgeCases": [
      "A single-element query returns its leaf.",
      "Padded leaves contain a value larger than all real values.",
      "Negative values and repeated assignments are valid."
    ],
    "revision": "What property must an internal node preserve after a leaf assignment?",
    "further": "Swap minimum for sum, then compare with the Fenwick tree’s range-sum interface.",
    "quiz": {
      "question": "What must change when a point is assigned a new value?",
      "answers": [
        "The leaf and its ancestor chain",
        "Every leaf in that half",
        "Only the root"
      ],
      "correct": 0,
      "feedback": "Only nodes whose interval contains the updated index can be affected."
    },
    "practice": {
      "title": "Tunnel clearance",
      "description": "Update height measurements along a tunnel and find the lowest clearance in requested stretches.",
      "format": "Read n q and n heights. Then read q triples t x y. Type 1 assigns height y at index x. Type 2 prints the minimum on inclusive indices x through y. Indices are zero-based.",
      "constraints": "1 ≤ n ≤ 200, 0 ≤ q ≤ 250, and heights are between −10⁶ and 10⁶. Every index in an operation is valid.",
      "input": "4 3\n7 3 9 5\n2 1 2\n1 1 8\n2 1 2\n",
      "output": "3\n8\n",
      "hints": [
        "Use right-exclusive endpoints inside the query loop.",
        "Recompute ancestors bottom-up after a leaf assignment."
      ]
    },
    code:{
      c: `#include <stdio.h>
#define INF 1000000000
static int tree[512];
static int min_value(int a, int b) { return a < b ? a : b; }
int main(void) {
    int n, q;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    int base = 1;
    while (base < n) base *= 2;
    for (int i = 0; i < base; i++) tree[base + i] = INF;
    for (int i = 0; i < n; i++) scanf("%d", &tree[base + i]);
    for (int i = base - 1; i > 0; i--) tree[i] = min_value(tree[2 * i], tree[2 * i + 1]);
    for (int i = 0; i < q; i++) {
        int type, x, y;
        scanf("%d%d%d", &type, &x, &y);
        if (type == 1) {
            int index = base + x;
            tree[index] = y;
            while ((index /= 2) > 0) tree[index] = min_value(tree[2 * index], tree[2 * index + 1]);
        } else {
            int left = base + x, right = base + y + 1, answer = INF;
            while (left < right) {
                if (left % 2) answer = min_value(answer, tree[left++]);
                if (right % 2) answer = min_value(answer, tree[--right]);
                left /= 2;
                right /= 2;
            }
            printf("%d\\n", answer);
        }
    }
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
base = 1 << (n - 1).bit_length()
inf = 10**9
tree = [inf] * (2 * base)
for i in range(n):
    tree[base + i] = next(tokens)
for i in range(base - 1, 0, -1):
    tree[i] = min(tree[2 * i], tree[2 * i + 1])
for _ in range(q):
    kind, x, y = next(tokens), next(tokens), next(tokens)
    if kind == 1:
        index = base + x
        tree[index] = y
        while index > 1:
            index //= 2
            tree[index] = min(tree[2 * index], tree[2 * index + 1])
    else:
        left, right, answer = base + x, base + y + 1, inf
        while left < right:
            if left % 2:
                answer = min(answer, tree[left])
                left += 1
            if right % 2:
                right -= 1
                answer = min(answer, tree[right])
            left //= 2
            right //= 2
        print(answer)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), base = 1;
        final int inf = 1_000_000_000;
        while (base < n) base *= 2;
        int[] tree = new int[2 * base];
        Arrays.fill(tree, inf);
        for (int i = 0; i < n; i++) tree[base + i] = in.nextInt();
        for (int i = base - 1; i > 0; i--) tree[i] = Math.min(tree[2 * i], tree[2 * i + 1]);
        for (int i = 0; i < q; i++) {
            int type = in.nextInt(), x = in.nextInt(), y = in.nextInt();
            if (type == 1) {
                int index = base + x;
                tree[index] = y;
                while (index > 1) {
                    index /= 2;
                    tree[index] = Math.min(tree[2 * index], tree[2 * index + 1]);
                }
            } else {
                int left = base + x, right = base + y + 1, answer = inf;
                while (left < right) {
                    if (left % 2 != 0) answer = Math.min(answer, tree[left++]);
                    if (right % 2 != 0) answer = Math.min(answer, tree[--right]);
                    left /= 2;
                    right /= 2;
                }
                System.out.println(answer);
            }
        }
    }
}`,
    },
  }
]);
