import { defineTopics } from "./define.ts";

export const suffixAutomata = defineTopics([
  {
    "id": "suffix-automaton",
    "stage": 12,
    "title": "Suffix automata and distinct substrings",
    "objective": "Build a suffix automaton online and count distinct nonempty substrings from its states.",
    "prerequisites": "Automata, tries, and suffix links.",
    "analogy": "Compress a catalog so strings ending at the same positions share one record. Split a record only when a new letter makes two endings behave differently.",
    "explanation": "A suffix automaton groups substrings by their sets of ending positions in the processed text. Each state represents a contiguous interval of substring lengths. Its maximum is maxLen[state] and its minimum is maxLen[link[state]]+1. Appending a letter creates a new last state, fills missing transitions along suffix links, and sometimes clones a state to split a length interval. Summing the interval sizes counts distinct substrings.",
    "invariant": "Paths from the initial state spell substrings of the processed text. A suffix link reaches the state of the longest suffix with a different set of ending positions. If a transition would put a shorter string into an incorrect length class, a clone with a smaller maximum length separates the classes.",
    "pseudocode": "extend(letter):\n  create a state current with maxLen[last]+1\n  along suffix links, add missing letter transitions to current\n  if no earlier transition exists: link current to root\n  otherwise let target be the first existing transition\n  link current to target if lengths meet by one\n  else clone target with shorter maximum length and redirect transitions\nsum maxLen[v] − maxLen[link[v]] over all nonroot states",
    "time": "O(n) for a fixed alphabet using amortized extension and transition copies of constant size",
    "space": "O(26n) for dense transitions and O(n) suffix links and lengths",
    "trace": [
      [
        "Process ab",
        "The terminal state for ab also represents b, both ending at position 1."
      ],
      [
        "Append another b",
        "Now b ends in two places, while ab still ends at position 1."
      ],
      [
        "Clone with maximum length 1",
        "Redirect the single-letter b transition to the clone. Longer strings stay in their existing class."
      ],
      [
        "For abb, count 5",
        "The distinct nonempty substrings are a, b, ab, bb, and abb."
      ]
    ],
    "misconception": "A clone is not a new consumed character. Copy transitions and the old suffix link, and shorten only its maximum length.",
    "debug": "Try abb to exercise cloning, then aaaa to verify that repeated letters add one distinct substring each.",
    "fill": "Which two state lengths determine how many distinct substrings a state contributes?",
    "edgeCases": [
      "Exclude the initial state from the count.",
      "A repeated-letter word has one distinct substring per length.",
      "A clone may be required even when the next state already has a transition on that letter."
    ],
    "revision": "Why is it incorrect to count states alone as distinct substrings?",
    "further": "Propagate occurrence counts in decreasing maximum length to query substring frequencies.",
    "quiz": {
      "question": "A state has maximum length 7 and its suffix link has maximum length 3. How many distinct substring lengths does the state contribute?",
      "answers": [
        "3",
        "4",
        "7"
      ],
      "correct": 1,
      "feedback": "It represents lengths 4 through 7, giving 7−3 = 4."
    },
    "practice": {
      "title": "Count distinct fragments of a signal",
      "description": "Count the distinct nonempty substrings of the input token.",
      "format": "Read one lowercase ASCII token. Print the number of distinct nonempty substrings.",
      "constraints": "1 ≤ length ≤ 2000.",
      "input": "abb\n",
      "output": "5\n",
      "hints": [
        "Build states and suffix links as characters arrive.",
        "A state contributes the difference between its maximum length and its suffix-link state’s maximum length."
      ]
    },
    code: {
      c: `#include <stdio.h>
typedef struct { int go[26], link, length; } State;
static State states[4001];
static int used = 1, last;
static void extend(int letter) {
    int current = used++, p = last;
    states[current].length = states[last].length + 1;
    while (p != -1 && !states[p].go[letter]) {
        states[p].go[letter] = current;
        p = states[p].link;
    }
    if (p == -1) states[current].link = 0;
    else {
        int target = states[p].go[letter];
        if (states[p].length + 1 == states[target].length) states[current].link = target;
        else {
            int clone = used++;
            states[clone] = states[target];
            states[clone].length = states[p].length + 1;
            while (p != -1 && states[p].go[letter] == target) {
                states[p].go[letter] = clone;
                p = states[p].link;
            }
            states[target].link = states[current].link = clone;
        }
    }
    last = current;
}
int main(void) {
    char word[2001];
    if (scanf("%2000s", word) != 1) return 0;
    states[0].link = -1;
    for (int i = 0; word[i]; i++) extend(word[i] - 'a');
    int total = 0;
    for (int i = 1; i < used; i++) total += states[i].length - states[states[i].link].length;
    printf("%d\\n", total);
    return 0;
}`,
      python: `word = input()
go, link, length = [[0] * 26], [-1], [0]
last = 0
for char in word:
    c = ord(char) - ord("a")
    current, p = len(go), last
    go.append([0] * 26)
    link.append(0)
    length.append(length[last] + 1)
    while p != -1 and not go[p][c]:
        go[p][c] = current
        p = link[p]
    if p != -1:
        target = go[p][c]
        if length[p] + 1 == length[target]:
            link[current] = target
        else:
            clone = len(go)
            go.append(go[target][:])
            link.append(link[target])
            length.append(length[p] + 1)
            while p != -1 and go[p][c] == target:
                go[p][c] = clone
                p = link[p]
            link[target] = link[current] = clone
    last = current
print(sum(length[i] - length[link[i]] for i in range(1, len(go))))`,
      java: `import java.util.Scanner;
class Main {
    static int[][] go;
    static int[] link, length;
    static int used = 1, last;
    static void extend(int c) {
        int current = used++, p = last;
        length[current] = length[last] + 1;
        while (p != -1 && go[p][c] == 0) {
            go[p][c] = current;
            p = link[p];
        }
        if (p != -1) {
            int target = go[p][c];
            if (length[p] + 1 == length[target]) link[current] = target;
            else {
                int clone = used++;
                go[clone] = go[target].clone();
                length[clone] = length[p] + 1;
                link[clone] = link[target];
                while (p != -1 && go[p][c] == target) {
                    go[p][c] = clone;
                    p = link[p];
                }
                link[target] = link[current] = clone;
            }
        }
        last = current;
    }
    public static void main(String[] args) {
        String word = new Scanner(System.in).next();
        int capacity = 2 * word.length() + 1, total = 0;
        go = new int[capacity][26];
        link = new int[capacity];
        length = new int[capacity];
        link[0] = -1;
        for (char c : word.toCharArray()) extend(c - 'a');
        for (int i = 1; i < used; i++) total += length[i] - length[link[i]];
        System.out.println(total);
    }
}`,
    },
  }
]);
