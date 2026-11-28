import { defineTopics } from "./define.ts";

export const coordinateCompression = defineTopics([
  {
    "id": "coordinate-compression",
    "stage": 4,
    "title": "Coordinate compression",
    "objective": "Replace sparse numeric coordinates with dense ranks while preserving comparisons.",
    "prerequisites": "Sorting, sets and binary search.",
    "analogy": "Relabel reserved shelves by their order. The new labels are consecutive even if the original shelf numbers were far apart.",
    "explanation": "Sort the distinct values and assign each its zero-based position. Replace each original value by the rank of its matching sorted entry. Equal values share a rank, and smaller values have smaller ranks. Original distances do not survive this mapping.",
    "invariant": "For any original values x and y, x<y exactly when rank(x)<rank(y). Each distinct value occupies one sorted position, so equal inputs map to equal ranks.",
    "pseudocode": "ordered = sorted distinct(values)\nfor value in original order:\n  print lower_bound(ordered,value)",
    "time": "O(n log(n+1)) for comparison sorting and rank lookup. Hash-map lookup can reduce the per-value lookup cost",
    "space": "O(n) for input and sorted coordinates",
    "trace": [
      [
        "Input [40,−5,40,12]",
        "Keep the input order to restore output positions after ranking."
      ],
      [
        "Sort and deduplicate → [−5,12,40]",
        "Each distinct coordinate now has one slot."
      ],
      [
        "Ranks −5→0, 12→1, 40→2",
        "The numeric order survives even though differences have changed."
      ],
      [
        "Output [2,0,2,1]",
        "Both occurrences of 40 share rank 2."
      ]
    ],
    "misconception": "Compression preserves order and equality, but a rank difference is not the original coordinate distance.",
    "debug": "Use repeated values, negative values and a large gap between two neighbors.",
    "fill": "Which operation makes equal original coordinates share one rank?",
    "edgeCases": [
      "No values produce an empty line.",
      "All equal values receive rank zero.",
      "Negative or large values are handled by normal sorting."
    ],
    "revision": "Which operations remain valid when coordinates are replaced by ranks?",
    "further": "Combine compression with a Fenwick tree to count inversions.",
    "quiz": {
      "question": "How do [100, −10, 100, 7] compress?",
      "answers": [
        "[2,0,2,1]",
        "[3,0,3,1]",
        "[0,1,0,2]"
      ],
      "correct": 0,
      "feedback": "The distinct sorted values are −10, 7 and 100, with ranks 0, 1 and 2."
    },
    "practice": {
      "title": "Rank the sensor coordinates",
      "description": "Convert sparse coordinates to zero-based ranks in the sorted distinct coordinates.",
      "format": "Read n and n integer coordinates. Print their ranks in original order, using spaces.",
      "constraints": "0 ≤ n ≤ 400. Coordinates are between −10⁹ and 10⁹.",
      "input": "4\n40 -5 40 12\n",
      "output": "2 0 2 1\n",
      "hints": [
        "Sort a copy and deduplicate the sorted copy.",
        "Search the sorted distinct list to restore each original position’s rank."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>
static int compare(const void *first, const void *second) {
    int a = *(const int *)first, b = *(const int *)second;
    return (a > b) - (a < b);
}
static int rank_of(const int *ordered, int count, int target) {
    int low = 0, high = count;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (ordered[mid] < target) low = mid + 1;
        else high = mid;
    }
    return low;
}
int main(void) {
    int n, values[400], ordered[400], unique = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) { scanf("%d", &values[i]); ordered[i] = values[i]; }
    qsort(ordered, (size_t)n, sizeof(int), compare);
    for (int i = 0; i < n; i++) {
        if (unique == 0 || ordered[i] != ordered[unique - 1]) ordered[unique++] = ordered[i];
    }
    for (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", rank_of(ordered, unique, values[i]));
    puts("");
    return 0;
}`,
      python: `from bisect import bisect_left
import sys
n, *values = map(int, sys.stdin.buffer.read().split())
ordered = sorted(set(values))
print(*(bisect_left(ordered, value) for value in values))`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), unique = 0;
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = in.nextInt();
        int[] ordered = values.clone();
        Arrays.sort(ordered);
        for (int i = 0; i < n; i++) {
            if (unique == 0 || ordered[i] != ordered[unique - 1]) ordered[unique++] = ordered[i];
        }
        var out = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) out.append(' ');
            out.append(Arrays.binarySearch(ordered, 0, unique, values[i]));
        }
        System.out.println(out);
    }
}`,
    },
  }
]);
