import { defineTopics } from "./define.ts";

export const monotonicDeque = defineTopics([
  {
    "id": "monotonic-deques",
    "stage": 4,
    "title": "Deques and sliding-window maxima",
    "objective": "Use both ends of a deque to report the maximum in each fixed-size window.",
    "prerequisites": "Circular queues, fixed-size sliding windows and array indices.",
    "analogy": "Keep a shortlist of contenders. Remove outdated entries at the front, and remove weaker contenders at the back when a stronger one arrives.",
    "explanation": "A deque supports insertion and removal at both ends. Store candidate indices in increasing index order and decreasing value order. Remove expired indices from the front. Before adding a new index, remove trailing candidates whose values are at most the new value. The new index is at least as good and lasts longer. The front is the window maximum.",
    "invariant": "Every eligible index is either in the deque or dominated by a later eligible index with an equal or larger value. The deque front holds its largest value and therefore a maximum of the whole window.",
    "pseudocode": "for each index i:\n  remove front while it is outside the window\n  remove back while its value is ≤ a[i]\n  insert i at the back\n  if the window has k items: emit the front value",
    "time": "O(n) time because every index enters once and leaves at most once",
    "space": "O(n) for the input. The deque holds at most O(k) live indices for window size k",
    "trace": [
      [
        "Input [1,3,2,5], k=2",
        "Insert index 0 with value 1."
      ],
      [
        "i=1, value 3 → deque [1]",
        "Discard the weaker value 1. The first window maximum is 3."
      ],
      [
        "i=2, value 2 → deque [1,2]",
        "Keep both candidates. The window maximum is still 3."
      ],
      [
        "i=3, value 5 → deque [3]",
        "Index 1 expires and 5 dominates index 2. The final maximum is 5."
      ]
    ],
    "misconception": "Values alone do not tell you which entry has expired when equal values repeat. Store indices.",
    "debug": "Try an increasing run and a decreasing run. Both expiry and domination need to work.",
    "fill": "Which deque end loses indices that fell out of the window?",
    "edgeCases": [
      "For k=1 every number is output unchanged.",
      "Equal values can keep the newest index.",
      "For k=n output a single maximum."
    ],
    "revision": "Why can a later equal value replace an earlier equal value?",
    "further": "Maintain a second deque for minima and report the difference between maximum and minimum.",
    "quiz": {
      "question": "Which deque end gives the maximum after inserting each new index?",
      "answers": [
        "Front",
        "Back",
        "Whichever end is newer"
      ],
      "correct": 0,
      "feedback": "Values decrease from front to back. Expired front indices are removed before reporting."
    },
    "practice": {
      "title": "Track peak power by window",
      "description": "Print the maximum reading in each consecutive window of the requested width.",
      "format": "Read n and k followed by n signed readings. Print n−k+1 maxima separated by spaces.",
      "constraints": "1 ≤ k ≤ n ≤ 500. Readings are between −10⁶ and 10⁶.",
      "input": "4 2\n1 3 2 5\n",
      "output": "3 3 5\n",
      "hints": [
        "Keep candidate indices in chronological order.",
        "Drop any older trailing candidate of equal or smaller value."
      ]
    },
    code: {
      c: `#include <stdio.h>
int main(void) {
    int n, k, values[500], deque[500], head = 0, tail = 0;
    if (scanf("%d%d", &n, &k) != 2) return 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &values[i]);
        while (head < tail && deque[head] <= i - k) head++;
        while (head < tail && values[deque[tail - 1]] <= values[i]) tail--;
        deque[tail++] = i;
        if (i >= k - 1) printf("%s%d", i == k - 1 ? "" : " ", values[deque[head]]);
    }
    puts("");
    return 0;
}`,
      python: `from collections import deque
import sys

n, k, *values = map(int, sys.stdin.buffer.read().split())
indices = deque()
answer = []
for i, value in enumerate(values):
    while indices and indices[0] <= i - k:
        indices.popleft()
    while indices and values[indices[-1]] <= value:
        indices.pop()
    indices.append(i)
    if i >= k - 1:
        answer.append(values[indices[0]])
print(*answer)`,
      java: `import java.util.ArrayDeque;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), k = in.nextInt();
        int[] values = new int[n];
        var indices = new ArrayDeque<Integer>();
        var out = new StringBuilder();
        for (int i = 0; i < n; i++) {
            values[i] = in.nextInt();
            while (!indices.isEmpty() && indices.peekFirst() <= i - k) indices.removeFirst();
            while (!indices.isEmpty() && values[indices.peekLast()] <= values[i]) indices.removeLast();
            indices.addLast(i);
            if (i >= k - 1) {
                if (i != k - 1) out.append(' ');
                out.append(values[indices.peekFirst()]);
            }
        }
        System.out.println(out);
    }
}`,
    },
  }
]);
