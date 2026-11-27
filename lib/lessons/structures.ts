import { defineTopics } from "./define.ts";

export const structures = defineTopics([
  {
    "id": "prefix-sums",
    "stage": 4,
    "title": "Prefix sums for range queries",
    "objective": "Precompute prefix totals so each inclusive range sum needs one subtraction.",
    "prerequisites": "Arrays, loop accumulators, and 1-based indexes.",
    "analogy": "To find the distance traveled between two checkpoints, subtract the earlier odometer reading from the later one.",
    "explanation": "Build an array with P[0]=0 and P[i]=P[i−1]+a[i]. A range [L,R] keeps exactly the values between P[L−1] and P[R]. This works with negative readings because subtraction cancels the same prefix.",
    "invariant": "P[i] equals the sum of the first i elements. Subtracting P[L−1] cancels the terms strictly before L, leaving the inclusive range.",
    "pseudocode": "P[0] ← 0\nfor i from 1 to n: P[i] ← P[i−1] + a[i]\nfor each query (L,R): print P[R] − P[L−1]",
    "time": "O(n+q) time for q queries",
    "space": "O(n) for the prefix table. The Python program also buffers O(n+q) input tokens",
    "trace": [
      [
        "a = [4, -1, 7, 2]",
        "Before reading any element the prefix sum is zero."
      ],
      [
        "P = [0, 4, 3, 10, 12]",
        "Each prefix adds a single item. Prefix totals need not increase."
      ],
      [
        "[2,4] → P[4] − P[1] = 8",
        "Subtract 4, the sum of all elements before the second item."
      ]
    ],
    "misconception": "Subtracting P[L] drops the first item of the requested range.",
    "debug": "On a one-item query L=R, what does P[R]−P[L] return?",
    "fill": "Use P[R]−P[__] for an inclusive interval.",
    "edgeCases": [
      "Include a query starting at 1.",
      "Use an interval with negative sum.",
      "Use a 64-bit type for prefix totals."
    ],
    "revision": "Count how many items come before the left boundary.",
    "further": "With changing values, try a Fenwick tree instead of rebuilding the prefixes.",
    "quiz": {
      "question": "With P = [0,4,3,10,12], what is the sum for [2,3]?",
      "answers": [
        "6",
        "7",
        "10"
      ],
      "correct": 0,
      "feedback": "P[3]−P[1]=10−4=6. The two selected numbers are −1 and 7."
    },
    "practice": {
      "title": "Query a fixed log",
      "description": "Answer inclusive range-sum queries on a log of integer readings.",
      "format": "Read n q, then n readings. Read q pairs L R (1-based). Print one sum per query.",
      "constraints": "1 ≤ n,q ≤ 350; readings are between −10⁹ and 10⁹; 1 ≤ L ≤ R ≤ n.",
      "input": "4 2\n4 -1 7 2\n2 4\n1 1\n",
      "output": "8\n4\n",
      "hints": [
        "Keep a zero-length prefix.",
        "The left boundary must remain in the result.",
        "A single subtraction is enough after preprocessing."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    int n, q;
    long long prefix[1001] = {0};
    if (scanf("%d%d", &n, &q) != 2) return 1;
    for (int i = 1; i <= n; ++i) {
        int x;
        if (scanf("%d", &x) != 1) return 1;
        prefix[i] = prefix[i-1] + x;
    }
    while (q--) {
        int l, r;
        if (scanf("%d%d", &l, &r) != 2) return 1;
        printf("%lld\\n", prefix[r] - prefix[l-1]);
    }
    return 0;
}`,
      python: `import sys

tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
prefix = [0]
for _ in range(n):
    prefix.append(prefix[-1] + next(tokens))
for _ in range(q):
    left, right = next(tokens), next(tokens)
    print(prefix[right] - prefix[left-1])`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        long[] prefix = new long[n + 1];
        for (int i = 1; i <= n; i++) prefix[i] = prefix[i-1] + in.nextInt();
        while (q-- > 0) {
            int l = in.nextInt(), r = in.nextInt();
            System.out.println(prefix[r] - prefix[l-1]);
        }
    }
}`,
    },
  },
  {
    "id": "binary-tree-traversal",
    "stage": 5,
    "title": "Binary trees and preorder traversal",
    "objective": "Explain preorder and trace an indexed binary tree with missing children.",
    "prerequisites": "Arrays, recursion, and zero-based indexes.",
    "analogy": "When touring rooms connected by left and right doors, record each room on arrival before exploring its side rooms.",
    "explanation": "In preorder, visit a node, traverse its left subtree, then traverse its right subtree. In this indexed representation, a node at i has children at 2i+1 and 2i+2. Indexes outside the array and zero entries represent missing nodes.",
    "invariant": "A recursive call prints the current node followed by the preorder sequences of its left and right subtrees. Distinct child subtrees have disjoint positions.",
    "pseudocode": "visit(i):\n    if i is outside the array or value[i] = 0: return\n    output value[i]\n    visit(2i + 1)\n    visit(2i + 2)",
    "time": "O(n) time including reading n positions",
    "space": "O(n) for input and output, plus O(log n) traversal stack for this representation",
    "trace": [
      [
        "Index: 0  1  2  3  4\nValue: 8  3  9  0  5",
        "Record 8 at the root before descending."
      ],
      [
        "output: 8 3 5",
        "Visit 3. Its left index is empty, so record 5 on its right."
      ],
      [
        "output: 8 3 5 9",
        "Return to the root and traverse the right subtree."
      ]
    ],
    "misconception": "Indexed trees are not naturally printed in preorder by scanning the array.",
    "debug": "A traversal outputs 8 3 9 5. At which point did it visit the right subtree too early?",
    "fill": "The right child of index i is __.",
    "edgeCases": [
      "Try a root with no children.",
      "Try a missing left child.",
      "The first value is always nonzero in this challenge."
    ],
    "revision": "Preorder visits the current node before either child.",
    "further": "Move the visit between the calls to get inorder, or after both calls to get postorder.",
    "quiz": {
      "question": "What comes immediately after 3 for [8,3,9,0,5]?",
      "answers": [
        "9",
        "5",
        "0"
      ],
      "correct": 1,
      "feedback": "The recursion finishes the left subtree before moving to 9. The next present node below 3 is 5."
    },
    "practice": {
      "title": "Inspect a tree in preorder",
      "description": "Print the present tree entries in preorder.",
      "format": "Read n followed by n indexed values. Print preorder values on one space-separated line.",
      "constraints": "1 ≤ n ≤ 600; node values are 1 to 10⁹. Zero marks a missing node. Root is present, and every present non-root node has a present parent.",
      "input": "5\n8 3 9 0 5\n",
      "output": "8 3 5 9\n",
      "hints": [
        "Record a node before recursing.",
        "Left and right child indexes have different offsets.",
        "Return immediately for a missing node."
      ]
    },
    code:{
      c: `#include <stdio.h>

static int nodes[10000];
static int n;

static void visit(int i, int *printed) {
    if (i >= n || nodes[i] == 0) return;
    printf("%s%d", *printed ? " " : "", nodes[i]);
    *printed = 1;
    visit(2*i + 1, printed);
    visit(2*i + 2, printed);
}

int main(void) {
    if (scanf("%d", &n) != 1) return 1;
    for (int i = 0; i < n; ++i) if (scanf("%d", &nodes[i]) != 1) return 1;
    int printed = 0;
    visit(0, &printed);
    puts("");
    return 0;
}`,
      python: `import sys

n, *nodes = map(int, sys.stdin.buffer.read().split())
order = []

def visit(i):
    if i >= n or nodes[i] == 0:
        return
    order.append(nodes[i])
    visit(2*i + 1)
    visit(2*i + 2)

visit(0)
print(*order)`,
      java: `import java.util.Scanner;

public class Main {
    static void visit(int[] nodes, int i, StringBuilder output) {
        if (i >= nodes.length || nodes[i] == 0) return;
        if (output.length() != 0) output.append(' ');
        output.append(nodes[i]);
        visit(nodes, 2*i + 1, output);
        visit(nodes, 2*i + 2, output);
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int[] nodes = new int[in.nextInt()];
        for (int i = 0; i < nodes.length; i++) nodes[i] = in.nextInt();
        StringBuilder output = new StringBuilder();
        visit(nodes, 0, output);
        System.out.println(output);
    }
}`,
    },
  },
  {
    "id": "breadth-first-search",
    "stage": 6,
    "title": "Breadth-first search",
    "objective": "Find the fewest edges from one vertex to another in an unweighted graph.",
    "prerequisites": "Arrays, queues, and adjacency lists.",
    "analogy": "A message spreads through a contact network in rounds. Each round reaches friends exactly one link farther away.",
    "explanation": "Start by queuing the source with distance zero. Dequeue a vertex and inspect its neighbors. Assign each undiscovered neighbor distance current+1 and queue it immediately. Adjacency lists let you inspect only the present edges.",
    "invariant": "The queue is processed in nondecreasing distance. The first discovery of v uses a shortest path, since every shorter predecessor would already have been processed.",
    "pseudocode": "distance[*] ← −1; distance[source] ← 0\nqueue ← [source]\nwhile queue is not empty:\n    u ← pop front\n    for each unseen neighbor v: set distance[v] ← distance[u] + 1 and enqueue v",
    "time": "O(V+E) time",
    "space": "O(V+E) space including adjacency lists",
    "trace": [
      [
        "graph: 1–2, 1–3, 2–4, 3–5, 4–5\nqueue: [1]",
        "Start with 1 at distance zero."
      ],
      [
        "queue: [2,3] | d[2]=d[3]=1",
        "All direct neighbors arrive in the first layer."
      ],
      [
        "d[4]=2, d[5]=2",
        "Processing 2 and 3 reaches the second layer. The longer route to 5 through 4 changes nothing."
      ]
    ],
    "misconception": "Marking a vertex only when dequeued allows duplicate entries.",
    "debug": "In a cycle, a vertex gets enqueued many times. Where should the distance be assigned?",
    "fill": "For a newly seen edge u→v, set d[v] = __.",
    "edgeCases": [
      "Source equal to target gives zero.",
      "Return −1 for unreachable vertices.",
      "Repeated edges must not enqueue a discovered vertex again."
    ],
    "revision": "Mark on enqueue and process in layers.",
    "further": "Use Dijkstra when different edges have nonnegative costs.",
    "quiz": {
      "question": "If an undiscovered neighbor is found from a vertex at distance 3, what distance is assigned?",
      "answers": [
        "3",
        "4",
        "It depends on the vertex ID"
      ],
      "correct": 1,
      "feedback": "The new path takes exactly one additional edge. Queue order rules out a shorter undiscovered path."
    },
    "practice": {
      "title": "Find the fewest relay hops",
      "description": "Compute the shortest unweighted connection count between two relays.",
      "format": "Read n m start target, followed by m undirected edges u v. Print distance or −1.",
      "constraints": "1 ≤ n ≤ 400, 0 ≤ m ≤ 900, and vertices are numbered 1 through n.",
      "input": "5 5 1 5\n1 2\n1 3\n2 4\n3 5\n4 5\n",
      "output": "2\n",
      "hints": [
        "Use a FIFO queue.",
        "Store a distance when enqueuing.",
        "Keep −1 for vertices never reached."
      ]
    },
    code:{
      c: `#include <stdio.h>

static int head[1001], neighbors[6000], next_edge[6000], edges;
static int distance[1001], queue[1000];

static void add(int from, int to) {
    neighbors[edges] = to;
    next_edge[edges] = head[from];
    head[from] = edges++;
}

int main(void) {
    int n, m, start, target;
    if (scanf("%d%d%d%d", &n, &m, &start, &target) != 4) return 1;
    for (int i = 1; i <= n; ++i) head[i] = distance[i] = -1;
    for (int i = 0; i < m; ++i) {
        int u, v;
        if (scanf("%d%d", &u, &v) != 2) return 1;
        add(u, v);
        add(v, u);
    }
    int front = 0, back = 0;
    queue[back++] = start;
    distance[start] = 0;
    while (front < back) {
        int u = queue[front++];
        for (int e = head[u]; e != -1; e = next_edge[e]) {
            int v = neighbors[e];
            if (distance[v] != -1) continue;
            distance[v] = distance[u] + 1;
            queue[back++] = v;
        }
    }
    printf("%d\\n", distance[target]);
    return 0;
}`,
      python: `from collections import deque
import sys

tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, m, start, target = (next(tokens) for _ in range(4))
adj = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = next(tokens), next(tokens)
    adj[u].append(v)
    adj[v].append(u)

distance = [-1] * (n + 1)
distance[start] = 0
queue = deque([start])
while queue:
    u = queue.popleft()
    for v in adj[u]:
        if distance[v] == -1:
            distance[v] = distance[u] + 1
            queue.append(v)
print(distance[target])`,
      java: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt(), start = in.nextInt(), target = in.nextInt();
        var adj = new ArrayList<ArrayList<Integer>>();
        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }
        int[] distance = new int[n + 1];
        Arrays.fill(distance, -1);
        var queue = new ArrayDeque<Integer>();
        distance[start] = 0;
        queue.add(start);
        while (!queue.isEmpty()) {
            int u = queue.remove();
            for (int v : adj.get(u)) {
                if (distance[v] != -1) continue;
                distance[v] = distance[u] + 1;
                queue.add(v);
            }
        }
        System.out.println(distance[target]);
    }
}`,
    },
  },
  {
    "id": "subset-backtracking",
    "stage": 7,
    "title": "Backtracking with include-or-skip choices",
    "objective": "Enumerate index subsets without duplicates by branching on one item at a time.",
    "prerequisites": "Recursive functions and arrays.",
    "analogy": "For each item on a packing list, try the two possibilities of taking it or leaving it.",
    "explanation": "Track the current index and sum. Recursively count completions when the current item is skipped and when it is included. Once all decisions are made, count the branch if its total matches the target.",
    "invariant": "At depth i, the sum represents exactly the decisions for the first i positions. Every index subset has a unique sequence of include-or-skip decisions.",
    "pseudocode": "count(i,total):\n    if i = n: return 1 if total = target else 0\n    return count(i+1,total) + count(i+1,total + a[i])",
    "time": "O(2^n) time",
    "space": "O(n) stack space",
    "trace": [
      [
        "items: [2,3,5], target = 5",
        "Branch on whether to take 2. Every subsequent item gets its own two branches."
      ],
      [
        "take 2, take 3, skip 5 → 5",
        "This full path contributes one."
      ],
      [
        "skip 2, skip 3, take 5 → 5",
        "Another full path contributes one. The answer is two."
      ]
    ],
    "misconception": "Skipping a branch solely because the sum exceeds the target fails when negative values remain.",
    "debug": "A program stops as soon as total equals target. Which subsets can a later zero create?",
    "fill": "The include branch recurses with total + __.",
    "edgeCases": [
      "The empty subset can reach target zero.",
      "Equal values are distinct choices by index.",
      "Include negative values in tests."
    ],
    "revision": "Count solutions only at full decision leaves.",
    "further": "For larger n, split into two halves and match their subset sums using meet in the middle.",
    "quiz": {
      "question": "For [0] and target zero, how many index subsets qualify?",
      "answers": [
        "0",
        "1",
        "2"
      ],
      "correct": 2,
      "feedback": "The empty subset and the subset containing the zero are separate choices, both with sum zero."
    },
    "practice": {
      "title": "Count matching selections",
      "description": "Count subsets of item positions whose readings sum to the target.",
      "format": "Read n and target, followed by n integers. Print the number of matching subsets.",
      "constraints": "0 ≤ n ≤ 18. Each reading and the target is between −1000 and 1000.",
      "input": "3 5\n2 3 5\n",
      "output": "2\n",
      "hints": [
        "Use one branch per possible choice at each position.",
        "Check the sum after processing all positions.",
        "Combine the counts from both branches."
      ]
    },
    code:{
      c: `#include <stdio.h>

static int values[18], n, target;

static int count(int i, int sum) {
    if (i == n) return sum == target;
    return count(i+1, sum) + count(i+1, sum + values[i]);
}

int main(void) {
    if (scanf("%d%d", &n, &target) != 2) return 1;
    for (int i = 0; i < n; ++i) if (scanf("%d", &values[i]) != 1) return 1;
    printf("%d\\n", count(0, 0));
    return 0;
}`,
      python: `import sys

n, target, *values = map(int, sys.stdin.buffer.read().split())

def count(i, total):
    if i == n:
        return int(total == target)
    return count(i+1, total) + count(i+1, total + values[i])

print(count(0, 0))`,
      java: `import java.util.Scanner;

public class Main {
    static int count(int[] values, int target, int i, int sum) {
        if (i == values.length) return sum == target ? 1 : 0;
        return count(values, target, i+1, sum) + count(values, target, i+1, sum + values[i]);
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(), target = in.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = in.nextInt();
        System.out.println(count(values, target, 0, 0));
    }
}`,
    },
  },
  {
    "id": "interval-scheduling",
    "stage": 8,
    "title": "Greedy interval scheduling",
    "objective": "Choose the most nonoverlapping intervals and justify the earliest-finish rule.",
    "prerequisites": "Sorting and interval comparisons.",
    "analogy": "If all meetings count equally, taking the one that frees the room earliest leaves the most time for later meetings.",
    "explanation": "Sort by end time. Walk through the sorted intervals and keep each interval whose start is at or after the most recently kept end. Finishing earlier can only make later selections easier.",
    "invariant": "In an optimal schedule, replace the first interval by a compatible interval with the earliest end. Every later interval still starts late enough, so the optimum size is preserved. Repeat after each accepted interval.",
    "pseudocode": "sort intervals by end time\nlastEnd ← 0; count ← 0\nfor each interval (start,end):\n    if start ≥ lastEnd: keep it and update lastEnd",
    "time": "O(n log n) time",
    "space": "O(n) for the intervals",
    "trace": [
      [
        "[0,8), [1,3), [3,5), [5,7)",
        "The earliest starting interval would use the room for eight units."
      ],
      [
        "sorted ends: 3, 5, 7, 8",
        "Choose [1,3) and move the availability boundary to 3."
      ],
      [
        "accepted: [1,3), [3,5), [5,7)",
        "Endpoints may touch. Skip [0,8) because it overlaps."
      ]
    ],
    "misconception": "Earliest start can lock out many short intervals.",
    "debug": "Two meetings touch at time 3 and only one was selected. What comparison caused that?",
    "fill": "A compatible meeting has start __ lastEnd.",
    "edgeCases": [
      "No intervals yields zero.",
      "Equal end times can be processed in either order.",
      "Treat intervals as half-open."
    ],
    "revision": "The exchange argument is the reason earliest end works.",
    "further": "Add interval weights and compare why the same greedy rule no longer optimizes total weight.",
    "quiz": {
      "question": "Which interval should the algorithm consider first among [0,8), [3,5), and [1,3)?",
      "answers": [
        "[0,8)",
        "[3,5)",
        "[1,3)"
      ],
      "correct": 2,
      "feedback": "[1,3) ends at 3, so it leaves the room available sooner than the others."
    },
    "practice": {
      "title": "Schedule the most sessions",
      "description": "Find the maximum number of mutually compatible sessions for one room.",
      "format": "Read n then n start/end pairs. Print the maximum count.",
      "constraints": "0 ≤ n ≤ 350 and 0 ≤ start < end ≤ 10⁹. Intervals that touch are compatible.",
      "input": "4\n0 8\n3 5\n5 7\n1 3\n",
      "output": "3\n",
      "hints": [
        "Sort by finish time.",
        "Track the room's next available time.",
        "Replace an optimal first choice by an earlier finish."
      ]
    },
    code:{
      c: `#include <stdio.h>
#include <stdlib.h>

typedef struct { int start, end; } Interval;

static int by_end(const void *a, const void *b) {
    int x = ((const Interval *)a)->end, y = ((const Interval *)b)->end;
    return (x > y) - (x < y);
}

int main(void) {
    Interval items[1000];
    int n;
    if (scanf("%d", &n) != 1) return 1;
    for (int i = 0; i < n; ++i) {
        if (scanf("%d%d", &items[i].start, &items[i].end) != 2) return 1;
    }
    qsort(items, (size_t)n, sizeof items[0], by_end);
    int last = 0, count = 0;
    for (int i = 0; i < n; ++i) {
        if (items[i].start >= last) {
            last = items[i].end;
            ++count;
        }
    }
    printf("%d\\n", count);
    return 0;
}`,
      python: `n = int(input())
items = [tuple(map(int, input().split())) for _ in range(n)]
items.sort(key=lambda item: item[1])
last, count = 0, 0
for start, end in items:
    if start >= last:
        last = end
        count += 1
print(count)`,
      java: `import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int[][] items = new int[in.nextInt()][2];
        for (int[] item : items) {
            item[0] = in.nextInt();
            item[1] = in.nextInt();
        }
        Arrays.sort(items, Comparator.comparingInt(item -> item[1]));
        int last = 0, count = 0;
        for (int[] item : items) {
            if (item[0] >= last) {
                last = item[1];
                count++;
            }
        }
        System.out.println(count);
    }
}`,
    },
  }
]);
