import { defineTopics } from "./define.ts";

export const permutationBacktracking = defineTopics([
  {
    "id": "distinct-permutations",
    "stage": 7,
    "title": "Permutations and duplicate pruning",
    "objective": "Count distinct arrangements of a multiset by backtracking over remaining frequencies.",
    "prerequisites": "Recursion, frequency maps and backtracking.",
    "analogy": "Arrange letter tiles on a shelf. Two copies of the same letter create the same next shelf state, so choose the letter rather than the physical tile.",
    "explanation": "Store the remaining frequency of each letter. At a depth, try each letter with positive count, decrement it, recurse, and restore it afterward. Branching by distinct letter creates one branch for each viable next choice. The exercise also rejects a branch that repeats the previous letter, so an invalid prefix is pruned immediately.",
    "invariant": "At depth d, the prefix has d letters and no adjacent duplicates. The counts describe exactly the unused multiset. A complete valid arrangement has a unique sequence of choices, so it is counted once.",
    "pseudocode": "count(remaining, previous):\n  if remaining is zero: return 1\n  result = 0\n  for each letter with positive count and different from previous:\n    remove one copy\n    result += count(remaining−1, letter)\n    restore the copy\n  return result",
    "time": "O(26 × n!) worst-case time for n letters, with many branches eliminated by pruning",
    "space": "O(n+26) for recursion and frequencies",
    "trace": [
      [
        "aab | counts a=2, b=1",
        "The root can choose a or b once each."
      ],
      [
        "Choose a, then b",
        "Another a would repeat the previous letter, so try b."
      ],
      [
        "Choose a → aba",
        "This consumes all letters and contributes one arrangement."
      ],
      [
        "Choose b first → ba, then stop",
        "Only a remains after ba. Repeating a is forbidden, so this branch contributes zero."
      ]
    ],
    "misconception": "Treating identical tiles as distinct positions reproduces duplicate permutations.",
    "debug": "Check aaa. The first tile can be placed, but no valid next choice exists.",
    "fill": "Which value must be restored immediately after returning from a recursive choice?",
    "edgeCases": [
      "One letter gives exactly one arrangement.",
      "All identical letters of length at least two give zero.",
      "Every arrangement preserves the input frequencies."
    ],
    "revision": "Why does frequency-based branching avoid duplicates without storing every final string?",
    "further": "Memoize by the tuple of remaining counts and the previous letter.",
    "quiz": {
      "question": "How many valid distinct arrangements of aab have no equal adjacent letters?",
      "answers": [
        "0",
        "1",
        "2"
      ],
      "correct": 1,
      "feedback": "Only aba separates the two copies of a."
    },
    "practice": {
      "title": "Arrange the briefing tiles",
      "description": "Count the distinct arrangements of letter tiles that never put equal letters next to one another.",
      "format": "Read one lowercase word and print the number of valid distinct permutations.",
      "constraints": "1 ≤ length ≤ 8. Each character is lowercase ASCII.",
      "input": "aab\n",
      "output": "1\n",
      "hints": [
        "Branch on a letter and maintain its remaining count.",
        "Carry the last selected letter to rule out repetition."
      ]
    },
    code:{
      c: `#include <stdio.h>
#include <string.h>
static int frequency[26];
static int arrangements(int remaining, int previous) {
    if (remaining == 0) return 1;
    int total = 0;
    for (int letter = 0; letter < 26; letter++) {
        if (letter == previous || frequency[letter] == 0) continue;
        frequency[letter]--;
        total += arrangements(remaining - 1, letter);
        frequency[letter]++;
    }
    return total;
}
int main(void) {
    char word[9];
    if (scanf("%8s", word) != 1) return 0;
    int n = (int)strlen(word);
    for (int i = 0; i < n; i++) frequency[word[i] - 'a']++;
    printf("%d\\n", arrangements(n, -1));
    return 0;
}`,
      python: `from collections import Counter
word = input()
counts = Counter(word)

def arrangements(remaining, previous):
    if remaining == 0:
        return 1
    total = 0
    for letter in counts:
        if letter == previous or counts[letter] == 0:
            continue
        counts[letter] -= 1
        total += arrangements(remaining - 1, letter)
        counts[letter] += 1
    return total

print(arrangements(len(word), ""))`,
      java: `import java.util.Scanner;
class Main {
    static int arrangements(int[] counts, int remaining, int previous) {
        if (remaining == 0) return 1;
        int total = 0;
        for (int letter = 0; letter < counts.length; letter++) {
            if (letter == previous || counts[letter] == 0) continue;
            counts[letter]--;
            total += arrangements(counts, remaining - 1, letter);
            counts[letter]++;
        }
        return total;
    }
    public static void main(String[] args) {
        String word = new Scanner(System.in).next();
        int[] counts = new int[26];
        for (int i = 0; i < word.length(); i++) counts[word.charAt(i) - 'a']++;
        System.out.println(arrangements(counts, word.length(), -1));
    }
}`,
    },
  },
  {
    "id": "n-queens",
    "stage": 7,
    "title": "N-Queens and constraint pruning",
    "objective": "Count legal queen layouts by placing one queen per row and pruning attacks.",
    "prerequisites": "Recursion, backtracking and coordinate indexing.",
    "analogy": "Reserve one seat per row while blocking each selected column and both diagonals that cross the seat.",
    "explanation": "Each recursive call fills one row. Mark occupied columns, r+c diagonals and r−c diagonals shifted by n−1. Try only placements for which all three marks are clear, then unmark each choice after exploring its descendants.",
    "invariant": "Before entering row r, exactly one queen occupies each earlier row and none attack each other. The mark arrays describe exactly their occupied columns and diagonals.",
    "pseudocode": "place(row):\n  if row == n: return 1\n  answer = 0\n  for each column:\n    if column and diagonals are free:\n      mark them\n      answer += place(row+1)\n      unmark them\n  return answer",
    "time": "O(n × n!) as a simple upper bound with an n-column scan per partial placement",
    "space": "O(n) for marks and recursion depth",
    "trace": [
      [
        "4×4 | row 0 → col 1",
        "Mark column 1 and the two diagonals through (0,1)."
      ],
      [
        "row 1 → col 3",
        "Columns zero and two are on attacked diagonals. Column three remains available."
      ],
      [
        "row 2 → col 0",
        "Its column and both diagonals are clear."
      ],
      [
        "row 3 → col 2",
        "The columns [1,3,0,2] give a full legal arrangement. Undo the last placement to keep searching."
      ]
    ],
    "misconception": "Tracking columns alone allows diagonal attacks. Rows with equal r−c or equal r+c lie on the same diagonal.",
    "debug": "The boards of sizes two and three have no solutions.",
    "fill": "Which offset turns the potentially negative diagonal index r−c into an array index?",
    "edgeCases": [
      "Size one has one solution.",
      "A row with no legal column returns zero.",
      "Reflections and rotations are counted as distinct board placements."
    ],
    "revision": "Why is one queen per row sufficient for searching all legal arrangements of n queens?",
    "further": "Represent occupied columns and diagonals as bit masks and compare the search.",
    "quiz": {
      "question": "Which two cells share a descending diagonal?",
      "answers": [
        "(0,0) and (1,1)",
        "(0,0) and (1,2)",
        "(0,0) and (1,0)"
      ],
      "correct": 0,
      "feedback": "Both cells have row minus column equal to zero."
    },
    "practice": {
      "title": "Place the nonattacking queens",
      "description": "Count the ways to place n queens on an n-by-n board so none share a row, column or diagonal.",
      "format": "Read n. Print the number of distinct valid arrangements.",
      "constraints": "1 ≤ n ≤ 9.",
      "input": "4\n",
      "output": "2\n",
      "hints": [
        "Place one queen per row.",
        "Track columns and both diagonal directions separately."
      ]
    },
    code:{
      c: `#include <stdio.h>
static int n, columns[9], sum_diag[17], diff_diag[17];
static int place(int row) {
    if (row == n) return 1;
    int count = 0;
    for (int col = 0; col < n; col++) {
        int sum = row + col, diff = row - col + n - 1;
        if (columns[col] || sum_diag[sum] || diff_diag[diff]) continue;
        columns[col] = sum_diag[sum] = diff_diag[diff] = 1;
        count += place(row + 1);
        columns[col] = sum_diag[sum] = diff_diag[diff] = 0;
    }
    return count;
}
int main(void) {
    if (scanf("%d", &n) != 1) return 0;
    printf("%d\\n", place(0));
    return 0;
}`,
      python: `n = int(input())
columns = [False] * n
sum_diag = [False] * (2 * n - 1)
diff_diag = [False] * (2 * n - 1)

def place(row):
    if row == n:
        return 1
    count = 0
    for col in range(n):
        diagonal_sum, diagonal_diff = row + col, row - col + n - 1
        if columns[col] or sum_diag[diagonal_sum] or diff_diag[diagonal_diff]:
            continue
        columns[col] = sum_diag[diagonal_sum] = diff_diag[diagonal_diff] = True
        count += place(row + 1)
        columns[col] = sum_diag[diagonal_sum] = diff_diag[diagonal_diff] = False
    return count

print(place(0))`,
      java: `import java.util.Scanner;
class Main {
    static boolean[] columns, sumDiag, diffDiag;
    static int place(int row) {
        int n = columns.length;
        if (row == n) return 1;
        int count = 0;
        for (int col = 0; col < n; col++) {
            int sum = row + col, diff = row - col + n - 1;
            if (columns[col] || sumDiag[sum] || diffDiag[diff]) continue;
            columns[col] = sumDiag[sum] = diffDiag[diff] = true;
            count += place(row + 1);
            columns[col] = sumDiag[sum] = diffDiag[diff] = false;
        }
        return count;
    }
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        columns = new boolean[n];
        sumDiag = new boolean[2 * n - 1];
        diffDiag = new boolean[2 * n - 1];
        System.out.println(place(0));
    }
}`,
    },
  }
]);
