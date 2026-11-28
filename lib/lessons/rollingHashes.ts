import { defineTopics } from "./define.ts";

export const rollingHashes = defineTopics([
  {
    "id": "rabin-karp",
    "stage": 12,
    "title": "Rolling hashes and Rabin–Karp",
    "objective": "Count exact overlapping pattern matches using a rolling fingerprint and a collision check.",
    "prerequisites": "Strings, modular arithmetic and fixed-size windows.",
    "analogy": "Each window has a quick numeric fingerprint. A matching fingerprint earns a direct check before the window is counted.",
    "explanation": "Encode letters as 1 through 26 and evaluate them as digits in base 31 modulo a fixed modulus. To slide a window, remove the outgoing digit’s weighted contribution, multiply the remaining hash by the base, and add the incoming digit. Equal strings produce equal hashes. A hash match triggers a direct character comparison so collisions cannot produce false reports.",
    "invariant": "The rolling state equals the polynomial hash of the current window. Every equal window passes the hash test and direct check. An unequal window is rejected by at least one of those two checks.",
    "pseudocode": "compute the pattern hash and the first window hash\nfor each valid window start:\n  if hashes agree and window equals pattern: increment count\n  if another window exists:\n    subtract outgoing × base^(m−1)\n    multiply by base and add incoming, all modulo M\nprint count",
    "time": "O(n+m+c×m) worst-case time for c windows requiring direct verification",
    "space": "O(n+m) for the input strings and O(1) auxiliary hash state",
    "trace": [
      [
        "Text ababa | pattern aba",
        "The pattern fingerprint is 1×31² + 2×31 + 1 = 1024."
      ],
      [
        "Window 0 = aba | hash 1024",
        "The ordinary comparison confirms a match."
      ],
      [
        "Window 1 = bab | hash 1955",
        "The hashes differ. Skip direct comparison."
      ],
      [
        "Window 2 = aba | hash 1024",
        "The ordinary comparison confirms the second match, which overlaps the first."
      ]
    ],
    "misconception": "Matching hashes alone do not prove equal text. Different windows can share a residue under a modulus.",
    "debug": "Try a pattern longer than the text and two overlapping matches such as aa in aaa.",
    "fill": "Which power of the base weights the outgoing letter in a window of length m?",
    "edgeCases": [
      "A pattern longer than the text gives zero.",
      "A pattern of length one still uses the rolling formula.",
      "Count overlapping occurrences.",
      "Normalize negative intermediate residues in C and Java."
    ],
    "revision": "Why must equal strings have the same fingerprint, even though the converse can fail?",
    "further": "Use a deliberately small modulus to construct a collision and observe the exact check rejecting it.",
    "quiz": {
      "question": "What should the algorithm do when the fingerprints match?",
      "answers": [
        "Count immediately",
        "Compare the actual characters",
        "Skip the window"
      ],
      "correct": 1,
      "feedback": "Hash equality is a candidate. The direct comparison prevents hash collisions from being reported as matches."
    },
    "practice": {
      "title": "Count repeated badge codes",
      "description": "Find every exact occurrence of a badge pattern in an observation string. Count overlapping occurrences.",
      "format": "Read the text and pattern as two nonempty lowercase tokens. Print the number of exact matches.",
      "constraints": "Each token has at most 2000 lowercase ASCII letters.",
      "input": "ababa aba\n",
      "output": "2\n",
      "hints": [
        "Use the same length and formula for pattern and window hashes.",
        "Compare the real characters whenever hashes match."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <string.h>
#define BASE 31LL
#define MOD 1000000007LL
static int digit(char letter) { return letter - 'a' + 1; }
int main(void) {
    char text[2001], pattern[2001];
    if (scanf("%2000s%2000s", text, pattern) != 2) return 0;
    int n = (int)strlen(text), m = (int)strlen(pattern), answer = 0;
    if (m <= n) {
        long long power = 1, target = 0, window = 0;
        for (int i = 0; i < m; i++) {
            if (i > 0) power = power * BASE % MOD;
            target = (target * BASE + digit(pattern[i])) % MOD;
            window = (window * BASE + digit(text[i])) % MOD;
        }
        for (int start = 0; start + m <= n; start++) {
            if (target == window && memcmp(text + start, pattern, (size_t)m) == 0) answer++;
            if (start + m < n) {
                long long outgoing = digit(text[start]) * power % MOD;
                window = ((window - outgoing + MOD) * BASE + digit(text[start + m])) % MOD;
            }
        }
    }
    printf("%d\\n", answer);
    return 0;
}`,
      python: `import sys
text, pattern = sys.stdin.read().split()
n, m = len(text), len(pattern)
base, modulus = 31, 1_000_000_007
answer = 0

def digit(letter):
    return ord(letter) - ord("a") + 1

if m <= n:
    target = window = 0
    power = pow(base, m - 1, modulus)
    for i in range(m):
        target = (target * base + digit(pattern[i])) % modulus
        window = (window * base + digit(text[i])) % modulus
    for start in range(n - m + 1):
        if window == target and text.startswith(pattern, start):
            answer += 1
        if start + m < n:
            window = ((window - digit(text[start]) * power) * base + digit(text[start + m])) % modulus
print(answer)`,
      java: `import java.util.Scanner;
class Main {
    static final long BASE = 31, MOD = 1_000_000_007;
    static int digit(char letter) { return letter - 'a' + 1; }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        String text = in.next(), pattern = in.next();
        int n = text.length(), m = pattern.length(), answer = 0;
        if (m <= n) {
            long power = 1, target = 0, window = 0;
            for (int i = 0; i < m; i++) {
                if (i > 0) power = power * BASE % MOD;
                target = (target * BASE + digit(pattern.charAt(i))) % MOD;
                window = (window * BASE + digit(text.charAt(i))) % MOD;
            }
            for (int start = 0; start + m <= n; start++) {
                if (target == window && text.startsWith(pattern, start)) answer++;
                if (start + m < n) {
                    long outgoing = digit(text.charAt(start)) * power % MOD;
                    window = ((window - outgoing + MOD) * BASE + digit(text.charAt(start + m))) % MOD;
                }
            }
        }
        System.out.println(answer);
    }
}`,
    },
  }
]);
