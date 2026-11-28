import { defineTopics } from "./define.ts";

export const interviewLinked = defineTopics([
  {
    "id": "interview-cycle-entry",
    "stage": 14,
    "minutes": 30,
    "title": "Coding mock: fast and slow pointers",
    "objective": "Find the entry to a cycle and explain why two pointer speeds reveal it.",
    "prerequisites": "Singly linked lists, references or indices, and modular arithmetic.",
    "analogy": "A runner moving twice as fast will catch a slower runner on a loop. Resetting one runner to the start and moving both together identifies the entrance.",
    "explanation": "Take 30 minutes. First clarify that equality means the same node and a missing successor ends the list. Advance slow by one and fast by two until they meet or fast reaches the end. If they meet, reset one pointer to the head and move both by one until they meet again.",
    "invariant": "If the first meeting occurs after t slow steps, fast took 2t steps, so t is a multiple of the cycle length. If the prefix length is a, the first meeting is offset (t−a) around the cycle. Advancing by a more steps reaches the entry. A pointer restarted at the head also reaches the entry in a steps.",
    "pseudocode": "slow = fast = head\nwhile fast and its successor exist:\n  advance slow once and fast twice\n  if slow == fast:\n    start = head\n    advance start and slow once until they coincide\n    return that node\nreturn −1",
    "time": "O(n) pointer steps for at most n reachable nodes",
    "space": "O(1) extra for detection, plus O(n) for the input representation",
    "trace": [
      [
        "0→1→2→3→4→2",
        "The prefix has two edges before entering the cycle at 2."
      ],
      [
        "First steps (slow,fast)=(1,2),(2,4)",
        "The distance between the pointers changes by one each step once both are on the cycle."
      ],
      [
        "Third step → (3,3)",
        "Detection found a meeting. The entry is still unknown."
      ],
      [
        "Reset one pointer → (0,3), then (1,4), then (2,2)",
        "The second meeting identifies the entry, vertex 2."
      ]
    ],
    "misconception": "The first collision detects a cycle. It can occur at a different node from the entry.",
    "debug": "Test an acyclic list whose length is odd. Explain why the fast pointer needs two termination checks.",
    "fill": "After the first collision, where should one pointer restart?",
    "edgeCases": [
      "An empty list returns −1.",
      "A self-loop is a cycle of length one.",
      "Unreachable cycles do not count."
    ],
    "revision": "Explain the pointer meeting argument aloud before coding the reset step.",
    "further": "Compare with a visited set and discuss which solution is easier to adapt if each node has multiple outgoing links.",
    "quiz": {
      "question": "What is the next step after the first collision?",
      "answers": [
        "Return that node immediately",
        "Restart one pointer at the head and move both one step at a time",
        "Restart both pointers and move at different speeds again"
      ],
      "correct": 1,
      "feedback": "Equal-speed motion after the one-pointer reset finds the entrance instead of an arbitrary collision point."
    },
    "practice": {
      "title": "Find the entry of a signal loop",
      "description": "Starting at node zero, follow successor pointers and report the first node on the resulting cycle, or −1.",
      "format": "Read n followed by n successors. A successor of −1 means no next node. The list is empty for n=0.",
      "constraints": "0 ≤ n ≤ 500. Each successor is −1 or in 0 through n−1.",
      "input": "5\n1 2 3 4 2\n",
      "output": "2\n",
      "hints": [
        "Check that the fast pointer can take both steps.",
        "The first and second pointer collisions serve different purposes."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int entry(const int *next, int head) {
    int slow = head, fast = head;
    while (fast != -1 && next[fast] != -1) {
        slow = next[slow];
        fast = next[next[fast]];
        if (slow == fast) {
            while (head != slow) { head = next[head]; slow = next[slow]; }
            return head;
        }
    }
    return -1;
}
int main(void) {
    int n, next[500];
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &next[i]);
    printf("%d\\n", entry(next, n ? 0 : -1));
    return 0;
}`,
      python: `import sys
n, *links = map(int, sys.stdin.buffer.read().split())

def entry(head):
    slow = fast = head
    while fast != -1 and links[fast] != -1:
        slow, fast = links[slow], links[links[fast]]
        if slow == fast:
            while head != slow:
                head, slow = links[head], links[slow]
            return head
    return -1

print(entry(0 if n else -1))`,
      java: `import java.util.Scanner;
class Main {
    static int entry(int[] next, int head) {
        int slow = head, fast = head;
        while (fast != -1 && next[fast] != -1) {
            slow = next[slow];
            fast = next[next[fast]];
            if (slow == fast) {
                while (head != slow) { head = next[head]; slow = next[slow]; }
                return head;
            }
        }
        return -1;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        int[] next = new int[n];
        for (int i = 0; i < n; i++) next[i] = in.nextInt();
        System.out.println(entry(next, n > 0 ? 0 : -1));
    }
}`,
    },
  }
]);
