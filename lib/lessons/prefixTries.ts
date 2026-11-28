import { defineTopics } from "./define.ts";

export const prefixTries = defineTopics([
  {
    "id": "prefix-tries",
    "stage": 5,
    "title": "Tries and prefix counts",
    "objective": "Share common word prefixes and answer how many stored words begin with a requested prefix.",
    "prerequisites": "Rooted trees, strings, and character indices.",
    "analogy": "A filing cabinet uses one drawer for each next letter. Words with the same beginning share the same route through the cabinet.",
    "explanation": "A trie stores one edge per next letter. Each traversed node represents the word prefix along its root path. During insertion, increase a count at every node visited. To answer a prefix query, follow its letters and return the final node’s count. A missing transition means no stored word has that prefix.",
    "invariant": "Each nonroot node’s count equals the number of inserted words whose prefix spells the path to that node. Repeated inserted words each contribute once along their path.",
    "pseudocode": "for each word:\n  v = root\n  for letter in word:\n    create or follow its edge; count[v]++\nfor each prefix:\n  follow its path; report zero if any edge is missing\n  otherwise report the final count",
    "time": "O(P+Q) for total inserted letters P and query letters Q with a fixed alphabet",
    "space": "O(26P) for a dense lowercase transition table, or O(P) with sparse child maps",
    "trace": [
      [
        "Insert cat, car, and cat",
        "All three insertions pass through c and ca."
      ],
      [
        "Counts at c and ca become three",
        "The shared prefix nodes hold a count for each inserted token."
      ],
      [
        "The node for cat has count two",
        "The repeated word shares the same path and contributes a second count."
      ],
      [
        "Query cap",
        "The edge for p after ca is missing, so the result is zero."
      ]
    ],
    "misconception": "A node’s prefix count can exceed its exact-word count because longer inserted words also visit the node.",
    "debug": "Insert one word that is itself the prefix of another, then query both prefixes.",
    "fill": "What should the lookup return as soon as a required edge is missing?",
    "edgeCases": [
      "An empty collection answers zero for every prefix.",
      "Repeated words count separately.",
      "A prefix equal to a full word also counts longer words beginning with it."
    ],
    "revision": "How would you add exact-word queries without losing the current prefix counts?",
    "further": "Use the same trie transitions as the starting point for Aho–Corasick patterns and failure links.",
    "quiz": {
      "question": "After inserting cat, car, and cat, what is the count for prefix ca?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 2,
      "feedback": "Each of the three insertions takes the path through ca."
    },
    "practice": {
      "title": "Count dictionary entries by prefix",
      "description": "Count how many inserted lowercase words begin with each requested prefix.",
      "format": "Read n q, followed by n words and q prefixes, one per line. Print one count per prefix. Duplicate words count separately.",
      "constraints": "0 ≤ n,q ≤ 200, the total inserted length is at most 1000, each query prefix has 1 to 20 characters, and every token contains lowercase ASCII letters only.",
      "input": "3 4\ncat\ncar\ncat\nca\ncat\ncap\nc\n",
      "output": "3\n2\n0\n3\n",
      "hints": [
        "Increment a node’s count on every insertion that passes through it.",
        "The answer comes from the final prefix node, even if it has children."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int child[1001][26], count[1001], used = 1;
int main(void) {
    int n, q;
    char word[1001];
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) {
        scanf("%1000s", word);
        int v = 0;
        for (int j = 0; word[j]; j++) {
            int c = word[j] - 'a';
            if (!child[v][c]) child[v][c] = used++;
            v = child[v][c];
            count[v]++;
        }
    }
    for (int i = 0; i < q; i++) {
        scanf("%20s", word);
        int v = 0;
        for (int j = 0; word[j]; j++) {
            v = child[v][word[j] - 'a'];
            if (!v) break;
        }
        printf("%d\\n", count[v]);
    }
    return 0;
}`,
      python: `n, q = map(int, input().split())
children, counts = [{}], [0]
for _ in range(n):
    v = 0
    for letter in input():
        if letter not in children[v]:
            children[v][letter] = len(children)
            children.append({})
            counts.append(0)
        v = children[v][letter]
        counts[v] += 1
for _ in range(q):
    v = 0
    for letter in input():
        v = children[v].get(letter, 0)
        if not v:
            break
    print(counts[v])`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), used = 1;
        int[][] child = new int[1001][26];
        int[] count = new int[1001];
        for (int i = 0; i < n; i++) {
            int v = 0;
            for (char letter : in.next().toCharArray()) {
                int c = letter - 'a';
                if (child[v][c] == 0) child[v][c] = used++;
                v = child[v][c];
                count[v]++;
            }
        }
        for (int i = 0; i < q; i++) {
            int v = 0;
            for (char letter : in.next().toCharArray()) {
                v = child[v][letter - 'a'];
                if (v == 0) break;
            }
            System.out.println(count[v]);
        }
    }
}`,
    },
  }
]);
