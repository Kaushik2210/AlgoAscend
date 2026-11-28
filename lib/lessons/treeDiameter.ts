import { defineTopics } from "./define.ts";

export const treeDiameter = defineTopics([
  {
    "id": "tree-diameter",
    "stage": 5,
    "title": "Tree diameter with bottom-up tree DP",
    "objective": "Find the longest path in a tree by combining the two deepest downward branches at each vertex.",
    "prerequisites": "Rooted trees, heights and dynamic programming.",
    "analogy": "Two walkers leave a junction in different directions. The longest route through that junction combines its two longest separate downward trails.",
    "explanation": "Every tree path has one highest vertex with respect to the root. At that vertex it can combine two downward branches from different children, or use just one branch when an endpoint is the vertex itself. Process children before parents. Store the two greatest child branch lengths for each vertex and maximize their sum.",
    "invariant": "When a vertex is evaluated, its two stored lengths are its longest downward paths through different children, with zero for an absent branch. The candidate accounts for the longest path whose highest vertex is that vertex.",
    "pseudocode": "best1 and best2 start at zero\nvisit vertices children first:\n  diameter = max(diameter,best1[v]+best2[v])\n  if v has a parent:\n    update the parent's two largest branches with best1[v]+1\nprint diameter",
    "time": "O(n) time for the parent-order input",
    "space": "O(n) for parents and branch lengths",
    "trace": [
      [
        "Parents: 1→0, 2→0, 3→1, 4→2",
        "The longest path joins leaves 3 and 4 through the root."
      ],
      [
        "Process vertices 4 and 3",
        "Each contributes a branch of length 1 to its parent."
      ],
      [
        "Process vertices 2 and 1",
        "Each contributes a branch of length 2 to root 0."
      ],
      [
        "Root combines lengths 2+2",
        "The distance from 3 to 4 is four edges, the diameter."
      ]
    ],
    "misconception": "The diameter need not pass through the root. Check the candidate at every vertex.",
    "debug": "Attach a short root branch above the meeting point of two long branches. Check that the answer comes from below the root.",
    "fill": "What should a vertex contribute to its parent if its longest downward path uses h edges?",
    "edgeCases": [
      "One vertex has diameter zero.",
      "A path of n vertices has diameter n−1.",
      "Equal branch lengths can be used together if they come from distinct children."
    ],
    "revision": "Why do two branches need different first children?",
    "further": "Use computed heights to reconstruct the endpoint of each selected branch.",
    "quiz": {
      "question": "Two branches from different children have lengths 3 and 4. How long is the path through their parent?",
      "answers": [
        "4 edges",
        "6 edges",
        "7 edges"
      ],
      "correct": 2,
      "feedback": "Each edge belongs to exactly one branch, so the total is 3 + 4."
    },
    "practice": {
      "title": "Find the longest path through the campus tree",
      "description": "Given a rooted tree, report the number of edges on its longest path.",
      "format": "Read n, then the parent of each vertex from 1 to n−1. Print the diameter in edges.",
      "constraints": "1 ≤ n ≤ 500. The parent of i is from 0 through i−1.",
      "input": "5\n0 0 1 2\n",
      "output": "4\n",
      "hints": [
        "Use the given ordering to process larger vertex IDs first.",
        "Only the two greatest downward branch lengths are needed at each vertex."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, parent[500], first[500] = {0}, second[500] = {0}, diameter = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 1; i < n; i++) scanf("%d", &parent[i]);
    for (int v = n - 1; v >= 0; v--) {
        int through = first[v] + second[v];
        if (through > diameter) diameter = through;
        if (v > 0) {
            int p = parent[v], branch = first[v] + 1;
            if (branch > first[p]) { second[p] = first[p]; first[p] = branch; }
            else if (branch > second[p]) second[p] = branch;
        }
    }
    printf("%d\\n", diameter);
    return 0;
}`,
      python: `import sys
n, *parents = map(int, sys.stdin.buffer.read().split())
parents.insert(0, -1)
first, second = [0] * n, [0] * n
diameter = 0
for vertex in range(n - 1, -1, -1):
    diameter = max(diameter, first[vertex] + second[vertex])
    if vertex > 0:
        parent = parents[vertex]
        branch = first[vertex] + 1
        if branch > first[parent]:
            first[parent], second[parent] = branch, first[parent]
        elif branch > second[parent]:
            second[parent] = branch
print(diameter)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), diameter = 0;
        int[] parent = new int[n], first = new int[n], second = new int[n];
        for (int i = 1; i < n; i++) parent[i] = in.nextInt();
        for (int v = n - 1; v >= 0; v--) {
            diameter = Math.max(diameter, first[v] + second[v]);
            if (v > 0) {
                int p = parent[v], branch = first[v] + 1;
                if (branch > first[p]) { second[p] = first[p]; first[p] = branch; }
                else if (branch > second[p]) second[p] = branch;
            }
        }
        System.out.println(diameter);
    }
}`,
    },
  }
]);
