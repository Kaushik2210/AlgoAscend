import { defineTopics } from "./define.ts";

export const earlyPractice = defineTopics([
  {
    "id": "nested-loops",
    "stage": 1,
    "title": "Nested loops and grid coordinates",
    "objective": "Visit each cell in row-major order and predict how many times the inner loop runs.",
    "prerequisites": "Loops, comparisons and running totals.",
    "analogy": "Scan a seating chart one row at a time, restarting at the first seat for every new row.",
    "explanation": "The outer loop chooses a row. For each row, start the column loop at zero and advance it through that row. A single running counter can combine information from all rows without storing the whole grid.",
    "invariant": "Before processing a cell, the counter contains exactly the qualifying cells in all earlier rows and earlier columns of the current row.",
    "pseudocode": "count = 0\nfor row = 0 to rows−1:\n  for column = 0 to cols−1:\n    if value at (row, column) is positive:\n      count += 1\nreturn count",
    "time": "O(rows × columns) time for a rectangular grid",
    "space": "O(1) beyond the current row in C and Java, and O(columns) for the current line in Python",
    "trace": [
      [
        "count = 0",
        "The two rows contain [1, −2, 0] and [4, 3, −1]."
      ],
      [
        "row 0 → count = 1",
        "Only the first value in the first row is positive."
      ],
      [
        "row 1, column 0 → count = 2",
        "The inner loop restarts at column 0 and counts 4."
      ],
      [
        "row 1 complete → count = 3",
        "Count 3 and skip −1. Six cells were visited."
      ]
    ],
    "misconception": "A column counter initialized outside the row loop may never restart after the first row.",
    "debug": "Use a grid with a positive value only in its last row and first column.",
    "fill": "What column should the inner loop start at when the outer loop enters a new row?",
    "edgeCases": [
      "A single column still needs one visit per row.",
      "Zero is outside the positive category.",
      "An all-negative grid has count zero."
    ],
    "revision": "How many times does the body run for a grid of 3 rows and 5 columns?",
    "further": "Print one count per row, then compare where you initialize the counter.",
    "quiz": {
      "question": "How many cells does a 2-by-3 grid require the loop to visit?",
      "answers": [
        "2",
        "3",
        "6"
      ],
      "correct": 2,
      "feedback": "Each of the two outer iterations performs three inner iterations."
    },
    "practice": {
      "title": "Count illuminated seats",
      "description": "Count how many seats report a strictly positive light reading.",
      "format": "Read the number of rows and columns. Read one line of column readings per row. Print the total count of strictly positive readings.",
      "constraints": "1 ≤ rows, columns ≤ 25. Readings are integers from −999 through 999.",
      "input": "2 3\n1 -2 0\n4 3 -1\n",
      "output": "3\n",
      "hints": [
        "Restart the column loop for each row.",
        "Keep the total outside both loops."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int rows, columns, count = 0;
    if (scanf("%d%d", &rows, &columns) != 2) return 0;
    for (int row = 0; row < rows; row++) {
        for (int column = 0; column < columns; column++) {
            int value;
            scanf("%d", &value);
            if (value > 0) count++;
        }
    }
    printf("%d\\n", count);
    return 0;
}`,
      python: `rows, columns = map(int, input().split())
count = 0
for row in range(rows):
    readings = list(map(int, input().split()))
    for column in range(columns):
        if readings[column] > 0:
            count += 1
print(count)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int rows = in.nextInt(), columns = in.nextInt(), count = 0;
        for (int row = 0; row < rows; row++) {
            for (int column = 0; column < columns; column++) {
                if (in.nextInt() > 0) count++;
            }
        }
        System.out.println(count);
    }
}`,
    },
  },
  {
    "id": "integer-types-and-division",
    "stage": 1,
    "title": "Integer types and division",
    "objective": "Split a nonnegative quantity into whole groups and a remainder using suitable integer types.",
    "prerequisites": "Variables and multiplication.",
    "analogy": "Pack equal-sized cartons. The quotient counts full cartons and the remainder counts loose items.",
    "explanation": "For nonnegative items n and group size k > 0, integer division gives the quotient and modulo gives the remainder. Use a wide integer type in C and Java for inputs above the 32-bit range. Python integers grow to represent the value exactly.",
    "invariant": "n equals quotient times k plus remainder, with 0 ≤ remainder < k. These conditions uniquely determine the quotient and remainder.",
    "pseudocode": "whole = floor(n / k) using integer arithmetic\nleft = n mod k\nprint whole and left",
    "time": "O(1) arithmetic operations for the stated integer bounds",
    "space": "O(1) for the stated bounds",
    "trace": [
      [
        "n = 23, k = 5",
        "The task asks how many full groups of five fit."
      ],
      [
        "quotient = 4",
        "Four groups use 20 items. Five would require 25."
      ],
      [
        "remainder = 3",
        "The identity is 23 = 4 × 5 + 3."
      ]
    ],
    "misconception": "Python’s / produces a floating-point result. Use // for this nonnegative integer quotient, especially when values are large.",
    "debug": "Try n = 9007199254740993 and k = 2 to catch rounding through a floating-point intermediate.",
    "fill": "Given quotient q, complete the remainder identity: r = n − ___.",
    "edgeCases": [
      "When n < k, the quotient is zero and the remainder is n.",
      "Exact multiples have a zero remainder.",
      "The group size must be positive."
    ],
    "revision": "Which relation lets you check that a quotient and remainder agree?",
    "further": "Compare how C, Python and Java define quotient and remainder for negative operands.",
    "quiz": {
      "question": "What are the quotient and remainder when 17 items are grouped in fives?",
      "answers": [
        "4 and 2",
        "3 and 2",
        "3 and 5"
      ],
      "correct": 1,
      "feedback": "Three groups use 15 items and leave two."
    },
    "practice": {
      "title": "Pack the shipments",
      "description": "Given a shipment count and the size of each carton, print the number of full cartons and remaining shipments.",
      "format": "Read n k. Print the integer quotient and remainder separated by one space.",
      "constraints": "0 ≤ n ≤ 10¹⁸ and 1 ≤ k ≤ 10¹⁸.",
      "input": "23 5\n",
      "output": "4 3\n",
      "hints": [
        "Use integer division for the number of full cartons.",
        "Use 64-bit integers in C and Java."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    long long shipments, capacity;
    if (scanf("%lld%lld", &shipments, &capacity) != 2) return 0;
    printf("%lld %lld\\n", shipments / capacity, shipments % capacity);
    return 0;
}`,
      python: `shipments, capacity = map(int, input().split())
print(shipments // capacity, shipments % capacity)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        long shipments = in.nextLong(), capacity = in.nextLong();
        System.out.println((shipments / capacity) + " " + (shipments % capacity));
    }
}`,
    },
  }
]);
