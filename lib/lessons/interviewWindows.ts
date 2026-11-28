import { defineTopics } from "./define.ts";

export const interviewWindows = defineTopics([
  {
    "id": "interview-unique-window",
    "stage": 14,
    "minutes": 30,
    "title": "Coding mock: longest unique substring",
    "objective": "Clarify the input contract, explain a window invariant aloud, and test an optimized solution.",
    "prerequisites": "Strings, sliding windows, and indexed lookup.",
    "analogy": "Move the start of a playlist past the last copy of a song whenever it repeats.",
    "explanation": "Set a 30-minute timer. Spend 4 minutes clarifying contiguous versus subsequence, allowed characters, and empty input. Spend 6 minutes deriving an exhaustive baseline and improving it. Implement for 12 minutes. Use the final 8 minutes to test and explain complexity. Track the last index of each character. On a repeat, move left to the greater of its current value and one past that character’s previous index.",
    "invariant": "After processing right, the current window is the longest distinct-character suffix ending at right. An earlier left boundary would retain a duplicate. A previous occurrence outside the window leaves its start unchanged.",
    "pseudocode": "last = unseen for every character\nleft = best = 0\nfor right in string indices:\n  left = max(left, last[s[right]]+1)\n  last[s[right]] = right\n  best = max(best,right−left+1)\nprint best",
    "time": "O(n) because each right endpoint is processed once with direct indexing",
    "space": "O(n) for the input line and O(1) for a fixed alphabet",
    "trace": [
      [
        "Input abba | left=0",
        "Confirm that the answer counts a contiguous substring length."
      ],
      [
        "Read a and b",
        "The longest window is ab, of length two."
      ],
      [
        "Read b again",
        "The earlier b is at index 1, so advance left to index 2."
      ],
      [
        "Read a at index 3",
        "Its last occurrence is already outside the window. Left stays at 2. The result is 2."
      ]
    ],
    "misconception": "Assigning left unconditionally from the last occurrence can move it backward and reintroduce a duplicate.",
    "debug": "Trace abba aloud. Explain why the final a cannot move left back to index one.",
    "fill": "What two values should take part in the max that updates left?",
    "edgeCases": [
      "An empty line returns zero.",
      "All-identical letters give length one for nonempty input.",
      "Repeated letters before left do not affect the current window."
    ],
    "revision": "Give a one-minute explanation of your invariant, one edge case, and the time and space bounds.",
    "further": "Repeat the mock with a partner who asks how the solution would change for a larger alphabet.",
    "quiz": {
      "question": "After the second b in abba, what should the last a do to the current left index 2?",
      "answers": [
        "Move it back to 1",
        "Keep it at 2",
        "Move it to 3"
      ],
      "correct": 1,
      "feedback": "The earlier a is outside the active window. Left can advance but never moves backward."
    },
    "practice": {
      "title": "Find the longest unique badge run",
      "description": "Find the length of the longest contiguous run whose letters are all different.",
      "format": "Read one line, possibly empty. Print the maximum length.",
      "constraints": "0 ≤ length ≤ 2000. The line contains lowercase ASCII letters only.",
      "input": "abba\n",
      "output": "2\n",
      "hints": [
        "Record the last index for each letter.",
        "A previous occurrence matters only if it lies inside the current window."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <string.h>
int main(void) {
    char word[2003];
    if (!fgets(word, sizeof word, stdin)) return 0;
    int n = (int)strcspn(word, "\\r\\n"), last[26], left = 0, best = 0;
    for (int i = 0; i < 26; i++) last[i] = -1;
    for (int right = 0; right < n; right++) {
        int key = word[right] - 'a';
        if (last[key] >= left) left = last[key] + 1;
        last[key] = right;
        int length = right - left + 1;
        if (length > best) best = length;
    }
    printf("%d\\n", best);
    return 0;
}`,
      python: `word = input()
last = [-1] * 26
left = best = 0
for right, letter in enumerate(word):
    key = ord(letter) - ord("a")
    left = max(left, last[key] + 1)
    last[key] = right
    best = max(best, right - left + 1)
print(best)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        String word = new Scanner(System.in).nextLine();
        int[] last = new int[26];
        Arrays.fill(last, -1);
        int left = 0, best = 0;
        for (int right = 0; right < word.length(); right++) {
            int key = word.charAt(right) - 'a';
            left = Math.max(left, last[key] + 1);
            last[key] = right;
            best = Math.max(best, right - left + 1);
        }
        System.out.println(best);
    }
}`,
    },
  },
  {
    "id": "interview-prefix-map",
    "stage": 14,
    "minutes": 30,
    "title": "Coding mock: prefix sums with a frequency map",
    "objective": "Explain a baseline, use a signed counterexample to rule out a window, and derive a prefix-map solution.",
    "prerequisites": "Prefix sums, hash maps, and contiguous subarrays.",
    "analogy": "A ledger stores old balances. For a desired change, count how many old balances differ from the current one by exactly that amount.",
    "explanation": "Use a 30-minute mock. Clarify that you count contiguous nonempty segments and that values may be negative. Explain the quadratic baseline of scanning all starts and ends with running sums, then derive the identity current−previous=target. Store how often each earlier prefix occurred, starting with the empty prefix. For each current prefix, add the frequency of current−target before recording the current prefix.",
    "invariant": "Before recording the current prefix, the map contains exactly the prefixes ending before it, including the empty prefix. Each matching earlier prefix defines exactly one nonempty subarray ending at the current position.",
    "pseudocode": "counts = {0: 1}; prefix = answer = 0\nfor value:\n  prefix += value\n  answer += counts.get(prefix−target,0)\n  counts[prefix] += 1\nprint answer",
    "time": "Expected O(n) with well-distributed hashes. A probing hash table can take O(n²) in a collision-heavy worst case",
    "space": "O(n) for stored prefixes",
    "trace": [
      [
        "Input [1,−1,0], target 0",
        "The empty prefix contributes one occurrence of zero."
      ],
      [
        "Read 1 → prefix 1",
        "No earlier prefix is 1. Store one occurrence."
      ],
      [
        "Read −1 → prefix 0",
        "One earlier zero prefix ends a matching segment. Record a second zero."
      ],
      [
        "Read 0 → prefix 0",
        "Two earlier zero prefixes add two segments. The answer is three."
      ]
    ],
    "misconception": "Adding the current prefix before querying can count a zero-length segment when the target is zero.",
    "debug": "Use [0,0] with target zero. There are exactly three nonempty segments.",
    "fill": "Which key should you look up for a current prefix P and target T?",
    "edgeCases": [
      "An empty list contributes no segments.",
      "Repeated prefixes require frequencies.",
      "Negative numbers break the usual nonnegative two-pointer argument."
    ],
    "revision": "Deliver your solution aloud in this order: contract, baseline, invariant, tests, complexity.",
    "further": "Explain how the answer changes when only the longest target-sum segment is requested.",
    "quiz": {
      "question": "Why does the initial table contain zero once?",
      "answers": [
        "To represent the empty prefix",
        "To count empty subarrays in the final answer",
        "To avoid adding any new keys"
      ],
      "correct": 0,
      "feedback": "The empty prefix enables matches starting at the first item. It is an earlier prefix when the first item is processed."
    },
    "practice": {
      "title": "Count target-sum readings",
      "description": "Count the nonempty contiguous ranges summing to the requested target.",
      "format": "Read n target and then n signed readings. Print the number of matching ranges.",
      "constraints": "0 ≤ n ≤ 450, |target| ≤ 10⁸, and |reading| ≤ 10⁵.",
      "input": "3 0\n1 -1 0\n",
      "output": "3\n",
      "hints": [
        "Seek an earlier prefix equal to current prefix minus target.",
        "Count earlier occurrences before inserting the current prefix."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define CAP 1021
static int keys[CAP], counts[CAP];
static int slot(int key) {
    int index = key % CAP;
    if (index < 0) index += CAP;
    while (counts[index] != 0 && keys[index] != key) index = (index + 1) % CAP;
    return index;
}
int main(void) {
    int n, target, prefix = 0, total = 0;
    if (scanf("%d%d", &n, &target) != 2) return 0;
    counts[slot(0)] = 1;
    for (int i = 0; i < n; i++) {
        int reading;
        scanf("%d", &reading);
        prefix += reading;
        total += counts[slot(prefix - target)];
        int index = slot(prefix);
        keys[index] = prefix;
        counts[index]++;
    }
    printf("%d\\n", total);
    return 0;
}`,
      python: `import sys
n, target, *values = map(int, sys.stdin.buffer.read().split())
counts = {0: 1}
prefix = total = 0
for value in values:
    prefix += value
    total += counts.get(prefix - target, 0)
    counts[prefix] = counts.get(prefix, 0) + 1
print(total)`,
      java: `import java.util.HashMap;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), target = in.nextInt(), prefix = 0, total = 0;
        var counts = new HashMap<Integer, Integer>();
        counts.put(0, 1);
        for (int i = 0; i < n; i++) {
            prefix += in.nextInt();
            total += counts.getOrDefault(prefix - target, 0);
            counts.merge(prefix, 1, Integer::sum);
        }
        System.out.println(total);
    }
}`,
    },
  }
]);
