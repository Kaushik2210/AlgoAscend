import { defineTopics } from "./define.ts";

export const analysisBasics = defineTopics([
  {
    "id": "amortized-array-growth",
    "stage": 2,
    "title": "Amortized analysis and dynamic arrays",
    "objective": "Prove that doubling capacity gives amortized constant-time append by counting copies.",
    "prerequisites": "Arrays, loops and geometric sums.",
    "analogy": "A shelf occasionally moves to a larger room. Each move makes room for twice as many boxes so the moves become less frequent.",
    "explanation": "When a capacity-c array is full, allocate twice the space and copy its c items before appending. Individual growth operations are expensive. Across n appends the copied capacities form 1 + 2 + 4 + …, which is less than 2n. Adding the n writes still gives a linear total. Amortized analysis bounds the whole sequence without assuming an input distribution.",
    "invariant": "Before each append, size is the number of stored items and capacity is the smallest reached power of two that can hold size, with initial capacity one. Growth occurs exactly when size equals capacity, and copies exactly size items.",
    "pseudocode": "capacity = 1; copies = 0\nfor size from 0 through n−1:\n  if size == capacity:\n    copies += capacity\n    capacity *= 2\nprint capacity and copies",
    "time": "O(n) for the displayed simulation. An actual append costs O(n) on a growth step and O(1) amortized over the sequence",
    "space": "O(1) for the simulation. The real array needs O(n) storage and O(n) temporary capacity while moving",
    "trace": [
      [
        "size=0, capacity=1, copies=0",
        "Begin with an empty array and one reserved slot."
      ],
      [
        "size=1, capacity=1, copies=0",
        "The first item fits without copying."
      ],
      [
        "size=2, capacity=2, copies=1",
        "The second append copies the first item into the new array."
      ],
      [
        "size=3, capacity=4, copies=3",
        "The third append copies two existing items. The fourth can use an empty slot."
      ]
    ],
    "misconception": "O(1) amortized does not cap the work done by every individual append.",
    "debug": "Use n=4 and n=5. The latter grows from capacity four just before it writes its fifth item.",
    "fill": "What geometric sum gives copies when the final capacity is eight?",
    "edgeCases": [
      "Zero appends leave capacity one and require zero copies.",
      "Reaching capacity exactly causes no growth until the next append.",
      "The exercise counts copies of existing items only."
    ],
    "revision": "Why does doubling prevent copy work from growing quadratically?",
    "further": "Compare the total copying if capacity grows by one instead of doubling.",
    "quiz": {
      "question": "After three appends, how many existing items have been copied in total?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 2,
      "feedback": "The second append copies one existing item. The third copies two more."
    },
    "practice": {
      "title": "Count the shelf moves",
      "description": "A dynamic buffer starts at capacity one and doubles when full. Count the relocated items.",
      "format": "Read n. Print final capacity and total number of copied existing items, separated by one space.",
      "constraints": "0 ≤ n ≤ 100,000.",
      "input": "3\n",
      "output": "4 3\n",
      "hints": [
        "The first write does not require a move.",
        "When a move occurs, add the old capacity to the copy count."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, capacity = 1, copies = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int size = 0; size < n; size++) {
        if (size == capacity) {
            copies += capacity;
            capacity *= 2;
        }
    }
    printf("%d %d\\n", capacity, copies);
    return 0;
}`,
      python: `n = int(input())
capacity, copies = 1, 0
for size in range(n):
    if size == capacity:
        copies += capacity
        capacity *= 2
print(capacity, copies)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        int capacity = 1, copies = 0;
        for (int size = 0; size < n; size++) {
            if (size == capacity) {
                copies += capacity;
                capacity *= 2;
            }
        }
        System.out.println(capacity + " " + copies);
    }
}`,
    },
  },
  {
    "id": "asymptotic-bounds",
    "stage": 2,
    "title": "Asymptotic bounds and operation budgets",
    "objective": "Distinguish an upper bound, a lower bound, and a tight bound using an exact loop count.",
    "prerequisites": "Nested loops and integer arithmetic.",
    "analogy": "Estimate event capacity by counting pairs of guests. A pair of seats counts once regardless of which name is written first.",
    "explanation": "For each index i, compare it with later indices j only. The exact count is n(n−1)/2. For n≥2 this is at least n²/4 and at most n²/2. Big O expresses an asymptotic upper bound, Ω a lower bound, and Θ both. The procedure is Θ(n²). To check an explicit operation budget, use the exact count. Wall-clock seconds also depend on environment and per-operation cost.",
    "invariant": "Each unordered pair of distinct indices corresponds to exactly one ordered pair with i<j. The total is half the n(n−1) ordered pairs.",
    "pseudocode": "pairs = n × (n−1) / 2\nif pairs ≤ budget: output FITS\notherwise: output EXCEEDS",
    "time": "O(1) fixed-width arithmetic for the budget checker. Pair enumeration takes Θ(n²) time",
    "space": "O(1) for the checker",
    "trace": [
      [
        "n=4, budget=5",
        "The distinct indices are 0, 1, 2 and 3."
      ],
      [
        "0 pairs with 1, 2, 3",
        "The first index accounts for three comparisons."
      ],
      [
        "1 adds 2 comparisons, 2 adds 1",
        "Every pair is now counted once, for a total of six."
      ],
      [
        "6 > 5",
        "The pair enumeration exceeds the explicit budget."
      ]
    ],
    "misconception": "An O(n²) bound alone does not establish a matching lower bound or an exact runtime.",
    "debug": "Use a budget exactly equal to the pair count. Equality fits.",
    "fill": "What expression counts all ordered pairs of distinct indices before dividing by two?",
    "edgeCases": [
      "Zero or one index gives zero comparisons.",
      "The budget includes its upper boundary.",
      "A large n requires a 64-bit multiplication in C and Java."
    ],
    "revision": "What pair of inequalities proves a Θ bound?",
    "further": "Find the maximum n that fits a budget by using binary search on n.",
    "quiz": {
      "question": "Which tight bound describes n(n−1)/2 comparisons?",
      "answers": [
        "Θ(n)",
        "Θ(n²)",
        "Θ(2ⁿ)"
      ],
      "correct": 1,
      "feedback": "For n≥2 the count lies between two positive constant multiples of n²."
    },
    "practice": {
      "title": "Check the comparison budget",
      "description": "Decide whether comparing each distinct unordered pair would fit a given operation budget.",
      "format": "Read n and budget. Print FITS if n(n−1)/2 is at most budget, otherwise EXCEEDS.",
      "constraints": "0 ≤ n ≤ 10⁹ and 0 ≤ budget ≤ 10¹⁸.",
      "input": "4 5\n",
      "output": "EXCEEDS\n",
      "hints": [
        "Count each pair only once.",
        "Use 64-bit arithmetic for the product in C and Java."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    long long n, budget;
    if (scanf("%lld%lld", &n, &budget) != 2) return 0;
    long long pairs = n * (n - 1) / 2;
    puts(pairs <= budget ? "FITS" : "EXCEEDS");
    return 0;
}`,
      python: `n, budget = map(int, input().split())
pairs = n * (n - 1) // 2
print("FITS" if pairs <= budget else "EXCEEDS")`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        long n = in.nextLong(), budget = in.nextLong();
        long pairs = n * (n - 1) / 2;
        System.out.println(pairs <= budget ? "FITS" : "EXCEEDS");
    }
}`,
    },
  }
]);
