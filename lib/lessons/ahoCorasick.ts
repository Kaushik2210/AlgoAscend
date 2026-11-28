import { defineTopics } from "./define.ts";

export const ahoCorasick = defineTopics([
  {
    "id": "aho-corasick",
    "stage": 12,
    "title": "Aho–Corasick for multi-pattern matching",
    "objective": "Count occurrences of many patterns in one scan, including overlaps and suffix matches.",
    "prerequisites": "Tries, breadth-first search, and KMP failure links.",
    "analogy": "Keep a directory of beginnings shared by many names. When one candidate fails, fall back to the longest ending that could begin another name.",
    "explanation": "Insert every pattern in a trie. Build failure links in breadth-first order. Each failure link points to the longest proper suffix of that node’s string that is also a trie prefix. Fill missing transitions from the failure state, and add its matching-pattern count to each node. One transition per text character then finds every pattern ending there.",
    "invariant": "After any text prefix, the current state is the longest suffix of the consumed text that is a trie prefix. Its output count includes all terminal suffixes, so shorter patterns ending at the same character count too.",
    "pseudocode": "insert every pattern into a trie and count terminals\nBFS over trie nodes:\n  combine terminal count with failure state's count\n  compute failure links and fill missing transitions\nstate = root\nfor letter in text:\n  state = transition[state,letter]\n  add output[state] to answer",
    "time": "O(26P+T) for total pattern length P and text length T with a dense lowercase alphabet table",
    "space": "O(26P + T) for the automaton and stored text",
    "trace": [
      [
        "Patterns he, she, hers | text ushers",
        "The trie includes a terminal for each keyword."
      ],
      [
        "Read ush",
        "At sh, the automaton tracks the suffix of consumed input capable of continuing a keyword."
      ],
      [
        "Read e at position 3",
        "State she matches she and its failure-chain terminal he. Count two occurrences."
      ],
      [
        "Read r and s",
        "The automaton matches hers at the last position. The total is three."
      ]
    ],
    "misconception": "Checking only the current node’s terminal flag misses shorter suffix patterns that end at the same text position.",
    "debug": "Use patterns a, aa and aa on text aaa. Count overlaps and both copies of the repeated pattern.",
    "fill": "How is a missing transition filled once the failure state’s transitions are ready?",
    "edgeCases": [
      "Repeated patterns count separately in this exercise.",
      "An overlap can contribute at every ending position.",
      "Root transitions can return to the root."
    ],
    "revision": "Why build failure links in breadth-first order?",
    "further": "Store pattern IDs instead of only counts and report the positions of all individual occurrences.",
    "quiz": {
      "question": "When the current state is she and both she and he are patterns, how many matches end there?",
      "answers": [
        "One",
        "Two",
        "Three"
      ],
      "correct": 1,
      "feedback": "Both the state’s own pattern and its terminal suffix end at the current character."
    },
    "practice": {
      "title": "Count all flagged phrases",
      "description": "Count occurrences of every listed lowercase pattern in a search text. Overlaps count and so do repeated patterns.",
      "format": "Read k, followed by k lowercase pattern tokens on separate lines and one lowercase text token. Print the total count.",
      "constraints": "1 ≤ k ≤ 150, total pattern length ≤ 600, and 1 ≤ text length ≤ 3000. Tokens contain lowercase ASCII letters only.",
      "input": "3\nhe\nshe\nhers\nushers\n",
      "output": "3\n",
      "hints": [
        "Use an output count rather than a single terminal flag.",
        "Breadth-first failure propagation counts terminal suffixes automatically."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int go[601][26], fail[601], output[601], queue[601];
int main(void) {
    int k, used = 1, head = 0, tail = 0;
    char word[601], text[3001];
    if (scanf("%d", &k) != 1) return 0;
    for (int i = 0; i < k; i++) {
        scanf("%600s", word);
        int node = 0;
        for (int j = 0; word[j]; j++) {
            int c = word[j] - 'a';
            if (!go[node][c]) go[node][c] = used++;
            node = go[node][c];
        }
        output[node]++;
    }
    for (int c = 0; c < 26; c++) if (go[0][c]) queue[tail++] = go[0][c];
    while (head < tail) {
        int node = queue[head++];
        output[node] += output[fail[node]];
        for (int c = 0; c < 26; c++) {
            int child = go[node][c], fallback = go[fail[node]][c];
            if (child) { fail[child] = fallback; queue[tail++] = child; }
            else go[node][c] = fallback;
        }
    }
    scanf("%3000s", text);
    int state = 0, total = 0;
    for (int i = 0; text[i]; i++) {
        state = go[state][text[i] - 'a'];
        total += output[state];
    }
    printf("%d\\n", total);
    return 0;
}`,
      python: `from collections import deque
go, fail, outputs = [[0] * 26], [0], [0]
for _ in range(int(input())):
    node = 0
    for letter in input():
        c = ord(letter) - ord("a")
        if not go[node][c]:
            go[node][c] = len(go)
            go.append([0] * 26)
            fail.append(0)
            outputs.append(0)
        node = go[node][c]
    outputs[node] += 1
queue = deque(child for child in go[0] if child)
while queue:
    node = queue.popleft()
    outputs[node] += outputs[fail[node]]
    for c, child in enumerate(go[node]):
        fallback = go[fail[node]][c]
        if child:
            fail[child] = fallback
            queue.append(child)
        else:
            go[node][c] = fallback
state = total = 0
for letter in input():
    state = go[state][ord(letter) - ord("a")]
    total += outputs[state]
print(total)`,
      java: `import java.util.ArrayDeque;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int k = in.nextInt(), used = 1;
        int[][] go = new int[601][26];
        int[] fail = new int[601], output = new int[601];
        for (int i = 0; i < k; i++) {
            int node = 0;
            for (char letter : in.next().toCharArray()) {
                int c = letter - 'a';
                if (go[node][c] == 0) go[node][c] = used++;
                node = go[node][c];
            }
            output[node]++;
        }
        var queue = new ArrayDeque<Integer>();
        for (int child : go[0]) if (child != 0) queue.addLast(child);
        while (!queue.isEmpty()) {
            int node = queue.removeFirst();
            output[node] += output[fail[node]];
            for (int c = 0; c < 26; c++) {
                int child = go[node][c], fallback = go[fail[node]][c];
                if (child != 0) { fail[child] = fallback; queue.addLast(child); }
                else go[node][c] = fallback;
            }
        }
        int state = 0, total = 0;
        for (char letter : in.next().toCharArray()) {
            state = go[state][letter - 'a'];
            total += output[state];
        }
        System.out.println(total);
    }
}`,
    },
  }
]);
