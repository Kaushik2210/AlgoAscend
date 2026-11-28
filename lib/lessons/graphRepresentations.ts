import { defineTopics } from "./define.ts";

export const graphRepresentations = defineTopics([
  {
    "id": "graph-representations",
    "stage": 6,
    "title": "Edge lists, adjacency lists, and matrices",
    "objective": "Choose a graph representation based on memory, edge queries, and neighbor traversal.",
    "prerequisites": "Arrays, lists, and zero-based indices.",
    "analogy": "A road survey can be filed as a chronological list of roads, neighborhood lists by town, or a table with a checkbox for each pair of towns.",
    "explanation": "An edge list stores endpoints together and suits algorithms that scan or sort every edge. An adjacency list groups edges by their starting vertex and suits graph traversals. An adjacency matrix gives constant-time membership checks but needs one entry per pair. For undirected input, update both directions. This exercise’s matrix indicates simple adjacency, so repeated edges set an existing cell to one.",
    "invariant": "After processing any prefix of the input, matrix[u][v] equals one exactly when the prefix contains at least one undirected edge between u and v. The matrix is symmetric throughout.",
    "pseudocode": "create an n×n zero matrix\nfor each edge (u,v):\n  matrix[u][v] = matrix[v][u] = 1\nprint all rows",
    "time": "O(n²+m) to build and print the matrix",
    "space": "O(n²) for the matrix. An adjacency list or edge list uses O(n+m) or O(m) respectively",
    "trace": [
      [
        "n=3, edges 0—2 and 0—1",
        "The edge list stores only the two pairs."
      ],
      [
        "Adjacency lists: 0→[2,1], 1→[0], 2→[0]",
        "An undirected edge produces a neighbor entry at each endpoint."
      ],
      [
        "Matrix row 0 is [0,1,1]",
        "A matrix supports a direct test for adjacency to either vertex."
      ],
      [
        "Rows 1 and 2 are [1,0,0]",
        "The full table is symmetric because each input connection was recorded twice."
      ]
    ],
    "misconception": "A binary adjacency matrix does not count parallel edges. Use integer counts or edge IDs when multiplicity matters.",
    "debug": "Try one repeated edge and a self-loop. Check that repeated records remain one and only the loop changes its diagonal entry.",
    "fill": "Why might an adjacency list be cheaper than a matrix for a graph with few edges?",
    "edgeCases": [
      "An isolated vertex has an all-zero matrix row.",
      "A self-loop occupies one diagonal matrix cell.",
      "Parallel edges collapse in a binary adjacency matrix."
    ],
    "revision": "When would you choose a matrix even if adjacency lists use less memory?",
    "further": "Store weighted edges and compare how a matrix and an adjacency list retain parallel edges.",
    "quiz": {
      "question": "Which representation directly answers whether u and v are adjacent with one lookup?",
      "answers": [
        "Edge list",
        "Adjacency matrix",
        "Unsorted adjacency list"
      ],
      "correct": 1,
      "feedback": "A matrix gives direct access to matrix[u][v]. The lists may need to inspect several entries."
    },
    "practice": {
      "title": "Convert a road list into an adjacency matrix",
      "description": "Print a binary adjacency matrix for the given undirected road list.",
      "format": "Read n m, then m pairs u v. Print n rows with n space-separated zeros and ones.",
      "constraints": "1 ≤ n ≤ 20, 0 ≤ m ≤ 250, and 0 ≤ u,v < n.",
      "input": "3 2\n0 2\n0 1\n",
      "output": "0 1 1\n1 0 0\n1 0 0\n",
      "hints": [
        "Start with an all-zero matrix.",
        "Mark both directions for each edge."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, m, matrix[20][20] = {0};
    if (scanf("%d%d", &n, &m) != 2) return 0;
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        matrix[u][v] = matrix[v][u] = 1;
    }
    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) printf("%s%d", v ? " " : "", matrix[u][v]);
        puts("");
    }
    return 0;
}`,
      python: `n, m = map(int, input().split())
matrix = [[0] * n for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    matrix[u][v] = matrix[v][u] = 1
for row in matrix:
    print(*row)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), m = in.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < m; i++) {
            int u = in.nextInt(), v = in.nextInt();
            matrix[u][v] = matrix[v][u] = 1;
        }
        for (int[] row : matrix) {
            var output = new StringBuilder();
            for (int v = 0; v < n; v++) {
                if (v > 0) output.append(' ');
                output.append(row[v]);
            }
            System.out.println(output);
        }
    }
}`,
    },
  }
]);
