import { defineTopics } from "./define.ts";

export const interviewCache = defineTopics([
  {
    "id": "interview-lru-cache",
    "stage": 14,
    "minutes": 30,
    "title": "Coding mock: LRU cache",
    "objective": "Design an eviction policy, explain constant-time operations, and test the cache contract.",
    "prerequisites": "Doubly linked lists, maps, and basic data structure invariants.",
    "analogy": "Keep returned library books at the front of a cart. If it fills, remove the book that has gone longest without being handled.",
    "explanation": "Clarify that successful reads and updates both refresh recency, and that capacity counts distinct keys. Store values by key. Keep recent keys in a doubly linked list ordered from newest to oldest. Touching a key detaches its node and reattaches it at the front. To make room, evict from the back. The C example uses a fixed key universe for direct lookup. Python OrderedDict and Java’s access-ordered LinkedHashMap combine keyed lookup and recency order.",
    "invariant": "Each stored key appears exactly once in the recency list and can be looked up directly. The head is the most recently accessed key and the tail is the least recent. Moving a sole node to the front preserves the ordering of every other key.",
    "pseudocode": "get(key): if absent, print MISS; otherwise move to front and print value\nput(key,value):\n  if key present: replace value and move to front\n  otherwise evict the tail if at capacity, then insert key at front",
    "time": "O(1) per operation using the fixed key range, and expected O(1) per operation with generic hash maps",
    "space": "O(K) for the direct table with K possible keys, or O(capacity) for a dynamic map and list",
    "trace": [
      [
        "Capacity 2. Put 1→10 then 2→20",
        "The newest-first order is [2,1]."
      ],
      [
        "Get 1 → 10",
        "Refresh key 1. The order becomes [1,2]."
      ],
      [
        "Put 3→30",
        "Evict key 2 to make room. The order becomes [3,1]."
      ],
      [
        "Get 2 → MISS",
        "Key 2 is absent. A failed lookup does not affect order."
      ]
    ],
    "misconception": "Evicting in insertion order ignores reads and updates and implements a different policy.",
    "debug": "Use capacity one, overwrite an existing key, and confirm that the overwrite does not evict the key or consume another slot.",
    "fill": "Which end of the recency list supplies the next eviction?",
    "edgeCases": [
      "Failed GET operations do not change recency.",
      "Overwriting an existing key keeps the cache size fixed.",
      "Values may be negative, so MISS is a separate output.",
      "A capacity-one cache still honors every update."
    ],
    "revision": "Explain why a doubly linked list can detach any known node in constant time.",
    "further": "Allow arbitrary keys in the C solution using a hash table that maps keys to linked-list nodes.",
    "quiz": {
      "question": "After PUT 1, PUT 2, GET 1, and PUT 3 in a cache of capacity two, which key is removed?",
      "answers": [
        "1",
        "2",
        "3"
      ],
      "correct": 1,
      "feedback": "GET 1 refreshed key 1. Key 2 was the least recently used when key 3 arrived."
    },
    "practice": {
      "title": "Build the rehearsal cache",
      "description": "Implement least-recently-used eviction for a bounded key-value cache.",
      "format": "Read capacity and q. Each of the q lines is PUT key value or GET key. Print the value or MISS for each GET. Successful accesses and updates refresh recency.",
      "constraints": "1 ≤ capacity ≤ 256, 0 ≤ q ≤ 400, 0 ≤ key ≤ 255, and |value| ≤ 10⁶.",
      "input": "2 5\nPUT 1 10\nPUT 2 20\nGET 1\nPUT 3 30\nGET 2\n",
      "output": "10\nMISS\n",
      "hints": [
        "A new key evicts only when the cache is already full.",
        "Keep the recency order separate from the stored values."
      ]
    },
    code: {
      c: `#include <stdio.h>
#define SENTINEL 256
static int next[257], previous[257], values[256], present[256];
static void detach(int key) {
    next[previous[key]] = next[key];
    previous[next[key]] = previous[key];
}
static void insert_front(int key) {
    int first = next[SENTINEL];
    next[SENTINEL] = key;
    previous[key] = SENTINEL;
    next[key] = first;
    previous[first] = key;
}
int main(void) {
    int capacity, q, size = 0;
    if (scanf("%d%d", &capacity, &q) != 2) return 0;
    next[SENTINEL] = previous[SENTINEL] = SENTINEL;
    for (int i = 0; i < q; i++) {
        char operation[4];
        int key;
        scanf("%3s%d", operation, &key);
        if (operation[0] == 'G') {
            if (!present[key]) { puts("MISS"); continue; }
            printf("%d\\n", values[key]);
            detach(key);
        } else {
            scanf("%d", &values[key]);
            if (present[key]) detach(key);
            else if (size == capacity) {
                int oldest = previous[SENTINEL];
                detach(oldest);
                present[oldest] = 0;
            } else size++;
            present[key] = 1;
        }
        insert_front(key);
    }
    return 0;
}`,
      python: `from collections import OrderedDict
capacity, q = map(int, input().split())
cache = OrderedDict()
for _ in range(q):
    operation, key, *argument = input().split()
    key = int(key)
    if operation == "GET":
        if key not in cache:
            print("MISS")
            continue
        print(cache[key])
    else:
        cache[key] = int(argument[0])
    cache.move_to_end(key)
    if len(cache) > capacity:
        cache.popitem(last=False)`,
      java: `import java.util.LinkedHashMap;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int capacity = in.nextInt(), q = in.nextInt();
        var cache = new LinkedHashMap<Integer, Integer>(16, 0.75f, true);
        for (int i = 0; i < q; i++) {
            String operation = in.next();
            int key = in.nextInt();
            if (operation.equals("GET")) {
                Integer value = cache.get(key);
                System.out.println(value == null ? "MISS" : String.valueOf(value));
            } else {
                cache.put(key, in.nextInt());
                if (cache.size() > capacity) cache.remove(cache.keySet().iterator().next());
            }
        }
    }
}`,
    },
  }
]);
