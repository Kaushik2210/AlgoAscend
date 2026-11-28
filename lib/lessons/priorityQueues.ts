import { defineTopics } from "./define.ts";

export const priorityQueues = defineTopics([
  {
    "id": "binary-heaps",
    "stage": 3,
    "title": "Binary heaps and priority queues",
    "objective": "Remove the minimum-priority task efficiently while inserting new tasks online.",
    "prerequisites": "Arrays, tree levels and loops.",
    "analogy": "Keep the most urgent ticket at the top of a pile. Restoring the ordering after a change requires moving along only one path through the pile.",
    "explanation": "The priority-queue interface inserts and removes a minimum. In a binary min-heap the parent key is at most either child key. Store a complete tree in an array. Insert at the end and sift up. To remove the root, move the last key into its place and sift it down through the smaller child. Python heapq and Java PriorityQueue provide this interface.",
    "invariant": "The array represents a complete tree, and every parent is at most both children. Sifting after an update repairs the only path where a violation can remain. The parent rule along all root-to-node paths implies a minimum is at the root.",
    "pseudocode": "push key:\n  append key\n  while key is smaller than parent: swap upward\npop minimum:\n  save root and move last key to root\n  while root replacement is larger than its smaller child: swap downward\n  return saved root",
    "time": "O(log(n+1)) per insert or nonempty removal, where n is the current size",
    "space": "O(n) for stored keys, or O(q) reserved capacity in the C example with q operations",
    "trace": [
      [
        "Insert 6, then 2",
        "Append 2 as a child and swap it above 6. The heap is [2,6]."
      ],
      [
        "Insert 9",
        "Append 9 at index two. The root already has the smallest key."
      ],
      [
        "Remove → 2",
        "Move 9 to the root. It is larger than its child, 6, so swap."
      ],
      [
        "Heap [6,9]",
        "The smallest remaining task is now 6."
      ]
    ],
    "misconception": "A valid heap array does not need to be fully sorted. The parent comparisons are the required ordering.",
    "debug": "Insert an increasing run, then remove the minimum until empty. Check the heap with one child as well.",
    "fill": "When sifting down, which child should swap with a parent that is larger than both?",
    "edgeCases": [
      "An empty removal prints EMPTY.",
      "Duplicates stay as separate entries.",
      "Negative keys can be more urgent than positive keys."
    ],
    "revision": "Why does the heap rule imply the root is a global minimum?",
    "further": "Store a secondary arrival index to break ties predictably.",
    "quiz": {
      "question": "When a replacement root is larger than both children, which child should move up?",
      "answers": [
        "The smaller child",
        "The larger child",
        "Always the left child"
      ],
      "correct": 0,
      "feedback": "Picking the smaller child preserves the parent rule between the new root and the sibling."
    },
    "practice": {
      "title": "Dispatch the most urgent request",
      "description": "Read requests and answer removals by returning the smallest priority currently waiting.",
      "format": "Read q followed by q operation lines. Use 1 x to insert x and 2 to remove and print the minimum. Print EMPTY if a removal finds no requests.",
      "constraints": "0 ≤ q ≤ 500. Priorities are integers from −10⁶ through 10⁶.",
      "input": "6\n1 6\n1 2\n1 9\n2\n2\n2\n",
      "output": "2\n6\n9\n",
      "hints": [
        "Maintain a min-heap rather than sorting the whole list after every update.",
        "The first array item is the next key to remove."
      ]
    },
    code: {
      c: `#include <stdio.h>
static int heap[500];
static int size;
static void swap(int first, int second) {
    int saved = heap[first];
    heap[first] = heap[second];
    heap[second] = saved;
}
static void push(int value) {
    int i = size++;
    heap[i] = value;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[parent] <= heap[i]) break;
        swap(i, parent);
        i = parent;
    }
}
static int pop(void) {
    int answer = heap[0];
    heap[0] = heap[--size];
    int i = 0;
    while (2 * i + 1 < size) {
        int child = 2 * i + 1;
        if (child + 1 < size && heap[child + 1] < heap[child]) child++;
        if (heap[i] <= heap[child]) break;
        swap(i, child);
        i = child;
    }
    return answer;
}
int main(void) {
    int q;
    if (scanf("%d", &q) != 1) return 0;
    for (int i = 0; i < q; i++) {
        int type;
        scanf("%d", &type);
        if (type == 1) {
            int key;
            scanf("%d", &key);
            push(key);
        } else if (size) printf("%d\\n", pop());
        else puts("EMPTY");
    }
    return 0;
}`,
      python: `from heapq import heappop, heappush
heap = []
for _ in range(int(input())):
    operation = input().split()
    if operation[0] == "1":
        heappush(heap, int(operation[1]))
    else:
        print(heappop(heap) if heap else "EMPTY")`,
      java: `import java.util.PriorityQueue;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        var heap = new PriorityQueue<Integer>();
        int q = in.nextInt();
        for (int i = 0; i < q; i++) {
            if (in.nextInt() == 1) heap.add(in.nextInt());
            else {
                Integer minimum = heap.poll();
                System.out.println(minimum == null ? "EMPTY" : String.valueOf(minimum));
            }
        }
    }
}`,
    },
  }
]);
