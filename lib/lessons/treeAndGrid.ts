import { defineTopics } from "./define.ts";

export const treeAndGrid = defineTopics([
  {
    "id": "binary-search-trees",
    "stage": 5,
    "title": "Binary search trees",
    "objective": "Insert and find keys by preserving the ordering rule at each tree node.",
    "prerequisites": "Binary trees and binary search.",
    "analogy": "A branching directory sends smaller labels left and larger labels right, so each comparison narrows the remaining search.",
    "explanation": "A binary search tree stores smaller keys in its left subtree and larger keys in its right subtree. This example treats duplicates as the same key. Compare with the current node, follow the matching branch, and attach at the first empty slot for insertion. The time depends on tree height. Sorted insertions can create a chain.",
    "invariant": "All keys in a node’s left subtree are smaller and all keys in its right subtree are larger. Replacing an empty child with a key that followed its search path preserves every ancestor’s ordering constraints.",
    "pseudocode": "search key from root:\n  while node exists and key differs:\n    go left if key < node.key, else right\ninsert key at the reached empty child if no existing key matches",
    "time": "O((n+q)h) worst-case time for n insertions, q queries and maximum height h. A skewed tree can have h=n",
    "space": "O(n) for stored nodes. The Python program also buffers O(q) input tokens",
    "trace": [
      [
        "Insert 7",
        "The empty root becomes 7."
      ],
      [
        "Insert 3, then 9",
        "3 takes the left branch. 9 takes the right branch."
      ],
      [
        "Find 9",
        "Compare with 7 and move right. The next key matches."
      ],
      [
        "Find 8",
        "Move right from 7, then left from 9. The empty child proves absence."
      ]
    ],
    "misconception": "A binary search tree can become skewed. Its ordering alone does not guarantee logarithmic height.",
    "debug": "Insert already sorted keys and count the comparisons required to find the final key.",
    "fill": "When key < node.key, which child can contain the key?",
    "edgeCases": [
      "An empty tree answers NO for every query.",
      "Duplicate insertions leave the set unchanged.",
      "The minimum and maximum keys follow the extreme branches."
    ],
    "revision": "Why does a missing child prove the key is absent?",
    "further": "Compare tree heights for sorted and median-first insertion orders.",
    "quiz": {
      "question": "At key 7, where could key 5 be stored?",
      "answers": [
        "The left subtree",
        "The right subtree",
        "Either subtree"
      ],
      "correct": 0,
      "feedback": "5 is smaller than 7, so the ordering invariant rules out the right subtree."
    },
    "practice": {
      "title": "Search the tree of archive labels",
      "description": "Insert labels in arrival order into a binary search tree, then answer membership queries.",
      "format": "Read n q, n insertion keys, and q query keys. Print YES or NO per query. Ignore an insertion if the key already exists.",
      "constraints": "0 ≤ n,q ≤ 350. Every key is between −10⁶ and 10⁶.",
      "input": "3 2\n7 3 9\n9 8\n",
      "output": "YES\nNO\n",
      "hints": [
        "Create a new node only when a link is empty.",
        "Equal keys terminate insertion or search."
      ]
    },
    code:{
      c: `#include <stdio.h>
typedef struct Node { int key; struct Node *left, *right; } Node;
static Node pool[350];
int main(void) {
    int n, q, used = 0;
    Node *root = NULL;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int key;
        scanf("%d", &key);
        Node **position = &root;
        while (*position && (*position)->key != key) {
            position = key < (*position)->key ? &(*position)->left : &(*position)->right;
        }
        if (!*position) {
            Node *node = &pool[used++];
            node->key = key;
            *position = node;
        }
    }
    for (int i = 0; i < q; i++) {
        int key;
        scanf("%d", &key);
        Node *node = root;
        while (node && node->key != key) node = key < node->key ? node->left : node->right;
        puts(node ? "YES" : "NO");
    }
    return 0;
}`,
      python: `import sys
class Node:
    def __init__(self, key):
        self.key = key
        self.left = self.right = None

tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
root = None
for _ in range(n):
    key = next(tokens)
    if root is None:
        root = Node(key)
        continue
    node = root
    while node.key != key:
        side = "left" if key < node.key else "right"
        child = getattr(node, side)
        if child is None:
            setattr(node, side, Node(key))
            break
        node = child
for _ in range(q):
    key = next(tokens)
    node = root
    while node is not None and node.key != key:
        node = node.left if key < node.key else node.right
    print("YES" if node is not None else "NO")`,
      java: `import java.util.Scanner;
class Main {
    static class Node {
        final int key;
        Node left, right;
        Node(int key) { this.key = key; }
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        Node root = null;
        for (int i = 0; i < n; i++) {
            int key = in.nextInt();
            if (root == null) { root = new Node(key); continue; }
            Node node = root;
            while (node.key != key) {
                if (key < node.key) {
                    if (node.left == null) { node.left = new Node(key); break; }
                    node = node.left;
                } else {
                    if (node.right == null) { node.right = new Node(key); break; }
                    node = node.right;
                }
            }
        }
        for (int i = 0; i < q; i++) {
            int key = in.nextInt();
            Node node = root;
            while (node != null && node.key != key) node = key < node.key ? node.left : node.right;
            System.out.println(node == null ? "NO" : "YES");
        }
    }
}`,
    },
  },
  {
    "id": "grid-path-dp",
    "stage": 9,
    "title": "Grid path dynamic programming",
    "objective": "Count right-and-down paths through a grid containing blocked cells.",
    "prerequisites": "Arrays, tabulation and nested loops.",
    "analogy": "Each square receives routes from the square above and the square to the left. A wall admits none.",
    "explanation": "Process cells from top to bottom and left to right. A blocked cell gets zero. The unblocked start gets one. Every other unblocked cell adds its top and left neighbors' counts. Each path arrives by exactly one of those two final moves, so the addition counts every path once.",
    "invariant": "After a cell is processed, its table entry equals the number of valid paths from the start to it. Both possible predecessor entries are already final when the current cell is evaluated.",
    "pseudocode": "for every cell in row-major order:\n  if blocked: ways=0\n  else if start: ways=1\n  else: ways=top_ways+left_ways\nprint ways at the destination",
    "time": "O(rows × columns) time",
    "space": "O(rows × columns) for the table",
    "trace": [
      [
        "Grid [..#; ...]",
        "The top-right square is blocked. Start at the top left."
      ],
      [
        "Top row counts [1,1,0]",
        "Only right moves can reach the rest of the first row."
      ],
      [
        "Bottom-left=1, bottom-middle=2",
        "The middle cell adds one path from above and one from the left."
      ],
      [
        "Bottom-right=2",
        "The blocked cell above contributes zero. Both paths arrive from the left."
      ]
    ],
    "misconception": "An open cell can have zero ways when both possible predecessors are unreachable.",
    "debug": "Test a blocked start and a single-row path with a wall in the middle.",
    "fill": "Which two predecessor cells can reach (r,c) in one valid move?",
    "edgeCases": [
      "An open one-cell grid has one empty path.",
      "A blocked start or destination gives zero.",
      "A first-row cell has no predecessor above it."
    ],
    "revision": "Why is the sum of the two predecessor counts free from double counting?",
    "further": "Keep only one row and update it left to right.",
    "quiz": {
      "question": "An open cell has 2 ways from above and 3 from the left. How many ways reach it?",
      "answers": [
        "2",
        "3",
        "5"
      ],
      "correct": 2,
      "feedback": "Each path arrives through exactly one of two disjoint groups, so 2 + 3 = 5."
    },
    "practice": {
      "title": "Count safe warehouse routes",
      "description": "Count paths across a warehouse grid that move only right or down and avoid blocked cells.",
      "format": "Read rows and columns, then one row of dot or # symbols per line. Print the path count from the top-left to bottom-right.",
      "constraints": "1 ≤ rows, columns ≤ 16. Dot is open and # is blocked.",
      "input": "2 3\n..#\n...\n",
      "output": "2\n",
      "hints": [
        "Set the start to one only when open.",
        "Treat an out-of-grid neighbor as zero."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int rows, cols, dp[17][17] = {0};
    if (scanf("%d%d", &rows, &cols) != 2) return 0;
    dp[0][1] = 1;
    for (int r = 1; r <= rows; r++) {
        char row[17];
        scanf("%16s", row);
        for (int c = 1; c <= cols; c++) {
            if (row[c - 1] == '.') dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        }
    }
    printf("%d\\n", dp[rows][cols]);
    return 0;
}`,
      python: `rows, cols = map(int, input().split())
dp = [[0] * (cols + 1) for _ in range(rows + 1)]
dp[0][1] = 1
for r in range(1, rows + 1):
    line = input()
    for c in range(1, cols + 1):
        if line[c - 1] == ".":
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
print(dp[rows][cols])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int rows = in.nextInt(), cols = in.nextInt();
        int[][] dp = new int[rows + 1][cols + 1];
        dp[0][1] = 1;
        for (int r = 1; r <= rows; r++) {
            String line = in.next();
            for (int c = 1; c <= cols; c++) {
                if (line.charAt(c - 1) == '.') dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
            }
        }
        System.out.println(dp[rows][cols]);
    }
}`,
    },
  }
]);
