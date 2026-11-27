import { defineTopics } from "./define.ts";

export const languageRecords = defineTopics([
  {
    "id": "records-and-objects",
    "stage": 1,
    "title": "Records, constructors, and encapsulation",
    "objective": "Group related fields and enforce a stock invariant when applying changes.",
    "prerequisites": "Functions, variables and conditionals.",
    "analogy": "An inventory card keeps a shelf capacity and count together. Its adjustment rule decides when the count can change.",
    "explanation": "A record groups related values. A C struct groups capacity and units and a helper updates both through a pointer to the struct. A Python class creates attributes in __init__ and uses an underscore name by convention for internal state. A Java constructor initializes a class with private fields, which Java controls through access modifiers. Put validation at the update boundary and reject any change that exceeds the allowed range.",
    "invariant": "The stored count always lies between zero and capacity. A successful update writes its validated candidate count. A rejected update preserves the previous count.",
    "pseudocode": "construct a record with capacity and initial count\nfor each signed change:\n  candidate = count + change\n  if 0 ≤ candidate ≤ capacity: count = candidate\n  print count",
    "time": "O(q) time for q operations",
    "space": "O(1) for the stored record. The Python program buffers O(q) tokens",
    "trace": [
      [
        "capacity=10, units=4",
        "The constructor or initializer establishes the range invariant."
      ],
      [
        "change +5 → units=9",
        "The candidate lies within the allowed bounds."
      ],
      [
        "change +4 → units=9",
        "The candidate exceeds capacity. Leave the stored count unchanged."
      ],
      [
        "change −9 → units=0",
        "Zero is an allowed boundary value."
      ]
    ],
    "misconception": "Grouping fields alone does not enforce validation. Every path that changes the count must preserve the range.",
    "debug": "Try a change that lands exactly on capacity before trying one that exceeds it.",
    "fill": "What property must the constructor establish before the first adjustment?",
    "edgeCases": [
      "Zero capacity allows only a zero total.",
      "Changes reaching exactly zero or capacity succeed.",
      "A rejected change leaves the previous value available for later operations."
    ],
    "revision": "Which parts of the record need to be exposed to callers?",
    "further": "Add a transfer operation between two records and validate both new counts before writing either.",
    "quiz": {
      "question": "A record has capacity 10 and 9 units. What happens after change +4?",
      "answers": [
        "Store 13",
        "Clamp the count to 10",
        "Keep 9"
      ],
      "correct": 2,
      "feedback": "The rule rejects an out-of-range candidate and keeps the previous count."
    },
    "practice": {
      "title": "Keep the stock card consistent",
      "description": "Apply stock adjustments when the resulting inventory remains within shelf capacity.",
      "format": "Read capacity, starting count and q. Then read q signed adjustments. After each adjustment, print the current count. Reject adjustments outside the allowed range.",
      "constraints": "0 ≤ starting count ≤ capacity ≤ 10⁶, 0 ≤ q ≤ 400, and each adjustment is between −10⁶ and 10⁶.",
      "input": "10 4 3\n5 4 -9\n",
      "output": "9\n9\n0\n",
      "hints": [
        "Compute the proposed count before changing the record.",
        "Check both bounds, including equality."
      ]
    },
    code:{
      c: `#include <stdio.h>
typedef struct { int capacity, units; } Stock;
static void adjust(Stock *stock, int change) {
    int candidate = stock->units + change;
    if (candidate >= 0 && candidate <= stock->capacity) stock->units = candidate;
}
int main(void) {
    Stock stock;
    int q;
    if (scanf("%d%d%d", &stock.capacity, &stock.units, &q) != 3) return 0;
    for (int i = 0; i < q; i++) {
        int change;
        scanf("%d", &change);
        adjust(&stock, change);
        printf("%d\\n", stock.units);
    }
    return 0;
}`,
      python: `import sys

class Stock:
    def __init__(self, capacity, units):
        self._capacity = capacity
        self._units = units

    def adjust(self, change):
        candidate = self._units + change
        if 0 <= candidate <= self._capacity:
            self._units = candidate
        return self._units

tokens = iter(map(int, sys.stdin.buffer.read().split()))
stock = Stock(next(tokens), next(tokens))
q = next(tokens)
for _ in range(q):
    print(stock.adjust(next(tokens)))`,
      java: `import java.util.Scanner;
class Main {
    static class Stock {
        private final int capacity;
        private int units;
        Stock(int capacity, int units) {
            this.capacity = capacity;
            this.units = units;
        }
        int adjust(int change) {
            int candidate = units + change;
            if (candidate >= 0 && candidate <= capacity) units = candidate;
            return units;
        }
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        Stock stock = new Stock(in.nextInt(), in.nextInt());
        int q = in.nextInt();
        for (int i = 0; i < q; i++) System.out.println(stock.adjust(in.nextInt()));
    }
}`,
    },
  }
]);
