import { defineTopics } from "./define.ts";

export const suffixArrays = defineTopics([
  {
    "id": "suffix-array",
    "stage": 12,
    "title": "Suffix arrays with rank doubling",
    "objective": "Sort every suffix without repeatedly comparing the original strings character by character.",
    "prerequisites": "Lexicographic order, comparison sorting, and integer ranks.",
    "analogy": "Sort file names by short labels first. In each pass, combine two known labels to compare twice as much text.",
    "explanation": "A suffix array lists starting positions ordered by their suffixes. Start with ranks based on one character. To compare the next doubled prefix, sort positions by the pair of ranks of their two halves. Use rank −1 for a missing second half so shorter prefixes sort first. Assign equal ranks to equal pairs and repeat until all ranks are distinct or the covered width reaches the string length.",
    "invariant": "Before a pass with width w, ranks preserve the lexicographic order of suffix prefixes of length up to w. Sorting two consecutive half-ranks gives the same order as comparing prefixes of length up to 2w.",
    "pseudocode": "rank each position by its character\nfor width = 1, 2, 4, … while width < n:\n  sort starts by (rank[i], rank[i+width] or −1)\n  assign equal new ranks to equal pairs\n  stop if all starts have distinct ranks\nprint the sorted starts",
    "time": "O(n log²(n+1)) using an O(n log n) comparison sort at each doubling pass",
    "space": "O(n) for ranks and suffix positions, plus the sorting workspace",
    "trace": [
      [
        "Word banana",
        "The starts are 0 through 5. First-letter ranks put all a-starts before b-starts and n-starts."
      ],
      [
        "Width 1: start 5 has (a,−1)",
        "The suffix a sorts before starts whose first letter is also a."
      ],
      [
        "Width 2: compare starts 3 and 1",
        "The prefix ana of start 3 ends earlier than the prefix anan of start 1."
      ],
      [
        "Final order [5,3,1,0,4,2]",
        "The sorted suffixes are a, ana, anana, banana, na, nana."
      ]
    ],
    "misconception": "Insert a sentinel rank smaller than every real rank when a half is missing. Reusing the smallest character’s real rank loses a distinction.",
    "debug": "Use a string where all characters are equal. The suffixes must be ordered shortest first.",
    "fill": "Which second rank does start i use in a doubling pass of width w?",
    "edgeCases": [
      "A one-letter string returns index zero.",
      "A suffix that is a prefix of another suffix sorts first.",
      "Equal intermediate pairs must share one new rank."
    ],
    "revision": "Why can doubling stop when every rank is distinct?",
    "further": "Replace comparison sorting of rank pairs with counting passes to obtain O(n log n) construction.",
    "quiz": {
      "question": "Which suffix is first when sorting the suffixes of banana?",
      "answers": [
        "banana",
        "anana",
        "a"
      ],
      "correct": 2,
      "feedback": "The shortest a-prefixed suffix is a, starting at index five."
    },
    "practice": {
      "title": "Index the suffixes of a badge",
      "description": "Sort all suffixes of a lowercase word and print their starting positions.",
      "format": "Read one nonempty lowercase ASCII token. Print its zero-based suffix array separated by spaces.",
      "constraints": "1 ≤ length ≤ 1000.",
      "input": "banana\n",
      "output": "5 3 1 0 4 2\n",
      "hints": [
        "Store ranks for positions, not full substring copies.",
        "Assign a new rank only when a sorted pair changes."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
static int rank[1000], n, width;
static int second(int start) {
    return start + width < n ? rank[start + width] : -1;
}
static int compare(const void *a, const void *b) {
    int first = *(const int *)a, other = *(const int *)b;
    if (rank[first] != rank[other]) return rank[first] - rank[other];
    return second(first) - second(other);
}
int main(void) {
    char word[1001];
    int order[1000], updated[1000];
    if (scanf("%1000s", word) != 1) return 0;
    n = (int)strlen(word);
    for (int i = 0; i < n; i++) { order[i] = i; rank[i] = word[i] - 'a'; }
    for (width = 1; width < n; width *= 2) {
        qsort(order, (size_t)n, sizeof(int), compare);
        int group = 0;
        updated[order[0]] = 0;
        for (int i = 1; i < n; i++) {
            if (compare(&order[i - 1], &order[i]) != 0) group++;
            updated[order[i]] = group;
        }
        for (int i = 0; i < n; i++) rank[i] = updated[i];
        if (group == n - 1) break;
    }
    for (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", order[i]);
    puts("");
    return 0;
}`,
      python: `word = input()
n = len(word)
order = list(range(n))
rank = [ord(letter) for letter in word]
width = 1
while width < n:
    def pair(start):
        return rank[start], rank[start + width] if start + width < n else -1

    order.sort(key=pair)
    updated = [0] * n
    group = 0
    for i in range(1, n):
        if pair(order[i - 1]) != pair(order[i]):
            group += 1
        updated[order[i]] = group
    rank = updated
    if group == n - 1:
        break
    width *= 2
print(*order)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    static int compare(int a, int b, int[] rank, int width) {
        if (rank[a] != rank[b]) return Integer.compare(rank[a], rank[b]);
        int x = a + width < rank.length ? rank[a + width] : -1;
        int y = b + width < rank.length ? rank[b + width] : -1;
        return Integer.compare(x, y);
    }
    public static void main(String[] args) {
        String word = new Scanner(System.in).next();
        int n = word.length();
        Integer[] order = new Integer[n];
        int[] rank = new int[n];
        for (int i = 0; i < n; i++) { order[i] = i; rank[i] = word.charAt(i); }
        for (int width = 1; width < n; width *= 2) {
            int step = width;
            int[] current = rank;
            Arrays.sort(order, (a, b) -> compare(a, b, current, step));
            int[] updated = new int[n];
            int group = 0;
            for (int i = 1; i < n; i++) {
                if (compare(order[i - 1], order[i], current, step) != 0) group++;
                updated[order[i]] = group;
            }
            rank = updated;
            if (group == n - 1) break;
        }
        var output = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) output.append(' ');
            output.append(order[i]);
        }
        System.out.println(output);
    }
}`,
    },
  }
]);
