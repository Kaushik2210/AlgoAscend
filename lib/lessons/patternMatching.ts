import { defineTopics } from "./define.ts";

export const patternMatching = defineTopics([
  {
    "id": "z-algorithm",
    "stage": 12,
    "title": "Z algorithm and prefix matches",
    "objective": "Compute how far the string prefix matches at every starting position in linear time.",
    "prerequisites": "KMP or prefix matching, and inclusive/exclusive indices.",
    "analogy": "Keep the rightmost matching stencil over the text. Positions inside it can reuse comparisons from the corresponding location near the start.",
    "explanation": "For each i>0, Z[i] counts the shared prefix length of s and s starting at i. Keep a rightmost verified matching block [left,right). If i lies in the block, start with the smaller of Z[i−left] and right−i. Extend by comparing characters beyond the known prefix. Save the block whenever a match reaches farther right. This exercise sets Z[0] to zero by convention.",
    "invariant": "The characters in s[left:right] equal the prefix of the same length and right is the furthest exclusive endpoint established so far. The clipped mirror value guarantees the initialized match at i.",
    "pseudocode": "left = right = 0\nfor i from 1 through n−1:\n  if i < right: z[i] = min(z[i−left], right−i)\n  while i+z[i] < n and s[z[i]] == s[i+z[i]]: z[i] += 1\n  if i+z[i] > right: left=i; right=i+z[i]",
    "time": "O(n) time. Each check either fails once per position or extends the rightmost boundary",
    "space": "O(n) for the Z array",
    "trace": [
      [
        "s=ababa | [0,0)",
        "The match at i=1 fails immediately because b differs from a."
      ],
      [
        "i=2 → Z[2]=3 | [2,5)",
        "The substring aba matches the prefix all the way to the end."
      ],
      [
        "i=3 → Z[3]=0",
        "Reuse the mirrored Z[1] within the known block."
      ],
      [
        "i=4 → Z[4]=1",
        "Z[2] is 3, but the known block provides only one remaining character. The final array is 0 0 3 0 1."
      ]
    ],
    "misconception": "A mirrored Z value must be clipped to the known block. Only explicit comparisons can extend beyond it.",
    "debug": "Run a string of identical letters and check that each Z value stays within the remaining suffix length.",
    "fill": "When i is inside the block, what distance caps the mirrored value?",
    "edgeCases": [
      "One character produces Z[0]=0.",
      "All equal characters give n−i for every i>0.",
      "The right endpoint is exclusive."
    ],
    "revision": "What does the window [left,right) certify?",
    "further": "Find all pattern occurrences using pattern + a separator absent from both strings + text.",
    "quiz": {
      "question": "For ababa, what is Z[2]?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 2,
      "feedback": "The suffix at index 2 is aba, and all three characters match the start."
    },
    "practice": {
      "title": "Measure repeat prefixes",
      "description": "For each position, report how many letters match the start of the same string.",
      "format": "Read a nonempty lowercase string. Print its Z array separated by spaces, using zero at index zero.",
      "constraints": "1 ≤ length ≤ 1000. Only lowercase ASCII letters appear.",
      "input": "ababa\n",
      "output": "0 0 3 0 1\n",
      "hints": [
        "Track an exclusive right boundary.",
        "Use the known match window before comparing more characters."
      ]
    },
    code:{
      c: `#include <stdio.h>
#include <string.h>
int main(void) {
    char word[1001];
    int z[1000] = {0};
    if (scanf("%1000s", word) != 1) return 0;
    int n = (int)strlen(word), left = 0, right = 0;
    for (int i = 1; i < n; i++) {
        if (i < right) z[i] = z[i - left] < right - i ? z[i - left] : right - i;
        while (i + z[i] < n && word[z[i]] == word[i + z[i]]) z[i]++;
        if (i + z[i] > right) { left = i; right = i + z[i]; }
    }
    for (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", z[i]);
    puts("");
    return 0;
}`,
      python: `word = input()
n = len(word)
z = [0] * n
left = right = 0
for i in range(1, n):
    if i < right:
        z[i] = min(z[i - left], right - i)
    while i + z[i] < n and word[z[i]] == word[i + z[i]]:
        z[i] += 1
    if i + z[i] > right:
        left, right = i, i + z[i]
print(*z)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        String word = new Scanner(System.in).next();
        int n = word.length(), left = 0, right = 0;
        int[] z = new int[n];
        for (int i = 1; i < n; i++) {
            if (i < right) z[i] = Math.min(z[i - left], right - i);
            while (i + z[i] < n && word.charAt(z[i]) == word.charAt(i + z[i])) z[i]++;
            if (i + z[i] > right) { left = i; right = i + z[i]; }
        }
        var output = new StringBuilder("0");
        for (int i = 1; i < n; i++) output.append(' ').append(z[i]);
        System.out.println(output);
    }
}`,
    },
  }
]);
