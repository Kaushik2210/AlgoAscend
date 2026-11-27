import { defineTopics } from "./define.ts";

export const corePatterns = defineTopics([
  {
    "id": "fixed-sliding-window",
    "stage": 4,
    "title": "Fixed-size sliding windows",
    "objective": "Reuse a running sum to find the best contiguous block of a fixed length.",
    "prerequisites": "Arrays, loops and running totals.",
    "analogy": "A moving frame covers k numbers. Moving it one position uncovers one number and covers one new number.",
    "explanation": "Sum the first k values. To advance the window one position, subtract the old first value and add the new last value. Compare these sums and record the maximum.",
    "invariant": "After processing right endpoint r ≥ k−1, the running total equals the sum of indices r−k+1 through r. The maximum observed through that step covers all valid windows ending at or before r.",
    "pseudocode": "sum = total of a[0:k]\nbest = sum\nfor r = k to n−1:\n  sum += a[r] − a[r−k]\n  best = max(best, sum)\nreturn best",
    "time": "O(n) time",
    "space": "O(n) for the stored array and O(1) extra space",
    "trace": [
      [
        "[2, −1, 4] | 0, 3",
        "The initial width-three window sums to 5."
      ],
      [
        "2 | [−1, 4, 0] | 3",
        "Subtract 2 and add 0. The current sum is 3 and the best is still 5."
      ],
      [
        "2, −1 | [4, 0, 3]",
        "Subtract −1 and add 3. The sum rises to 7, a new best."
      ]
    ],
    "misconception": "Starting the best sum at zero gives a wrong result when every window sum is negative.",
    "debug": "Use [−4, −1, −6] with k = 2 to test initialization.",
    "fill": "Complete the update: sum += a[r] − a[___].",
    "edgeCases": [
      "k = 1 reduces to finding the largest element.",
      "k = n yields exactly one window.",
      "All-negative inputs can have a negative answer."
    ],
    "revision": "Which two indices change when the right endpoint advances to r?",
    "further": "Return the earliest starting index when multiple windows tie.",
    "quiz": {
      "question": "If the right endpoint moves to index 5 and k = 3, which value leaves?",
      "answers": [
        "a[2]",
        "a[3]",
        "a[4]"
      ],
      "correct": 0,
      "feedback": "The previous window was [2, 4]. The new one is [3, 5], so index 2 leaves."
    },
    "practice": {
      "title": "Best booth run",
      "description": "A fair measures profit at consecutive booths. Find the maximum total for exactly k neighboring booths.",
      "format": "Read n and k followed by n signed integers. Print the maximum window sum.",
      "constraints": "1 ≤ k ≤ n ≤ 500. Each value is between −10⁶ and 10⁶.",
      "input": "5 3\n2 -1 4 0 3\n",
      "output": "7\n",
      "hints": [
        "Compute the first window before the loop.",
        "Advance with one addition and one subtraction."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, k, values[500];
    if (scanf("%d%d", &n, &k) != 2) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    int total = 0;
    for (int i = 0; i < k; i++) total += values[i];
    int best = total;
    for (int right = k; right < n; right++) {
        total += values[right] - values[right - k];
        if (total > best) best = total;
    }
    printf("%d\\n", best);
    return 0;
}`,
      python: `import sys
n, k, *values = map(int, sys.stdin.buffer.read().split())
total = sum(values[i] for i in range(k))
best = total
for right in range(k, n):
    total += values[right] - values[right - k]
    best = max(best, total)
print(best)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var input = new Scanner(System.in);
        int n = input.nextInt(), k = input.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = input.nextInt();
        int total = 0;
        for (int i = 0; i < k; i++) total += values[i];
        int best = total;
        for (int right = k; right < n; right++) {
            total += values[right] - values[right - k];
            best = Math.max(best, total);
        }
        System.out.println(best);
    }
}`,
    },
  },
  {
    "id": "difference-arrays",
    "stage": 4,
    "title": "Difference arrays",
    "objective": "Apply many inclusive range updates in constant time per update before reconstructing the final array.",
    "prerequisites": "Arrays and prefix sums.",
    "analogy": "A price surcharge starts at one shelf and expires just after another. Signs at the two boundaries describe every covered shelf.",
    "explanation": "For an inclusive update [left, right], record +delta at left and −delta just beyond right. Prefix-summing the difference array gives the combined effect at each index.",
    "invariant": "An update contributes delta to every prefix that includes its start marker but excludes its stop marker. Those prefixes correspond exactly to the updated indices.",
    "pseudocode": "diff = zeros(n + 1)\nfor left, right, delta in updates:\n  diff[left] += delta\n  diff[right + 1] -= delta\nrunning = 0\nfor i = 0 to n−1:\n  running += diff[i]\n  print running",
    "time": "O(n+q) time for q updates and n outputs",
    "space": "O(n) for the difference array. The Python program also buffers O(q) tokens",
    "trace": [
      [
        "[0, 0, 0, 0, 0]",
        "Four positions start at zero. The fifth entry is a sentinel."
      ],
      [
        "[3, 0, 0, −3, 0]",
        "Add 3 to indices 0 through 2 by writing two boundary events."
      ],
      [
        "[3, −2, 0, −3, 2]",
        "Add −2 to indices 1 through 3. Its stop event goes in the sentinel."
      ],
      [
        "[3, 1, 1, −2]",
        "A prefix sum recovers the first four actual positions."
      ]
    ],
    "misconception": "Subtracting at right ends the update one position too early.",
    "debug": "Use a single update [2, 2] and check that exactly one value changes.",
    "fill": "Where should the marker −delta go for a range ending at the last position?",
    "edgeCases": [
      "Allow zero updates.",
      "A range ending at n−1 writes its stop event at index n.",
      "Overlapping ranges combine by addition."
    ],
    "revision": "Explain why cancellation starts one slot after the right endpoint.",
    "further": "Add the recovered offsets to a nonzero initial array.",
    "quiz": {
      "question": "Which stop marker cancels adding 7 to indices 2 through 5?",
      "answers": [
        "−7 at index 5",
        "−7 at index 6",
        "+7 at index 6"
      ],
      "correct": 1,
      "feedback": "Index 5 is inside the range. Subtraction at index 6 ends the update."
    },
    "practice": {
      "title": "Trail maintenance",
      "description": "Each maintenance crew changes the elevation of an inclusive stretch of trail. Compute the final elevation offsets.",
      "format": "Read n and q, then q triples left right delta using zero-based positions. Print n offsets separated by spaces.",
      "constraints": "1 ≤ n ≤ 500, 0 ≤ q ≤ 400, 0 ≤ left ≤ right < n, and |delta| ≤ 10,000.",
      "input": "4 2\n0 2 3\n1 3 -2\n",
      "output": "3 1 1 -2\n",
      "hints": [
        "Store one extra difference slot.",
        "Output running totals, not the boundary events."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, q, diff[501] = {0};
    if (scanf("%d%d", &n, &q) != 2) return 0;
    for (int i = 0; i < q; i++) {
        int left, right, delta;
        scanf("%d%d%d", &left, &right, &delta);
        diff[left] += delta;
        diff[right + 1] -= delta;
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += diff[i];
        printf("%s%d", i ? " " : "", total);
    }
    puts("");
    return 0;
}`,
      python: `import sys
from itertools import accumulate
tokens = iter(map(int, sys.stdin.buffer.read().split()))
n, q = next(tokens), next(tokens)
diff = [0] * (n + 1)
for _ in range(q):
    left, right, delta = next(tokens), next(tokens), next(tokens)
    diff[left] += delta
    diff[right + 1] -= delta
print(*accumulate(diff[:n]))`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var input = new Scanner(System.in);
        int n = input.nextInt(), q = input.nextInt();
        int[] diff = new int[n + 1];
        for (int i = 0; i < q; i++) {
            int left = input.nextInt(), right = input.nextInt(), delta = input.nextInt();
            diff[left] += delta;
            diff[right + 1] -= delta;
        }
        int total = 0;
        var output = new StringBuilder();
        for (int i = 0; i < n; i++) {
            total += diff[i];
            if (i > 0) output.append(' ');
            output.append(total);
        }
        System.out.println(output);
    }
}`,
    },
  }
]);
