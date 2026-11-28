import { defineTopics } from "./define.ts";

export const bipartiteMatching = defineTopics([
  {
    "id": "bipartite-matching",
    "stage": 6,
    "title": "Bipartite matching and augmenting paths",
    "objective": "Find the largest one-to-one pairing by rerouting previous matches when needed.",
    "prerequisites": "Bipartite graphs and depth-first search.",
    "analogy": "Assign teams to available rooms. If a preferred room is occupied, see whether its current team can move to another suitable room.",
    "explanation": "Store the current owner of each right-side vertex. For each left vertex, search its allowed neighbors. An unused right vertex completes an augmenting path. If the right vertex is occupied, recursively try reassigning its owner. Mark right vertices during each attempt to avoid cycling. A successful chain frees one room for the new left vertex and grows the matching by one.",
    "invariant": "Before processing a left vertex, the matching is maximum among the previously processed left vertices. Inserting one vertex raises the optimum by at most one. A new augmenting path must start at that new vertex because an augmenting path wholly inside the earlier graph would contradict its previous optimum.",
    "pseudocode": "for each left vertex u:\n  clear visited-right marks\n  if augment(u): increment matches\naugment(u):\n  for each allowed right vertex v not visited in this attempt:\n    mark v\n    if v is free or augment(owner[v]) succeeds:\n      assign v to u and return true\n  return false",
    "time": "O(L × (E+R)) with L left vertices, R right vertices and E allowed pairs",
    "space": "O(L+R+E) for adjacency lists, matches, marks and recursion",
    "trace": [
      [
        "Left A,B | right X,Y | A→X,Y and B→X",
        "An early greedy choice may put A in X even though A has an alternative."
      ],
      [
        "Match A→X",
        "One pairing is valid so far."
      ],
      [
        "Try B→X, find X occupied",
        "Search for an alternative for A and discover free Y."
      ],
      [
        "Reassign A→Y and B→X",
        "The alternating chain grows the total to two pairs."
      ]
    ],
    "misconception": "An occupied right vertex is not a dead end. Its owner might be able to move and free it.",
    "debug": "Try an instance where taking the first available neighbor greedily initially blocks someone, but a reassignment resolves it.",
    "fill": "Which marks must be cleared before each new left vertex’s search?",
    "edgeCases": [
      "A side may have zero vertices.",
      "Repeated allowed pairs are harmless.",
      "An unmatched left vertex does not invalidate other matches."
    ],
    "revision": "Why is it safe to update ownership only when the recursive search succeeds?",
    "further": "Build the equivalent unit-capacity max-flow graph and compare the augmenting paths.",
    "quiz": {
      "question": "What should happen when the desired right vertex is already matched?",
      "answers": [
        "Discard it permanently",
        "Try to reassign its current owner",
        "Drop the current owner without retrying"
      ],
      "correct": 1,
      "feedback": "Reassigning an existing owner can free the desired vertex while preserving all earlier matches."
    },
    "practice": {
      "title": "Assign volunteers to available roles",
      "description": "Find the largest set of distinct volunteer-to-role assignments using only allowed pairs.",
      "format": "Read L R m, followed by m pairs u v with zero-based left and right IDs. Print the maximum number of matches.",
      "constraints": "0 ≤ L,R ≤ 120, 0 ≤ m ≤ 400, and each pair uses a valid vertex on its side.",
      "input": "2 2 3\n0 0\n0 1\n1 0\n",
      "output": "2\n",
      "hints": [
        "Follow a right vertex back to its current partner when necessary.",
        "Use fresh right-side marks for each attempted augmentation."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int first[120], neighbor[400], next[400], owner[120], seen[120];
static int augment(int left) {
    for (int edge = first[left]; edge != -1; edge = next[edge]) {
        int right = neighbor[edge];
        if (seen[right]) continue;
        seen[right] = 1;
        if (owner[right] == -1 || augment(owner[right])) {
            owner[right] = left;
            return 1;
        }
    }
    return 0;
}
int main(void) {
    int left_count, right_count, m, answer = 0;
    if (scanf("%d%d%d", &left_count, &right_count, &m) != 3) return 0;
    for (int u = 0; u < left_count; u++) first[u] = -1;
    for (int v = 0; v < right_count; v++) owner[v] = -1;
    for (int edge = 0; edge < m; edge++) {
        int u, v;
        scanf("%d%d", &u, &v);
        neighbor[edge] = v;
        next[edge] = first[u];
        first[u] = edge;
    }
    for (int u = 0; u < left_count; u++) {
        for (int v = 0; v < right_count; v++) seen[v] = 0;
        answer += augment(u);
    }
    printf("%d\\n", answer);
    return 0;
}`,
      python: `left_count, right_count, m = map(int, input().split())
adjacent = [[] for _ in range(left_count)]
for _ in range(m):
    u, v = map(int, input().split())
    adjacent[u].append(v)
owner = [-1] * right_count

def augment(u, seen):
    for v in adjacent[u]:
        if seen[v]:
            continue
        seen[v] = True
        if owner[v] == -1 or augment(owner[v], seen):
            owner[v] = u
            return True
    return False

answer = 0
for u in range(left_count):
    answer += augment(u, [False] * right_count)
print(answer)`,
      java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;
class Main {
    static boolean augment(int u, ArrayList<ArrayList<Integer>> adjacent, int[] owner, boolean[] seen) {
        for (int v : adjacent.get(u)) {
            if (seen[v]) continue;
            seen[v] = true;
            if (owner[v] == -1 || augment(owner[v], adjacent, owner, seen)) {
                owner[v] = u;
                return true;
            }
        }
        return false;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int leftCount = in.nextInt(), rightCount = in.nextInt(), m = in.nextInt(), answer = 0;
        var adjacent = new ArrayList<ArrayList<Integer>>();
        for (int u = 0; u < leftCount; u++) adjacent.add(new ArrayList<>());
        for (int i = 0; i < m; i++) adjacent.get(in.nextInt()).add(in.nextInt());
        int[] owner = new int[rightCount];
        Arrays.fill(owner, -1);
        for (int u = 0; u < leftCount; u++) {
            if (augment(u, adjacent, owner, new boolean[rightCount])) answer++;
        }
        System.out.println(answer);
    }
}`,
    },
  }
]);
