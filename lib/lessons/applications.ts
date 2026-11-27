import { defineTopics } from "./define.ts";

export const applications = defineTopics([
  {
    "id": "kmp-string-matching",
    "stage": 12,
    "title": "KMP and reusable prefix matches",
    "objective": "Count overlapping occurrences without restarting the text scan on a mismatch.",
    "prerequisites": "Strings, indexes, and linear-time reasoning.",
    "analogy": "When part of a word is already correct, keep the ending that can begin the next attempt.",
    "explanation": "For each pattern prefix, record its longest proper prefix that is also a suffix. On a mismatch, use the table to try shorter candidates. After a complete match, fall back again to allow overlap.",
    "invariant": "After recording any full match, j is the longest proper pattern prefix matching a suffix of processed text. Failure links list shorter usable candidates in decreasing length.",
    "pseudocode": "build pi for the pattern\nfor each text character:\n    on mismatch, repeatedly set j ← pi[j−1]\n    on a match, increment j\n    when j reaches the pattern length, count it and follow one failure link",
    "time": "O(n+m) time for text and pattern lengths",
    "space": "O(m) table space beyond input",
    "trace": [
      [
        "pattern = aba | pi = [0,0,1]",
        "The complete pattern has the proper border a."
      ],
      [
        "text starts aba | count = 1 | j ← 1",
        "Keep the final a as a candidate start."
      ],
      [
        "text ababa | count = 2",
        "The last two letters complete the overlapping match."
      ]
    ],
    "misconception": "Resetting j to zero after success can lose overlaps.",
    "debug": "Why does advancing two positions after matching aa in aaaa miss a match?",
    "fill": "After recording a match, reset j to pi[__].",
    "edgeCases": [
      "A pattern longer than the text cannot occur.",
      "A one-letter pattern can match repeatedly.",
      "Test repeated-letter overlap."
    ],
    "revision": "Keep a valid prefix rather than rescanning the text.",
    "further": "Compare deterministic KMP with rolling hashes and their collision handling.",
    "quiz": {
      "question": "How often does aba occur in ababa when overlaps count?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 1,
      "feedback": "It starts at indexes 0 and 2. The middle a belongs to both matches."
    },
    "practice": {
      "title": "Find overlapping signatures",
      "description": "Count all occurrences of a pattern, including overlaps.",
      "format": "Read the text token, then the pattern token. Print the number of occurrences.",
      "constraints": "Lowercase ASCII letters. Text length 1–7,000 and pattern length 1–1,000.",
      "input": "ababa\naba\n",
      "output": "2\n",
      "hints": [
        "Build the prefix function.",
        "On a mismatch preserve a valid border.",
        "A match ending can also begin another match."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    char text[10001], pattern[1001];
    int pi[1000] = {0};
    if (scanf("%10000s%1000s", text, pattern) != 2) return 1;
    for (int i = 1, j = 0; pattern[i]; ++i) {
        while (j > 0 && pattern[i] != pattern[j]) j = pi[j-1];
        if (pattern[i] == pattern[j]) ++j;
        pi[i] = j;
    }
    int count = 0;
    for (int i = 0, j = 0; text[i]; ++i) {
        while (j > 0 && text[i] != pattern[j]) j = pi[j-1];
        if (text[i] == pattern[j]) ++j;
        if (!pattern[j]) {
            ++count;
            j = pi[j-1];
        }
    }
    printf("%d\\n", count);
    return 0;
}`,
      python: `import sys

text, pattern = sys.stdin.read().split()
pi = [0] * len(pattern)
j = 0
for i in range(1, len(pattern)):
    while j and pattern[i] != pattern[j]:
        j = pi[j-1]
    if pattern[i] == pattern[j]:
        j += 1
    pi[i] = j

count, j = 0, 0
for ch in text:
    while j and ch != pattern[j]:
        j = pi[j-1]
    if ch == pattern[j]:
        j += 1
    if j == len(pattern):
        count += 1
        j = pi[j-1]
print(count)`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String text = in.next(), pattern = in.next();
        int[] pi = new int[pattern.length()];
        for (int i = 1, j = 0; i < pattern.length(); i++) {
            while (j > 0 && pattern.charAt(i) != pattern.charAt(j)) j = pi[j-1];
            if (pattern.charAt(i) == pattern.charAt(j)) j++;
            pi[i] = j;
        }
        int count = 0, j = 0;
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            while (j > 0 && ch != pattern.charAt(j)) j = pi[j-1];
            if (ch == pattern.charAt(j)) j++;
            if (j == pattern.length()) {
                count++;
                j = pi[j-1];
            }
        }
        System.out.println(count);
    }
}`,
    },
  },
  {
    "id": "xor-bitmasks",
    "stage": 13,
    "title": "Bitmasks and XOR toggles",
    "objective": "Pack independent boolean states into a word and flip a chosen bit.",
    "prerequisites": "Binary representation and bitwise operators.",
    "analogy": "Store a row of switches in one integer, with one position for each switch.",
    "explanation": "The mask 1 shifted left by i selects position i. XOR with it flips the selected bit and leaves the rest alone. Two toggles of the same switch cancel.",
    "invariant": "After any prefix of operations, bit i is set exactly when that position has been toggled an odd number of times.",
    "pseudocode": "mask ← 0\nfor each index i: mask ← mask XOR (1 shifted left by i)\nprint mask",
    "time": "O(q) time for q toggles",
    "space": "O(1) auxiliary space with streamed input",
    "trace": [
      [
        "mask = 0000",
        "All switches are initially off."
      ],
      [
        "0 → 0001; 2 → 0101",
        "Each shift selects just one position."
      ],
      [
        "0 → 0100; 1 → 0110",
        "The second toggle of 0 clears it. The final decimal value is 6."
      ]
    ],
    "misconception": "OR can set a bit but will never clear it on a second operation.",
    "debug": "A switch remains on after two toggles. Which operator should replace OR?",
    "fill": "Complete mask = mask __ (1 << i).",
    "edgeCases": [
      "Zero operations leaves zero.",
      "Twice at the same position cancels.",
      "Index 29 stays inside the signed positive range."
    ],
    "revision": "XOR with zero preserves. XOR with one flips.",
    "further": "Try enumerating submasks of a fixed mask.",
    "quiz": {
      "question": "What happens to 0101 when bit 2 is toggled?",
      "answers": [
        "0001",
        "0101",
        "1101"
      ],
      "correct": 0,
      "feedback": "Bit 2 corresponds to 0100, so XOR clears it and preserves bit zero."
    },
    "practice": {
      "title": "Toggle the switchboard",
      "description": "Apply toggles to a 30-switch board and print the final decimal bitmask.",
      "format": "Read q followed by q zero-based switch indexes.",
      "constraints": "0 ≤ q ≤ 1000. Indexes are 0 through 29.",
      "input": "4\n0 2 0 1\n",
      "output": "6\n",
      "hints": [
        "Start with all bits cleared.",
        "Shift 1 to the desired position.",
        "Use XOR for each toggle."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    int q;
    unsigned mask = 0;
    if (scanf("%d", &q) != 1) return 1;
    while (q--) {
        int i;
        if (scanf("%d", &i) != 1) return 1;
        mask ^= 1u << i;
    }
    printf("%u\\n", mask);
    return 0;
}`,
      python: `import sys

q, *indexes = map(int, sys.stdin.buffer.read().split())
mask = 0
for i in indexes:
    mask ^= 1 << i
print(mask)`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int q = in.nextInt(), mask = 0;
        while (q-- > 0) mask ^= 1 << in.nextInt();
        System.out.println(mask);
    }
}`,
    },
  },
  {
    "id": "interview-two-pointers",
    "stage": 14,
    "title": "Explain a sorted two-sum solution",
    "objective": "State a brute-force baseline, eliminate an endpoint safely, and test a solution aloud.",
    "prerequisites": "Sorted arrays, comparisons, and loop invariants.",
    "analogy": "If even the heaviest partner is too light, the lightest package cannot be in any successful pair.",
    "explanation": "Start with the first and last positions of the sorted array. When their sum is below the target, increment left. When it is above, decrement right. Stop when the positions meet or the target is found.",
    "invariant": "Every remaining candidate pair lies inside the current interval. For a low sum, the left value cannot reach target with any remaining partner. The symmetric argument excludes the right value for a high sum.",
    "pseudocode": "left ← 0; right ← n−1\nwhile left < right:\n    compare their sum to target\n    if equal: return YES\n    if too small: left++\n    otherwise: right--\nreturn NO",
    "time": "O(n) time including input",
    "space": "O(1) auxiliary space beyond the input array",
    "trace": [
      [
        "[1,4,5,8,11] | target = 13 | sum = 12",
        "Even the largest partner is too small to pair with 1."
      ],
      [
        "left = 4, right = 11 | sum = 15",
        "Even the smallest remaining partner is too large for 11."
      ],
      [
        "4 + 8 = 12 → 5 + 8 = 13",
        "Discard 4, then report the match."
      ]
    ],
    "misconception": "Using left ≤ right can reuse a single position.",
    "debug": "Why should [5] be rejected for target 10?",
    "fill": "Continue only while left __ right.",
    "edgeCases": [
      "Zero or one item can never form a pair.",
      "Equal values at distinct indexes are valid.",
      "Negative values still follow sorted order."
    ],
    "revision": "Explain why the discarded endpoint cannot appear in any valid pair.",
    "further": "Compare the hash-set approach for an unsorted input.",
    "quiz": {
      "question": "When the sum is below the target, which value is safe to discard?",
      "answers": [
        "The left value",
        "The right value",
        "Both values"
      ],
      "correct": 0,
      "feedback": "The right value is already the largest partner available to the left value."
    },
    "practice": {
      "title": "Pair two distinct readings",
      "description": "Decide whether two distinct positions hold values summing to a target.",
      "format": "Read n target and n nondecreasing integers. Print YES or NO.",
      "constraints": "0 ≤ n ≤ 600. Readings and target are between −10⁹ and 10⁹.",
      "input": "5 13\n1 4 5 8 11\n",
      "output": "YES\n",
      "hints": [
        "Start from the all-pairs baseline.",
        "Compare the extremes still in play.",
        "Keep the indexes distinct."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    int n, target, values[1000];
    if (scanf("%d%d", &n, &target) != 2) return 1;
    for (int i = 0; i < n; ++i) if (scanf("%d", &values[i]) != 1) return 1;
    int left = 0, right = n-1;
    while (left < right) {
        long long sum = (long long)values[left] + values[right];
        if (sum == target) {
            puts("YES");
            return 0;
        }
        if (sum < target) ++left;
        else --right;
    }
    puts("NO");
    return 0;
}`,
      python: `import sys

n, target, *values = map(int, sys.stdin.buffer.read().split())
left, right = 0, n-1
while left < right:
    total = values[left] + values[right]
    if total == target:
        print("YES")
        break
    if total < target:
        left += 1
    else:
        right -= 1
else:
    print("NO")`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt(), target = in.nextInt();
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = in.nextInt();
        int left = 0, right = n-1;
        while (left < right) {
            long total = (long)values[left] + values[right];
            if (total == target) {
                System.out.println("YES");
                return;
            }
            if (total < target) left++;
            else right--;
        }
        System.out.println("NO");
    }
}`,
    },
  }
]);
