import { defineTopics } from "./define.ts";

export const greedyChoices = defineTopics([
  {
    "id": "fractional-knapsack",
    "stage": 8,
    "title": "Fractional knapsack and exchange proofs",
    "objective": "Maximize value with divisible cargo by choosing the highest value density first.",
    "prerequisites": "Sorting, ratios and greedy exchange arguments.",
    "analogy": "Fill a limited tank with the richest fuel first, then add as much as needed from the next richest supply.",
    "explanation": "Sort items by value per unit weight and take as much as possible from each in that order. Compare ratios exactly with cross multiplication. The optimal real value is a sum of whole contributions and at most one fractional contribution. The exercise prints the floor of that value.",
    "invariant": "If a solution uses weight from a lower-density item while some higher-density weight remains, replacing an equal weight cannot lower value. Repeating the exchange yields the greedy order and proves optimality.",
    "pseudocode": "sort items by descending value/weight\nvalue = 0\nfor item:\n  used = min(remaining, weight)\n  value += used × item.value / item.weight\n  remaining -= used\nreturn floor(value)",
    "time": "O(n log n) for a comparison sort, followed by O(n) scanning. The C library chooses its own qsort implementation",
    "space": "O(n) for cargo records, plus sorting workspace",
    "trace": [
      [
        "Weights and values (4,8), (5,15) | capacity 7",
        "The item of weight five has density 3. The other has density 2."
      ],
      [
        "Take all (5,15)",
        "Add value 15 and leave two units of capacity."
      ],
      [
        "Take 2/4 of (4,8)",
        "The partial item contributes exactly 4 more value."
      ],
      [
        "Optimal value 19",
        "Any transfer from higher-density cargo to lower-density cargo cannot improve the result."
      ]
    ],
    "misconception": "Sorting by total value can fail. The relevant comparison is value per unit weight.",
    "debug": "Try capacity five and items (5,10) and (2,9). Taking the whole first item gives 10, while taking the dense item first gives 15.",
    "fill": "Compare a.value × b.weight with which other product?",
    "edgeCases": [
      "Capacity zero yields zero.",
      "Equal density items may be processed in either order.",
      "If all items fit, take them all.",
      "Only the last partially taken item needs division."
    ],
    "revision": "Why is an exchange allowed even when the two item weights differ?",
    "further": "Construct a counterexample where density order fails when items must be taken whole.",
    "quiz": {
      "question": "Which item should go first, weight 4 value 8 or weight 5 value 15?",
      "answers": [
        "Weight 4 value 8",
        "Weight 5 value 15",
        "Either item has the same density"
      ],
      "correct": 1,
      "feedback": "15/5 is 3 per unit, which exceeds 8/4 = 2 per unit."
    },
    "practice": {
      "title": "Load the salvage barge",
      "description": "Load divisible cargo to maximize value within the barge’s weight capacity. Print the integer floor of the best value.",
      "format": "Read n capacity, then n weight/value pairs. Items may be divided continuously.",
      "constraints": "0 ≤ n ≤ 250, 0 ≤ capacity ≤ 10⁶, 1 ≤ weight ≤ 10⁶ and 0 ≤ value ≤ 10⁶.",
      "input": "2 7\n4 8\n5 15\n",
      "output": "19\n",
      "hints": [
        "Order by ratios using cross multiplication.",
        "Apply integer division only to the one partial contribution."
      ]
    },
    code:{
      c: `#include <stdio.h>
#include <stdlib.h>
typedef struct { long long weight, value; } Item;
static int by_density(const void *first, const void *second) {
    const Item *a = first, *b = second;
    long long p = a->value * b->weight, q = b->value * a->weight;
    return (p < q) - (p > q);
}
int main(void) {
    int n;
    long long capacity, total = 0;
    Item items[250];
    if (scanf("%d%lld", &n, &capacity) != 2) return 0;
    for (int i = 0; i < n; i++) scanf("%lld%lld", &items[i].weight, &items[i].value);
    qsort(items, (size_t)n, sizeof(Item), by_density);
    for (int i = 0; i < n && capacity > 0; i++) {
        long long used = capacity < items[i].weight ? capacity : items[i].weight;
        total += used * items[i].value / items[i].weight;
        capacity -= used;
    }
    printf("%lld\\n", total);
    return 0;
}`,
      python: `from fractions import Fraction
n, capacity = map(int, input().split())
items = [tuple(map(int, input().split())) for _ in range(n)]
items.sort(key=lambda item: Fraction(item[1], item[0]), reverse=True)
total = 0
for weight, value in items:
    if capacity == 0:
        break
    used = min(capacity, weight)
    total += used * value // weight
    capacity -= used
print(total)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    record Item(long weight, long value) {}
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        long capacity = in.nextLong(), total = 0;
        Item[] items = new Item[n];
        for (int i = 0; i < n; i++) items[i] = new Item(in.nextLong(), in.nextLong());
        Arrays.sort(items, (a, b) -> Long.compare(b.value() * a.weight(), a.value() * b.weight()));
        for (Item item : items) {
            if (capacity == 0) break;
            long used = Math.min(capacity, item.weight());
            total += used * item.value() / item.weight();
            capacity -= used;
        }
        System.out.println(total);
    }
}`,
    },
  }
]);
