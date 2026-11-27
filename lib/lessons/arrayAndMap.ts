import { defineTopics } from "./define.ts";

export const arrayAndMap = defineTopics([
  {
    "id": "matrix-indexing",
    "stage": 3,
    "title": "Arrays and matrix indexing",
    "objective": "Translate row and column coordinates into array access and transpose a rectangular matrix.",
    "prerequisites": "Nested loops, index bounds and variables.",
    "analogy": "Swap the role of streets and avenues on a map. Each location keeps its value while its two coordinates exchange places.",
    "explanation": "A matrix has a row count and a column count. Transposition maps A[r][c] to T[c][r]. A C matrix can be stored in one flat array using r×columns+c. Python and Java commonly use one index for the row and another for the value inside it. The displayed solution prints the transposed matrix directly from the original values.",
    "invariant": "At output row c and output column r, retrieve the original value at row r and column c. The swapped output dimensions ensure that every original cell appears exactly once.",
    "pseudocode": "read R rows of C values\nfor c from 0 through C−1:\n  for r from 0 through R−1:\n    output A[r][c] in row c",
    "time": "O(RC) time",
    "space": "O(RC) for the original matrix",
    "trace": [
      [
        "A = [[1,2,3], [4,5,6]]",
        "The original shape is two rows by three columns."
      ],
      [
        "T row 0 → 1 4",
        "Read original column zero across the two rows."
      ],
      [
        "T row 1 → 2 5",
        "Read original column one."
      ],
      [
        "T row 2 → 3 6",
        "Read original column two. The new shape is three by two."
      ]
    ],
    "misconception": "Swapping loop order without consulting the original indexing rule can produce out-of-bound accesses in non-square matrices.",
    "debug": "Test two rows by three columns and check that the result has three rows.",
    "fill": "In flat row-major storage, what expression gives the address index for (r,c)?",
    "edgeCases": [
      "A one-row matrix becomes a one-column matrix.",
      "A one-cell matrix stays unchanged.",
      "Negative values are copied just like any other value."
    ],
    "revision": "Which original positions supply the first transposed row?",
    "further": "Prove that transposing twice restores the original matrix.",
    "quiz": {
      "question": "What is the shape after transposing a 2-by-5 matrix?",
      "answers": [
        "2 by 5",
        "5 by 2",
        "5 by 5"
      ],
      "correct": 1,
      "feedback": "Every original column becomes an output row and every original row becomes an output column."
    },
    "practice": {
      "title": "Swap survey axes",
      "description": "Exchange the row and column axes of a survey table.",
      "format": "Read R C, followed by R lines of C signed integers. Print the transpose as C rows of R space-separated integers.",
      "constraints": "1 ≤ R,C ≤ 20. Every value is between −10³ and 10³.",
      "input": "2 3\n1 2 3\n4 5 6\n",
      "output": "1 4\n2 5\n3 6\n",
      "hints": [
        "The output dimensions are reversed.",
        "An output row traces one original column."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int rows, cols, values[400];
    if (scanf("%d%d", &rows, &cols) != 2) return 0;
    for (int i = 0; i < rows * cols; i++) scanf("%d", &values[i]);
    for (int c = 0; c < cols; c++) {
        for (int r = 0; r < rows; r++) printf("%s%d", r ? " " : "", values[r * cols + c]);
        puts("");
    }
    return 0;
}`,
      python: `rows, cols = map(int, input().split())
values = [list(map(int, input().split())) for _ in range(rows)]
for col in range(cols):
    print(*(values[row][col] for row in range(rows)))`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int rows = in.nextInt(), cols = in.nextInt();
        int[][] values = new int[rows][cols];
        for (int[] row : values) for (int c = 0; c < cols; c++) row[c] = in.nextInt();
        for (int c = 0; c < cols; c++) {
            var output = new StringBuilder();
            for (int r = 0; r < rows; r++) {
                if (r != 0) output.append(' ');
                output.append(values[r][c]);
            }
            System.out.println(output);
        }
    }
}`,
    },
  },
  {
    "id": "frequency-maps",
    "stage": 4,
    "title": "Frequency counting and hash maps",
    "objective": "Build key-to-count mappings and answer repeated frequency queries.",
    "prerequisites": "Arrays, integer remainders and loops.",
    "analogy": "Use a labeled bin for each distinct token and raise its tally whenever the token reappears.",
    "explanation": "Map each distinct key to its current count. Increment the entry for every arrival and look up each query, defaulting to zero. The C version uses open addressing with linear probing. With collisions, probe consecutive slots until finding the key or an unused slot. Python uses a dictionary and Java uses a HashMap. A set stores membership when counts are unnecessary.",
    "invariant": "After processing k arrivals, every stored key maps to its exact frequency in the first k arrivals. In the C table a key can be found before the first unused slot in its probe sequence because insertion uses the same sequence and entries are never deleted.",
    "pseudocode": "counts = empty map\nfor each key: counts[key] = counts.get(key,0)+1\nfor each query: print counts.get(query,0)",
    "time": "O(n+q) expected with well-distributed hashes. Clustering can make an open-addressing operation linear in the number of occupied slots",
    "space": "O(n) distinct-key storage when table capacity scales with n. The Python program also buffers O(q) query tokens",
    "trace": [
      [
        "Arrivals [8, −1, 8]",
        "Start with an empty mapping."
      ],
      [
        "Read 8 → {8:1}",
        "Missing entries begin at zero."
      ],
      [
        "Read −1, then 8 → {8:2, −1:1}",
        "Increment the matching entry when a key repeats."
      ],
      [
        "Queries 8, 7 → 2, 0",
        "A missing key has frequency zero."
      ]
    ],
    "misconception": "A collision means keys share a starting slot, even if they differ. Confirm key equality before reusing an entry.",
    "debug": "Query both −1 and a key that hashes to the same initial bucket. Both counts must remain independent.",
    "fill": "What count should a lookup return for a missing key?",
    "edgeCases": [
      "Negative keys are valid.",
      "Duplicate arrivals increment the existing count.",
      "A query never inserts a new key."
    ],
    "revision": "How does a count map differ from a membership set?",
    "further": "Keep the first position of each key as another field and return it for repeated search queries.",
    "quiz": {
      "question": "If a queried key never appeared, what is its frequency?",
      "answers": [
        "−1",
        "0",
        "1"
      ],
      "correct": 1,
      "feedback": "No arrival contributed to its count, so the frequency is zero."
    },
    "practice": {
      "title": "Count incoming labels",
      "description": "Count how often each queried label appeared in an arrival log.",
      "format": "Read n q, followed by n arrival keys and q query keys. Print one frequency per query.",
      "constraints": "0 ≤ n,q ≤ 350. Keys are integers between −10⁶ and 10⁶.",
      "input": "3 2\n8 -1 8\n8 7\n",
      "output": "2\n0\n",
      "hints": [
        "Keep exactly one count per distinct key.",
        "Treat absent keys as frequency zero."
      ]
    },
    code:{
      c: `#include <stdio.h>
#define CAPACITY 1021
static int keys[CAPACITY], counts[CAPACITY];
static int slot_for(int key) {
    int slot = key % CAPACITY;
    if (slot < 0) slot += CAPACITY;
    while (counts[slot] && keys[slot] != key) {
        slot = (slot + 1) % CAPACITY;
    }
    return slot;
}
int main(void) {
    int n, q;
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int key;
        scanf("%d", &key);
        int slot = slot_for(key);
        keys[slot] = key;
        counts[slot]++;
    }
    for (int i = 0; i < q; i++) {
        int key;
        scanf("%d", &key);
        printf("%d\\n", counts[slot_for(key)]);
    }
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
counts = {}
for _ in range(n):
    key = next(tokens)
    counts[key] = counts.get(key, 0) + 1
for _ in range(q):
    print(counts.get(next(tokens), 0))`,
      java: `import java.util.HashMap;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt();
        var counts = new HashMap<Integer, Integer>();
        for (int i = 0; i < n; i++) {
            int key = in.nextInt();
            counts.put(key, counts.getOrDefault(key, 0) + 1);
        }
        for (int i = 0; i < q; i++) System.out.println(counts.getOrDefault(in.nextInt(), 0));
    }
}`,
    },
  }
]);
