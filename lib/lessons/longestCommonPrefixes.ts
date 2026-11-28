import { defineTopics } from "./define.ts";

export const longestCommonPrefixes = defineTopics([
  {
    "id": "lcp-array",
    "stage": 12,
    "title": "LCP arrays and Kasai’s algorithm",
    "objective": "Compute common-prefix lengths of neighboring suffixes in linear time.",
    "prerequisites": "Suffix arrays, inverse ranks, and lexicographic order.",
    "analogy": "Keep the length of the shared beginning of two adjacent dictionary entries. When moving a start one character forward, keep the portion that is already guaranteed to match.",
    "explanation": "Build the inverse suffix array so you can find the lexicographic predecessor of each suffix. Process starts in original text order. When moving from start i to i+1, the known common prefix can lose at most one character. Removing the first character from a positive match gives a lower bound for the next comparison, even if the new lexicographic predecessor is different. Compare beyond that lower bound to find the exact length.",
    "invariant": "Before comparing a suffix with its predecessor, the retained length is a valid lower bound on their shared prefix. Once the comparison finishes, the stored answer is exact. The next lower bound is the previous match length minus one, clamped at zero.",
    "pseudocode": "build rank[order[r]] = r\nlength = 0\nfor start in 0…n−1:\n  if rank[start] is zero: reset length and continue\n  prev = order[rank[start]−1]\n  extend length while the two characters match\n  lcp[rank[start]] = length\n  length = max(0,length−1)",
    "time": "O(n) given the suffix array, since each start discards at most one unit of matched length unless its rank is zero",
    "space": "O(n) for inverse ranks and the LCP array",
    "trace": [
      [
        "banana | suffix array [5,3,1,0,4,2]",
        "The first entry has no predecessor, so LCP[0]=0."
      ],
      [
        "Start 1, anana vs ana",
        "Their common prefix has length three. Store 3 at rank 2."
      ],
      [
        "Move to start 2, nana vs na",
        "Retain a lower bound of two. It already equals the exact answer."
      ],
      [
        "Final [0,1,3,0,0,2]",
        "Each cell aligns with its suffix rank and describes its predecessor pair."
      ]
    ],
    "misconception": "The LCP array is indexed by suffix rank. Processing text starts in ascending order does not mean results are stored by text index.",
    "debug": "Use repeated characters so the known prefix can be retained for many consecutive starts.",
    "fill": "If a suffix at start i has rank r>0, which suffix-array entry gives its predecessor?",
    "edgeCases": [
      "A single suffix has LCP value zero by convention.",
      "A rank-zero start resets the retained length.",
      "Bounds checks are needed when either suffix ends."
    ],
    "revision": "Why does a prefix shared by two sorted suffixes also constrain all suffixes between them?",
    "further": "Sum all suffix lengths and subtract the LCP sum to count distinct substrings.",
    "quiz": {
      "question": "How long is the common prefix of anana and ana?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 2,
      "feedback": "Both start with ana. The shorter suffix ends after three characters."
    },
    "practice": {
      "title": "Compare adjacent indexed suffixes",
      "description": "Given a word and its valid suffix array, print the common-prefix length for each adjacent pair.",
      "format": "Read a lowercase word and its zero-based suffix array on the next line. Print n entries with LCP[0]=0 and LCP[r] comparing suffixes at ranks r−1 and r.",
      "constraints": "1 ≤ word length ≤ 1000. The supplied array is the valid suffix array for the word.",
      "input": "banana\n5 3 1 0 4 2\n",
      "output": "0 1 3 0 0 2\n",
      "hints": [
        "Invert the suffix array to look up a start’s rank.",
        "For the next text position retain a lower bound of at most one less than the just-computed length."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <string.h>
int main(void) {
    char word[1001];
    int order[1000], rank[1000], lcp[1000] = {0}, length = 0;
    if (scanf("%1000s", word) != 1) return 0;
    int n = (int)strlen(word);
    for (int r = 0; r < n; r++) { scanf("%d", &order[r]); rank[order[r]] = r; }
    for (int start = 0; start < n; start++) {
        int r = rank[start];
        if (!r) { length = 0; continue; }
        int previous = order[r - 1];
        while (start + length < n && previous + length < n && word[start + length] == word[previous + length]) length++;
        lcp[r] = length;
        if (length > 0) length--;
    }
    for (int r = 0; r < n; r++) printf("%s%d", r ? " " : "", lcp[r]);
    puts("");
    return 0;
}`,
      python: `word = input()
order = list(map(int, input().split()))
n = len(word)
rank, lcp = [0] * n, [0] * n
for index, start in enumerate(order):
    rank[start] = index
length = 0
for start in range(n):
    index = rank[start]
    if index == 0:
        length = 0
        continue
    previous = order[index - 1]
    while start + length < n and previous + length < n and word[start + length] == word[previous + length]:
        length += 1
    lcp[index] = length
    length = max(0, length - 1)
print(*lcp)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        String word = in.next();
        int n = word.length(), length = 0;
        int[] order = new int[n], rank = new int[n], lcp = new int[n];
        for (int r = 0; r < n; r++) { order[r] = in.nextInt(); rank[order[r]] = r; }
        for (int start = 0; start < n; start++) {
            int r = rank[start];
            if (r == 0) { length = 0; continue; }
            int previous = order[r - 1];
            while (start + length < n && previous + length < n && word.charAt(start + length) == word.charAt(previous + length)) length++;
            lcp[r] = length;
            if (length > 0) length--;
        }
        var output = new StringBuilder();
        for (int r = 0; r < n; r++) {
            if (r > 0) output.append(' ');
            output.append(lcp[r]);
        }
        System.out.println(output);
    }
}`,
    },
  }
]);
