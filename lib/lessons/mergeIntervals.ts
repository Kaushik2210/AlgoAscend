import { defineTopics } from "./define.ts";

export const mergeIntervals = defineTopics([
  {
    "id": "merge-intervals",
    "stage": 4,
    "title": "Merging overlapping intervals",
    "objective": "Compute the union of inclusive intervals and preserve gaps between them.",
    "prerequisites": "Sorting, arrays and inclusive endpoints.",
    "analogy": "Lay reservation strips along a timeline. Overlapping strips form one continuous covered stretch.",
    "explanation": "Sort intervals by start. Keep a current merged interval. If the next start is at most the current end, extend the end to the greater of the two ends. Otherwise emit the current interval and start a new one. This rule joins intervals that meet at the same endpoint.",
    "invariant": "Emitted intervals are disjoint, appear in order, and cover the completed portions of the input union. The current interval covers the final open portion. When a gap appears, all future starts are at least as large as the next start, so the emitted interval can never grow.",
    "pseudocode": "sort by start\nfor each interval:\n  if no active interval: make it active\n  else if next.start ≤ active.end: active.end = max(active.end,next.end)\n  else: emit active and replace it with next\nemit any remaining active interval",
    "time": "O(n log n) for comparison sorting and O(n) for the scan",
    "space": "O(n) for the stored intervals, plus any sorting workspace",
    "trace": [
      [
        "Input [5,8], [1,3], [2,6], [10,11]",
        "Sort by start to get [1,3], [2,6], [5,8], [10,11]."
      ],
      [
        "Merge [1,3] with [2,6] → [1,6]",
        "The second interval starts before the current end."
      ],
      [
        "Merge [1,6] with [5,8] → [1,8]",
        "A chain of overlaps forms one interval."
      ],
      [
        "[10,11] opens after a gap",
        "Emit [1,8] and then [10,11]."
      ]
    ],
    "misconception": "Replacing the active end with the next end can shrink coverage when the next interval is contained inside the active one.",
    "debug": "Try [0,10] followed by [2,3]. The merged end must remain 10.",
    "fill": "Which function combines the active end and the next end after an overlap?",
    "edgeCases": [
      "Zero intervals produce no output.",
      "Point intervals with equal endpoints are valid.",
      "Intervals sharing an endpoint merge.",
      "A contained interval adds nothing to the union."
    ],
    "revision": "Why does sorting by start allow a gap to finalize the active interval?",
    "further": "Change the rule for half-open intervals and check meeting endpoints.",
    "quiz": {
      "question": "How do [1,10] and [3,5] merge?",
      "answers": [
        "[1,5]",
        "[1,10]",
        "[3,10]"
      ],
      "correct": 1,
      "feedback": "The second interval contributes no new points. The active interval keeps end 10."
    },
    "practice": {
      "title": "Combine overlapping reservations",
      "description": "Merge all overlapping inclusive reservations and print the merged ranges in increasing order.",
      "format": "Read n, then n pairs start end. Print one merged interval per line, or no lines if n=0.",
      "constraints": "0 ≤ n ≤ 400. Each endpoint is between −10⁶ and 10⁶. Start does not exceed end.",
      "input": "4\n5 8\n1 3\n2 6\n10 11\n",
      "output": "1 8\n10 11\n",
      "hints": [
        "Sort by start before the scan.",
        "Use the greater of the two end values when merging."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>
typedef struct { int start, end; } Interval;
static int by_start(const void *first, const void *second) {
    const Interval *a = first, *b = second;
    return (a->start > b->start) - (a->start < b->start);
}
int main(void) {
    int n;
    Interval intervals[400];
    if (scanf("%d", &n) != 1 || n == 0) return 0;
    for (int i = 0; i < n; i++) scanf("%d%d", &intervals[i].start, &intervals[i].end);
    qsort(intervals, (size_t)n, sizeof(Interval), by_start);
    Interval active = intervals[0];
    for (int i = 1; i < n; i++) {
        if (intervals[i].start > active.end) {
            printf("%d %d\\n", active.start, active.end);
            active = intervals[i];
        } else if (intervals[i].end > active.end) active.end = intervals[i].end;
    }
    printf("%d %d\\n", active.start, active.end);
    return 0;
}`,
      python: `n = int(input())
intervals = sorted(tuple(map(int, input().split())) for _ in range(n))
if intervals:
    start, end = intervals[0]
    for next_start, next_end in intervals[1:]:
        if next_start > end:
            print(start, end)
            start, end = next_start, next_end
        else:
            end = max(end, next_end)
    print(start, end)`,
      java: `import java.util.Arrays;
import java.util.Comparator;
import java.util.Scanner;
class Main {
    record Interval(int start, int end) {}
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        if (n == 0) return;
        Interval[] intervals = new Interval[n];
        for (int i = 0; i < n; i++) intervals[i] = new Interval(in.nextInt(), in.nextInt());
        Arrays.sort(intervals, Comparator.comparingInt(Interval::start));
        int start = intervals[0].start(), end = intervals[0].end();
        for (int i = 1; i < n; i++) {
            Interval next = intervals[i];
            if (next.start() > end) {
                System.out.println(start + " " + end);
                start = next.start();
                end = next.end();
            } else end = Math.max(end, next.end());
        }
        System.out.println(start + " " + end);
    }
}`,
    },
  }
]);
