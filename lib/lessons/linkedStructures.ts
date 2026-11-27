import { defineTopics } from "./define.ts";

export const linkedStructures = defineTopics([
  {
    "id": "singly-linked-lists",
    "stage": 3,
    "title": "Singly linked lists and pointer updates",
    "objective": "Reverse a singly linked list without losing the remaining nodes.",
    "prerequisites": "Loops and the idea of an array-backed sequence.",
    "analogy": "A trail sign initially points forward. Before turning it around, write down where the old sign pointed so you can continue along the trail.",
    "explanation": "A node stores a value and a link to its successor. In C, that link can be a pointer or an array index. In Python and Java it commonly refers to another object. For a reversal, save the old successor, redirect the current link to the reversed prefix, and move forward to the saved node. This program uses indices in all three languages so the link changes are easy to compare.",
    "invariant": "At the start of each iteration, previous is the head of the reversed prefix and current is the head of the untouched suffix. Both lists together contain every node exactly once.",
    "pseudocode": "previous = null; current = head\nwhile current is not null:\n  successor = current.next\n  current.next = previous\n  previous = current\n  current = successor\nhead = previous",
    "time": "O(n) time",
    "space": "O(n) for the nodes and O(1) extra for reversal. The Python program also buffers input",
    "trace": [
      [
        "previous=null | current=8→4→9",
        "Nothing has moved into the reversed prefix."
      ],
      [
        "previous=8→null | current=4→9",
        "Save the link to 4 before redirecting 8."
      ],
      [
        "previous=4→8→null | current=9",
        "Redirect 4 to the already reversed prefix."
      ],
      [
        "head=9→4→8→null",
        "The suffix is exhausted and the reversed prefix is the full list."
      ]
    ],
    "misconception": "Overwriting current.next before saving its old value can disconnect the untouched suffix.",
    "debug": "Trace a three-node list and check that the new tail points to null.",
    "fill": "Which link must you save before redirecting the current node?",
    "edgeCases": [
      "An empty list has no head and produces an empty line.",
      "One node stays the head and tail.",
      "Duplicate values belong to distinct nodes."
    ],
    "revision": "Which variable identifies the final head?",
    "further": "Reverse only a selected interval by reconnecting its endpoints. Then sketch the additional previous links in a doubly linked list.",
    "quiz": {
      "question": "After redirecting the first node’s link, where does the reversal move next?",
      "answers": [
        "To its newly assigned link",
        "To its saved old successor",
        "Back to the head"
      ],
      "correct": 1,
      "feedback": "The saved old successor starts the untouched suffix."
    },
    "practice": {
      "title": "Reverse a chain of tags",
      "description": "Represent the tags as linked nodes, reverse the links, and follow the new chain to print the tags.",
      "format": "Read n followed by n signed integer tags. Print the reversed list separated by spaces, or an empty line for n = 0.",
      "constraints": "0 ≤ n ≤ 500. Tags are between −10⁶ and 10⁶.",
      "input": "3\n8 4 9\n",
      "output": "9 4 8\n",
      "hints": [
        "Represent null with −1 if using indices.",
        "Save the old next link before replacing it."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n, value[500], next[500];
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &value[i]);
        next[i] = i + 1 < n ? i + 1 : -1;
    }
    int previous = -1, current = n > 0 ? 0 : -1;
    while (current != -1) {
        int successor = next[current];
        next[current] = previous;
        previous = current;
        current = successor;
    }
    for (int i = previous; i != -1; i = next[i]) {
        printf("%s%d", i == previous ? "" : " ", value[i]);
    }
    puts("");
    return 0;
}`,
      python: `import sys
n, *values = map(int, sys.stdin.buffer.read().split())
links = list(range(1, n + 1))
if n:
    links[-1] = -1
previous, current = -1, 0 if n else -1
while current != -1:
    successor = links[current]
    links[current] = previous
    previous, current = current, successor
while previous != -1:
    following = links[previous]
    print(values[previous], end=" " if following != -1 else "")
    previous = following
print()`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        int[] values = new int[n], next = new int[n];
        for (int i = 0; i < n; i++) {
            values[i] = in.nextInt();
            next[i] = i + 1 < n ? i + 1 : -1;
        }
        int previous = -1, current = n > 0 ? 0 : -1;
        while (current != -1) {
            int successor = next[current];
            next[current] = previous;
            previous = current;
            current = successor;
        }
        var out = new StringBuilder();
        for (int i = previous; i != -1; i = next[i]) {
            if (i != previous) out.append(' ');
            out.append(values[i]);
        }
        System.out.println(out);
    }
}`,
    },
  }
]);
