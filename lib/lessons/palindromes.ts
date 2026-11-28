import { defineTopics } from "./define.ts";

export const palindromes = defineTopics([
  {
    "id": "manacher-palindromes",
    "stage": 12,
    "title": "Manacher’s algorithm for palindromes",
    "objective": "Find the longest palindromic substring by reusing information from mirrored centers.",
    "prerequisites": "String indexing, palindromes, and the Z algorithm’s reuse idea.",
    "analogy": "A mirror shows what is already known on the other side of a center. Examine new positions only where the mirror’s guarantee ends.",
    "explanation": "Insert a separator between every pair of letters and at both ends. Each odd or even palindrome now has one transformed center. Keep the processed palindrome with the farthest right endpoint. For a center inside it, initialize its radius from the mirrored center, clipped to the right boundary. Expand by direct comparison and update the outer palindrome when a new match extends farther.",
    "invariant": "The interval from center−radius[center] to right=center+radius[center] is a verified palindrome. A mirrored radius gives a valid starting radius inside it. Only a direct comparison can extend the guaranteed boundary.",
    "pseudocode": "s = separator + letters separated by separator + separator\nfor each center i from left to right:\n  if i is inside the known window: radius[i] = min(radius[mirror],right−i)\n  compare outward until mismatch or boundary\n  if i+radius[i] > right: update the outer center and right boundary\nprint the largest radius",
    "time": "O(n) because successful expansion beyond the known boundary advances the rightmost endpoint, with at most one failed comparison per center",
    "space": "O(n) for the transformed text and radii",
    "trace": [
      [
        "Input abba → #a#b#b#a#",
        "Separators turn gaps between letters into explicit centers."
      ],
      [
        "Center at the middle #",
        "Compare b with b, then the separators, then a with a."
      ],
      [
        "Radius becomes 4",
        "The transformed palindrome spans all nine characters and covers four original letters."
      ],
      [
        "Next center reuses its mirror",
        "Clip to the old right boundary. The maximum original length stays 4."
      ]
    ],
    "misconception": "Returning the transformed palindrome’s full width overcounts separators. Its radius equals the original palindrome length.",
    "debug": "Compare an even palindrome, an odd palindrome, and a run of identical letters.",
    "fill": "For center i and outer center c, what index is the mirror of i?",
    "edgeCases": [
      "One letter has palindrome length one.",
      "The longest palindrome can have odd or even length.",
      "Any separator outside the input alphabet works."
    ],
    "revision": "Where does the linear bound come from when the loop expands multiple times?",
    "further": "Return the earliest start of a longest palindrome when the maximum occurs more than once.",
    "quiz": {
      "question": "What original length corresponds to radius 4 in the separator string?",
      "answers": [
        "2",
        "4",
        "9"
      ],
      "correct": 1,
      "feedback": "The center and separators contribute to the transformed width, but the radius counts the original palindrome’s length."
    },
    "practice": {
      "title": "Find the longest mirrored badge",
      "description": "Return the length of the longest contiguous palindrome in a lowercase string.",
      "format": "Read one nonempty lowercase ASCII token. Print the longest palindromic substring length.",
      "constraints": "1 ≤ length ≤ 2000.",
      "input": "abba\n",
      "output": "4\n",
      "hints": [
        "Use separators to represent even-length centers.",
        "Clip the mirrored radius at the current right boundary."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <string.h>
int main(void) {
    char word[2001], text[4001];
    int radius[4001] = {0}, center = 0, right = 0, best = 0;
    if (scanf("%2000s", word) != 1) return 0;
    int n = (int)strlen(word), length = 2 * n + 1;
    for (int i = 0; i < length; i++) text[i] = i % 2 ? word[i / 2] : '#';
    for (int i = 0; i < length; i++) {
        if (i < right) {
            int mirror = radius[2 * center - i];
            radius[i] = mirror < right - i ? mirror : right - i;
        }
        int p = radius[i];
        while (i - p > 0 && i + p + 1 < length && text[i - p - 1] == text[i + p + 1]) p++;
        radius[i] = p;
        if (i + p > right) { center = i; right = i + p; }
        if (p > best) best = p;
    }
    printf("%d\\n", best);
    return 0;
}`,
      python: `word = input()
text = "#" + "#".join(word) + "#"
radius = [0] * len(text)
center = right = best = 0
for i in range(len(text)):
    p = min(radius[2 * center - i], right - i) if i < right else 0
    while i - p > 0 and i + p + 1 < len(text) and text[i - p - 1] == text[i + p + 1]:
        p += 1
    radius[i] = p
    if i + p > right:
        center, right = i, i + p
    best = max(best, p)
print(best)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        String word = new Scanner(System.in).next();
        char[] text = new char[2 * word.length() + 1];
        for (int i = 0; i < text.length; i++) text[i] = i % 2 == 0 ? '#' : word.charAt(i / 2);
        int[] radius = new int[text.length];
        int center = 0, right = 0, best = 0;
        for (int i = 0; i < text.length; i++) {
            int p = i < right ? Math.min(radius[2 * center - i], right - i) : 0;
            while (i - p > 0 && i + p + 1 < text.length && text[i - p - 1] == text[i + p + 1]) p++;
            radius[i] = p;
            if (i + p > right) { center = i; right = i + p; }
            best = Math.max(best, p);
        }
        System.out.println(best);
    }
}`,
    },
  }
]);
