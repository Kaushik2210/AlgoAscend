import { defineTopics } from "./define.ts";

export const eulerTours = defineTopics([
  {
    "id": "euler-tour-flattening",
    "stage": 5,
    "title": "Euler tours and subtree intervals",
    "objective": "Flatten a rooted tree so every subtree becomes a contiguous interval.",
    "prerequisites": "Depth-first search, rooted trees, and prefix sums.",
    "analogy": "Number folders when you first open them. All folders nested inside one folder get numbered before you open its neighbor.",
    "explanation": "Record each vertex at its first visit in preorder. Save its entry time before visiting children and its exit time after visiting them. The half-open interval [entry, exit) then includes exactly that vertex and its descendants. Store values in this entry-only Euler ordering and precompute prefix sums. A subtree sum becomes one subtraction.",
    "invariant": "DFS finishes all descendants of the current vertex before returning to any outside vertex. Each traversal step records one position, and the difference exit−entry equals the subtree size.",
    "pseudocode": "DFS(v):\n  entry[v] = length(flat)\n  append value[v]\n  visit all children\n  exit[v] = length(flat)\nbuild prefix sums on flat\nanswer subtree(v) with prefix[exit[v]] − prefix[entry[v]]",
    "time": "O(n+q) for n vertices and q queries",
    "space": "O(n) for child lists, positions, prefix sums, and recursion",
    "trace": [
      [
        "Tree has parents [0,0,1,1] and values [2,4,1,7,3]",
        "The root’s children are 1 and 2. Vertex 1 has children 3 and 4."
      ],
      [
        "Preorder is [0,1,3,4,2]",
        "Finish the entire branch through 1 before visiting 2."
      ],
      [
        "Vertex 1 has interval [1,4)",
        "Its values are 4, 7, and 3."
      ],
      [
        "Prefix difference gives 14",
        "The exit index points one position past the subtree, so vertex 2 is excluded."
      ]
    ],
    "misconception": "The exit index is exclusive in this representation. Including that position can accidentally count the next sibling.",
    "debug": "Test a root query, a leaf query, and a subtree whose order is different from the original vertex IDs.",
    "fill": "What interval represents vertex v’s subtree?",
    "edgeCases": [
      "The root’s interval covers the entire array.",
      "A leaf has exit equal to entry plus one.",
      "Use signed sums when node values can be negative."
    ],
    "revision": "Why can the same interval support point updates after replacing the prefix array with a Fenwick tree?",
    "further": "Compare this entry-only ordering with the DFS walk that records repeated vertices for LCA range-minimum queries.",
    "quiz": {
      "question": "Which index is excluded from a subtree’s flattened range?",
      "answers": [
        "The entry index",
        "The exit index",
        "Every non-leaf index"
      ],
      "correct": 1,
      "feedback": "The half-open range ends just before exit, the next unused index after visiting all descendants."
    },
    "practice": {
      "title": "Sum values inside each branch",
      "description": "Answer sums of all values in requested rooted subtrees.",
      "format": "Read n q, then n values, then the parents of vertices 1 through n−1 if n>1. Each of the next q lines names a vertex. Print its subtree sum.",
      "constraints": "1 ≤ n ≤ 300, 0 ≤ q ≤ 350, |value| ≤ 10⁵, and the parent of i lies in 0…i−1.",
      "input": "5 3\n2 4 1 7 3\n0 0 1 1\n1\n2\n0\n",
      "output": "14\n1\n17\n",
      "hints": [
        "Record the first position before visiting any child.",
        "Build prefix sums over DFS order, then subtract at the two boundaries."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int values[300], first[300], next[300], entry[300], exit_index[300], prefix[301], used;
static void visit(int v) {
    entry[v] = used;
    prefix[used + 1] = prefix[used] + values[v];
    used++;
    for (int u = first[v]; u != -1; u = next[u]) visit(u);
    exit_index[v] = used;
}
int main(void) {
    int n, q, parent[300];
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int v = 0; v < n; v++) { scanf("%d", &values[v]); first[v] = -1; }
    for (int v = 1; v < n; v++) scanf("%d", &parent[v]);
    for (int v = n - 1; v > 0; v--) {
        next[v] = first[parent[v]];
        first[parent[v]] = v;
    }
    visit(0);
    while (q--) {
        int v;
        scanf("%d", &v);
        printf("%d\\n", prefix[exit_index[v]] - prefix[entry[v]]);
    }
    return 0;
}`,
      python: `n, q = map(int, input().split())
values = list(map(int, input().split()))
parents = list(map(int, input().split())) if n > 1 else []
children = [[] for _ in range(n)]
for vertex, parent in enumerate(parents, 1):
    children[parent].append(vertex)
entry, exit_index, prefix = [0] * n, [0] * n, [0]

def visit(v):
    entry[v] = len(prefix) - 1
    prefix.append(prefix[-1] + values[v])
    for child in children[v]:
        visit(child)
    exit_index[v] = len(prefix) - 1

visit(0)
for _ in range(q):
    v = int(input())
    print(prefix[exit_index[v]] - prefix[entry[v]])`,
      java: `import java.util.ArrayList;
import java.util.Scanner;
class Main {
    static ArrayList<ArrayList<Integer>> children = new ArrayList<>();
    static int[] values, entry, exitIndex, prefix;
    static int used;
    static void visit(int v) {
        entry[v] = used;
        prefix[used + 1] = prefix[used] + values[v];
        used++;
        for (int child : children.get(v)) visit(child);
        exitIndex[v] = used;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        values = new int[n]; entry = new int[n]; exitIndex = new int[n]; prefix = new int[n + 1];
        for (int v = 0; v < n; v++) { values[v] = in.nextInt(); children.add(new ArrayList<>()); }
        for (int v = 1; v < n; v++) children.get(in.nextInt()).add(v);
        visit(0);
        for (int query = 0; query < q; query++) {
            int v = in.nextInt();
            System.out.println(prefix[exitIndex[v]] - prefix[entry[v]]);
        }
    }
}`,
    },
  }
]);
