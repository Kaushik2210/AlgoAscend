import { defineTopics } from "./define.ts";

export const rerootingTrees = defineTopics([
  {
    "id": "rerooting-tree-dp",
    "stage": 5,
    "title": "Rerooting tree dynamic programming",
    "objective": "Compute the sum of distances from every vertex in linear time.",
    "prerequisites": "Tree depths, subtree sizes, and dynamic programming.",
    "analogy": "Move a depot across one road. Houses on the destination side come one step closer while houses on the other side get one step farther away.",
    "explanation": "Root the tree at zero and calculate its full distance sum from vertex depths. Compute subtree sizes for this root. When moving the query root from parent p to child v, all size[v] vertices in v’s side get one step closer. All n−size[v] vertices on the other side get one step farther. The difference is n−2×size[v]. Repeat this transfer from each parent to each child.",
    "invariant": "The stored subtree sizes describe the original root’s cut sides and stay fixed. Once answer[p] is exact, applying the cut-side distance change makes answer[v] exact.",
    "pseudocode": "calculate depths and distance sum for root zero\naccumulate subtree sizes from children to parents\nfor each child v after its parent p:\n  answer[v] = answer[p] + n − 2×size[v]\nprint all answers",
    "time": "O(n) for the three passes",
    "space": "O(n) for parent, depth, size, and answer arrays",
    "trace": [
      [
        "Line 0—1—2—3",
        "From vertex zero the distances sum to 0+1+2+3 = 6."
      ],
      [
        "Move root 0→1",
        "Three vertices get closer and one gets farther, so 6−3+1 = 4."
      ],
      [
        "Move root 1→2",
        "Two get closer and two get farther. The sum stays 4."
      ],
      [
        "Move root 2→3",
        "One gets closer and three get farther. The final sequence is [6,4,4,6]."
      ]
    ],
    "misconception": "The subtree size in the formula comes from the original rooting. Recomputing subtree sizes after each transfer is unnecessary.",
    "debug": "On a star, verify that leaves all share an answer greater than the center’s answer.",
    "fill": "How many vertices get farther when moving to a child whose original subtree has s vertices?",
    "edgeCases": [
      "A one-vertex tree has distance sum zero.",
      "On an even-length split, moving across the edge can leave the sum unchanged.",
      "Parent IDs come before their children, enabling simple forward and backward passes."
    ],
    "revision": "What changes if the crossed edge has weight w instead of one?",
    "further": "Track the maximum distance from each vertex by carrying the best contribution from its parent side.",
    "quiz": {
      "question": "In a six-vertex tree, moving to a child whose subtree contains four vertices changes the distance sum by how much?",
      "answers": [
        "−2",
        "0",
        "2"
      ],
      "correct": 0,
      "feedback": "Four distances drop by one and two rise by one, for a net change of −2."
    },
    "practice": {
      "title": "Evaluate every relay as a depot",
      "description": "For each vertex, calculate the sum of its edge distances to all vertices in the tree.",
      "format": "Read n, followed by parents of vertices 1 through n−1 when n>1. Print n sums in vertex order, separated by spaces.",
      "constraints": "1 ≤ n ≤ 500, and the parent of i lies in 0…i−1.",
      "input": "4\n0 1 2\n",
      "output": "6 4 4 6\n",
      "hints": [
        "Use reverse vertex order for subtree sizes.",
        "Transfer the distance sum by counting both sides of the parent-child edge."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, parent[500], depth[500] = {0}, size[500], answer[500] = {0};
    if (scanf("%d", &n) != 1) return 0;
    for (int v = 0; v < n; v++) size[v] = 1;
    for (int v = 1; v < n; v++) {
        scanf("%d", &parent[v]);
        depth[v] = depth[parent[v]] + 1;
        answer[0] += depth[v];
    }
    for (int v = n - 1; v > 0; v--) size[parent[v]] += size[v];
    for (int v = 1; v < n; v++) answer[v] = answer[parent[v]] + n - 2 * size[v];
    for (int v = 0; v < n; v++) printf("%s%d", v ? " " : "", answer[v]);
    puts("");
    return 0;
}`,
      python: `n = int(input())
parent = [-1] + (list(map(int, input().split())) if n > 1 else [])
depth, size, answer = [0] * n, [1] * n, [0] * n
for v in range(1, n):
    depth[v] = depth[parent[v]] + 1
    answer[0] += depth[v]
for v in range(n - 1, 0, -1):
    size[parent[v]] += size[v]
for v in range(1, n):
    answer[v] = answer[parent[v]] + n - 2 * size[v]
print(*answer)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        int[] parent = new int[n], depth = new int[n], size = new int[n], answer = new int[n];
        Arrays.fill(size, 1);
        for (int v = 1; v < n; v++) {
            parent[v] = in.nextInt();
            depth[v] = depth[parent[v]] + 1;
            answer[0] += depth[v];
        }
        for (int v = n - 1; v > 0; v--) size[parent[v]] += size[v];
        for (int v = 1; v < n; v++) answer[v] = answer[parent[v]] + n - 2 * size[v];
        var result = new StringBuilder();
        for (int v = 0; v < n; v++) {
            if (v > 0) result.append(' ');
            result.append(answer[v]);
        }
        System.out.println(result);
    }
}`,
    },
  }
]);
