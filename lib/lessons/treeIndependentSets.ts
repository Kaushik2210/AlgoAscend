import { defineTopics } from "./define.ts";

export const treeIndependentSets = defineTopics([
  {
    "id": "tree-dp",
    "stage": 9,
    "title": "Tree DP with include and exclude states",
    "objective": "Find a maximum-weight selection of tree vertices with no adjacent selections.",
    "prerequisites": "Rooted trees, postorder, and DP state design.",
    "analogy": "Activate relays without activating directly connected neighbors. Each branch offers a plan for whether its first relay is active.",
    "explanation": "For each vertex v, compute take[v] when v is selected and skip[v] when it is excluded. Taking v forbids every child, so contribute each child’s skip value. Skipping v leaves each child free to choose its better state. Once a parent state is fixed, child subtrees have no edges between them.",
    "invariant": "After all children of v are processed, each state equals the optimum for v’s entire subtree under its specified selection rule.",
    "pseudocode": "take[v] starts as weight[v]; skip[v] starts as 0\nprocess every vertex v after its children:\n  take[parent] += skip[v]\n  skip[parent] += max(take[v],skip[v])\nreturn max(take[root],skip[root])",
    "time": "O(n) for n vertices",
    "space": "O(n) for parents and state arrays",
    "trace": [
      [
        "Weights [3,7,2,5,4], parents [0,0,1,1]",
        "The children of 0 are 1 and 2. The children of 1 are 3 and 4."
      ],
      [
        "Leaves 2, 3, 4",
        "Each leaf offers its own value if taken, or zero if skipped."
      ],
      [
        "At 1: take=7, skip=9",
        "Skipping 1 allows both 5 and 4."
      ],
      [
        "At 0: take=12, skip=11",
        "Taking the root allows grandchildren 3 and 4. Return 12."
      ]
    ],
    "misconception": "Selecting a parent forbids its children only. Deeper descendants can still be selected when they do not touch any selected vertex.",
    "debug": "Use a path with high values at both ends and an all-negative tree.",
    "fill": "If the parent is selected, which child state can be included?",
    "edgeCases": [
      "A single vertex competes against taking nothing.",
      "All-negative input has optimum zero.",
      "Sibling vertices can be jointly selected."
    ],
    "revision": "Why does the parent’s state let us combine different child subtrees independently?",
    "further": "Backtrack through the stored choices to return a selected vertex set.",
    "quiz": {
      "question": "If v is skipped, how should the contribution of a child u be chosen?",
      "answers": [
        "Always take u",
        "Always skip u",
        "Use the better of take[u] and skip[u]"
      ],
      "correct": 2,
      "feedback": "There is no selected parent to constrain the child, so either state is valid."
    },
    "practice": {
      "title": "Choose nonadjacent power relays",
      "description": "Choose a maximum-weight group of vertices with no edge between selected vertices. The empty choice is allowed.",
      "format": "Read n, n weights, and the parent of each vertex 1 through n−1. Print the maximum weight.",
      "constraints": "1 ≤ n ≤ 500, |weight| ≤ 10⁵, and each parent of i is in 0…i−1.",
      "input": "5\n3 7 2 5 4\n0 0 1 1\n",
      "output": "12\n",
      "hints": [
        "Keep one state for selecting v and one for skipping it.",
        "Process higher vertex IDs before their parents."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, take[500], skip[500] = {0}, parent[500];
    if (scanf("%d", &n) != 1) return 0;
    for (int v = 0; v < n; v++) scanf("%d", &take[v]);
    for (int v = 1; v < n; v++) scanf("%d", &parent[v]);
    for (int v = n - 1; v > 0; v--) {
        take[parent[v]] += skip[v];
        skip[parent[v]] += take[v] > skip[v] ? take[v] : skip[v];
    }
    printf("%d\\n", take[0] > skip[0] ? take[0] : skip[0]);
    return 0;
}`,
      python: `n = int(input())
take = list(map(int, input().split()))
parent = [-1] + (list(map(int, input().split())) if n > 1 else [])
skip = [0] * n
for v in range(n - 1, 0, -1):
    take[parent[v]] += skip[v]
    skip[parent[v]] += max(take[v], skip[v])
print(max(take[0], skip[0]))`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        int[] take = new int[n], skip = new int[n], parent = new int[n];
        for (int v = 0; v < n; v++) take[v] = in.nextInt();
        for (int v = 1; v < n; v++) parent[v] = in.nextInt();
        for (int v = n - 1; v > 0; v--) {
            take[parent[v]] += skip[v];
            skip[parent[v]] += Math.max(take[v], skip[v]);
        }
        System.out.println(Math.max(take[0], skip[0]));
    }
}`,
    },
  }
]);
