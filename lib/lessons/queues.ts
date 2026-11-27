import { defineTopics } from "./define.ts";

export const queues = defineTopics([
  {
    "id": "circular-queues",
    "stage": 3,
    "title": "Circular queues",
    "objective": "Implement a bounded first-in, first-out queue that reuses released slots.",
    "prerequisites": "Array indexing, functions and remainders.",
    "analogy": "A carousel holds a limited number of packages. When the front package is removed, its slot can be reused after the tail wraps around.",
    "explanation": "Keep a head index and a count. The next insertion slot is (head + count) modulo capacity. Dequeue from head and advance it modulo capacity. Check count to distinguish an empty queue from a full one.",
    "invariant": "For every logical offset i from 0 through count−1, the ith item in insertion order is stored in buffer[(head+i) mod capacity]. Insertions add the next offset and removals shift the logical head one slot.",
    "pseudocode": "enqueue(x): if count == capacity, report FULL\n  otherwise write at (head+count) mod capacity and increase count\ndequeue(): if count == 0, report EMPTY\n  otherwise output buffer[head], advance head modulo capacity and decrease count",
    "time": "O(1) work per queue operation",
    "space": "O(capacity) for the queue. The Python program also buffers O(q) input tokens",
    "trace": [
      [
        "capacity=2, queue=[]",
        "Head starts at slot 0."
      ],
      [
        "enqueue 4, enqueue 7 → [4, 7]",
        "The two values occupy slots 0 and 1."
      ],
      [
        "dequeue → 4, queue=[7]",
        "Head advances to slot 1."
      ],
      [
        "enqueue 9 → [7, 9]",
        "The tail wraps and writes 9 to slot 0. The next front remains 7."
      ]
    ],
    "misconception": "Resetting head on every insertion loses track of FIFO order once the buffer wraps.",
    "debug": "Fill a capacity-two queue, remove one item, add another, then drain it.",
    "fill": "What is the insertion index when head = 3, count = 2 and capacity = 4?",
    "edgeCases": [
      "Capacity one always uses slot zero.",
      "Overflow leaves existing values untouched.",
      "An empty removal leaves the queue state untouched."
    ],
    "revision": "How do head and count distinguish a full queue from an empty one?",
    "further": "Add a peek operation, then try a deque that also inserts at the front.",
    "quiz": {
      "question": "When a queue of capacity 4 has head 3 and count 2, where is the next insertion?",
      "answers": [
        "Slot 0",
        "Slot 1",
        "Slot 3"
      ],
      "correct": 1,
      "feedback": "(3 + 2) mod 4 is 1. The occupied slots are 3 and 0."
    },
    "practice": {
      "title": "Parcel carousel",
      "description": "Simulate a bounded parcel queue. Report blocked insertions and return the oldest available parcel on each removal.",
      "format": "Read capacity and q. Each operation is either 1 x to enqueue or 2 to dequeue. Print FULL for rejected insertions, EMPTY for empty removals, and the removed value for successful removals.",
      "constraints": "1 ≤ capacity ≤ 500, 0 ≤ q ≤ 400, and −10⁶ ≤ x ≤ 10⁶.",
      "input": "2 8\n1 4\n1 7\n1 8\n2\n1 9\n2\n2\n2\n",
      "output": "FULL\n4\n7\n9\nEMPTY\n",
      "hints": [
        "Track length explicitly.",
        "Apply modulo when advancing the head and when computing the insertion slot."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int capacity, q, data[500], head = 0, count = 0;
    if (scanf("%d%d", &capacity, &q) != 2) return 0;
    for (int i = 0; i < q; i++) {
        int operation;
        scanf("%d", &operation);
        if (operation == 1) {
            int value;
            scanf("%d", &value);
            if (count == capacity) puts("FULL");
            else {
                data[(head + count) % capacity] = value;
                count++;
            }
        } else if (count == 0) puts("EMPTY");
        else {
            printf("%d\\n", data[head]);
            head = (head + 1) % capacity;
            count--;
        }
    }
    return 0;
}`,
      python: `import sys
tokens = iter(map(int, sys.stdin.buffer.read().split()))
capacity, q = next(tokens), next(tokens)
data = [0] * capacity
head = count = 0
for _ in range(q):
    if next(tokens) == 1:
        value = next(tokens)
        if count == capacity:
            print("FULL")
        else:
            data[(head + count) % capacity] = value
            count += 1
    elif count == 0:
        print("EMPTY")
    else:
        print(data[head])
        head = (head + 1) % capacity
        count -= 1`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int capacity = in.nextInt(), q = in.nextInt();
        int[] data = new int[capacity];
        int head = 0, count = 0;
        for (int i = 0; i < q; i++) {
            if (in.nextInt() == 1) {
                int value = in.nextInt();
                if (count == capacity) System.out.println("FULL");
                else {
                    data[(head + count) % capacity] = value;
                    count++;
                }
            } else if (count == 0) System.out.println("EMPTY");
            else {
                System.out.println(data[head]);
                head = (head + 1) % capacity;
                count--;
            }
        }
    }
}`,
    },
  }
]);
