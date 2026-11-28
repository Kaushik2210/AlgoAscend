import { defineTopics } from "./define.ts";

export const orderedTreaps = defineTopics([
  {
    "id": "treap-ordered-set",
    "stage": 11,
    "title": "Treaps and ordered sets",
    "objective": "Maintain a set with insertion, deletion, rank, and k-th selection.",
    "prerequisites": "Binary search trees, subtree sizes, and randomized priorities.",
    "analogy": "File keys in alphabetical order, but give each item a shuffled priority that decides who can sit above whom.",
    "explanation": "A treap is a binary search tree by key and a heap by independent random priority. Insert by key, then rotate while a child outranks its parent. Delete by joining the left and right subtrees, choosing the higher-priority root at each step. Store subtree sizes so rank and selection can skip entire branches. The reference examples use reproducible pseudorandom seeds.",
    "invariant": "In-order traversal lists each key exactly once in increasing order. Each node has priority at least as high as its children and size equal to one plus both child sizes. Rotations and merges preserve the key order.",
    "pseudocode": "insert with BST recursion and rotate when a child outranks the root\nerase a matching root by merging its two ordered subtrees\nrank(x): add left size and root only when moving right\nselect(k): compare k with left size + 1 and skip that prefix when moving right",
    "time": "Expected O(log(s+1)) per operation with independent random priorities for s stored keys, and O(s) in the worst case",
    "space": "O(q) for the C node pool over q operations, or O(s) for live tree nodes plus recursion",
    "trace": [
      [
        "Insert 8 then 3",
        "The set is {3,8}. Its tree shape depends on priorities."
      ],
      [
        "Insert 8 again",
        "The set is unchanged. Rank of 9 counts two keys."
      ],
      [
        "Select k=2",
        "Use subtree sizes to find the second smallest key, 8."
      ],
      [
        "Erase 3",
        "The only remaining key is 8. Selection at k=2 is now invalid."
      ]
    ],
    "misconception": "Rotation preserves sorted traversal, but subtree sizes still need to be recomputed after it.",
    "debug": "Insert duplicate keys, erase a key that is absent, and test the first and last valid ranks.",
    "fill": "When moving into the right child during selection, how many ranked positions can be skipped?",
    "edgeCases": [
      "Duplicate inserts leave the set unchanged.",
      "Deleting a missing key leaves the set unchanged.",
      "An out-of-range k prints NONE."
    ],
    "revision": "What is randomized in a treap, and what order remains deterministic?",
    "further": "Extend the subtree annotation to hold multiplicities for an ordered multiset.",
    "quiz": {
      "question": "If the left subtree contains four keys, what is the current root’s 1-based rank within its subtree?",
      "answers": [
        "4",
        "5",
        "6"
      ],
      "correct": 1,
      "feedback": "The root comes after all four smaller keys."
    },
    "practice": {
      "title": "Maintain a ranked roster",
      "description": "Maintain a set of numeric IDs and answer order statistics.",
      "format": "Read q, then q lines I x to insert, D x to delete, R x to count keys strictly below x, or K k to select the 1-based k-th key. Print rank results, selected keys, or NONE when k is invalid.",
      "constraints": "0 ≤ q ≤ 350, |x| ≤ 10⁶, and 0 ≤ k ≤ 500.",
      "input": "9\nI 8\nI 3\nI 8\nR 9\nK 2\nD 3\nK 1\nK 2\nR 8\n",
      "output": "2\n8\n8\nNONE\n0\n",
      "hints": [
        "Store the current subtree size at every node.",
        "After any child replacement, update that node’s size before returning."
      ]
    },
    code: {
      c: `#include <stdint.h>
#include <stdio.h>
typedef struct { int key, left, right, size; uint32_t priority; } Node;
static Node tree[351];
static uint32_t seed = 2463534242u;
static int used;
static uint32_t priority(void) {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return seed;
}
static void pull(int v) { tree[v].size = 1 + tree[tree[v].left].size + tree[tree[v].right].size; }
static int rotate(int v, int right_child) {
    int u;
    if (right_child) { u = tree[v].right; tree[v].right = tree[u].left; tree[u].left = v; }
    else { u = tree[v].left; tree[v].left = tree[u].right; tree[u].right = v; }
    pull(v);
    pull(u);
    return u;
}
static int insert(int v, int key) {
    if (!v) {
        v = ++used;
        tree[v].key = key; tree[v].size = 1; tree[v].priority = priority();
    } else if (key < tree[v].key) {
        tree[v].left = insert(tree[v].left, key);
        if (tree[tree[v].left].priority > tree[v].priority) v = rotate(v, 0);
    } else if (key > tree[v].key) {
        tree[v].right = insert(tree[v].right, key);
        if (tree[tree[v].right].priority > tree[v].priority) v = rotate(v, 1);
    }
    pull(v);
    return v;
}
static int merge(int a, int b) {
    if (!a || !b) return a ? a : b;
    if (tree[a].priority >= tree[b].priority) { tree[a].right = merge(tree[a].right, b); pull(a); return a; }
    tree[b].left = merge(a, tree[b].left); pull(b); return b;
}
static int erase(int v, int key) {
    if (!v) return 0;
    if (key == tree[v].key) return merge(tree[v].left, tree[v].right);
    if (key < tree[v].key) tree[v].left = erase(tree[v].left, key);
    else tree[v].right = erase(tree[v].right, key);
    pull(v); return v;
}
static int rank(int v, int key) {
    if (!v) return 0;
    if (key <= tree[v].key) return rank(tree[v].left, key);
    return 1 + tree[tree[v].left].size + rank(tree[v].right, key);
}
static int select_key(int v, int k) {
    int middle = tree[tree[v].left].size + 1;
    if (k == middle) return tree[v].key;
    return k < middle ? select_key(tree[v].left, k) : select_key(tree[v].right, k - middle);
}
int main(void) {
    int q, root = 0;
    if (scanf("%d", &q) != 1) return 0;
    while (q--) {
        char operation;
        int x;
        scanf(" %c%d", &operation, &x);
        if (operation == 'I') root = insert(root, x);
        else if (operation == 'D') root = erase(root, x);
        else if (operation == 'R') printf("%d\\n", rank(root, x));
        else if (x < 1 || x > tree[root].size) puts("NONE");
        else printf("%d\\n", select_key(root, x));
    }
    return 0;
}`,
      python: `from random import Random
random = Random(42)

class Node:
    def __init__(self, key):
        self.key, self.priority = key, random.getrandbits(32)
        self.left = self.right = None
        self.size = 1

def size(v):
    return v.size if v else 0

def pull(v):
    v.size = 1 + size(v.left) + size(v.right)
    return v

def insert(v, key):
    if v is None:
        return Node(key)
    if key < v.key:
        v.left = insert(v.left, key)
        if v.left.priority > v.priority:
            u = v.left
            v.left = u.right
            u.right = pull(v)
            return pull(u)
    elif key > v.key:
        v.right = insert(v.right, key)
        if v.right.priority > v.priority:
            u = v.right
            v.right = u.left
            u.left = pull(v)
            return pull(u)
    return pull(v)

def merge(a, b):
    if a is None or b is None:
        return a or b
    if a.priority >= b.priority:
        a.right = merge(a.right, b)
        return pull(a)
    b.left = merge(a, b.left)
    return pull(b)

def erase(v, key):
    if v is None:
        return None
    if key == v.key:
        return merge(v.left, v.right)
    if key < v.key:
        v.left = erase(v.left, key)
    else:
        v.right = erase(v.right, key)
    return pull(v)

def rank(v, key):
    if v is None:
        return 0
    if key <= v.key:
        return rank(v.left, key)
    return 1 + size(v.left) + rank(v.right, key)

def select(v, k):
    middle = size(v.left) + 1
    if k == middle:
        return v.key
    return select(v.left, k) if k < middle else select(v.right, k - middle)

root = None
for _ in range(int(input())):
    operation, value = input().split()
    x = int(value)
    if operation == "I":
        root = insert(root, x)
    elif operation == "D":
        root = erase(root, x)
    elif operation == "R":
        print(rank(root, x))
    else:
        print(select(root, x) if 1 <= x <= size(root) else "NONE")`,
      java: `import java.util.Random;
import java.util.Scanner;
class Main {
    static final Random random = new Random(42);
    static class Node {
        int key, size = 1, priority = random.nextInt();
        Node left, right;
        Node(int key) { this.key = key; }
    }
    static int size(Node v) { return v == null ? 0 : v.size; }
    static Node pull(Node v) { v.size = 1 + size(v.left) + size(v.right); return v; }
    static Node insert(Node v, int key) {
        if (v == null) return new Node(key);
        if (key < v.key) {
            v.left = insert(v.left, key);
            if (v.left.priority > v.priority) {
                Node u = v.left;
                v.left = u.right; u.right = pull(v); v = u;
            }
        } else if (key > v.key) {
            v.right = insert(v.right, key);
            if (v.right.priority > v.priority) {
                Node u = v.right;
                v.right = u.left; u.left = pull(v); v = u;
            }
        }
        return pull(v);
    }
    static Node merge(Node a, Node b) {
        if (a == null) return b;
        if (b == null) return a;
        if (a.priority >= b.priority) { a.right = merge(a.right, b); return pull(a); }
        b.left = merge(a, b.left); return pull(b);
    }
    static Node erase(Node v, int key) {
        if (v == null) return null;
        if (key == v.key) return merge(v.left, v.right);
        if (key < v.key) v.left = erase(v.left, key);
        else v.right = erase(v.right, key);
        return pull(v);
    }
    static int rank(Node v, int key) {
        if (v == null) return 0;
        if (key <= v.key) return rank(v.left, key);
        return 1 + size(v.left) + rank(v.right, key);
    }
    static int select(Node v, int k) {
        int middle = size(v.left) + 1;
        if (k == middle) return v.key;
        return k < middle ? select(v.left, k) : select(v.right, k - middle);
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int q = in.nextInt();
        Node root = null;
        for (int i = 0; i < q; i++) {
            String operation = in.next();
            int x = in.nextInt();
            if (operation.equals("I")) root = insert(root, x);
            else if (operation.equals("D")) root = erase(root, x);
            else if (operation.equals("R")) System.out.println(rank(root, x));
            else if (x < 1 || x > size(root)) System.out.println("NONE");
            else System.out.println(select(root, x));
        }
    }
}`,
    },
  }
]);
