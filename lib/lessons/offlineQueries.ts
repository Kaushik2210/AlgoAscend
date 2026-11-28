import { defineTopics } from "./define.ts";

export const offlineQueries = defineTopics([
  {
    "id": "mos-algorithm",
    "stage": 11,
    "title": "Mo’s algorithm and offline query ordering",
    "objective": "Reorder static range queries so an incrementally maintained window can answer them efficiently.",
    "prerequisites": "Square-root decomposition, frequency counts, and interval endpoints.",
    "analogy": "Group inspection jobs by where they start. Within each group, sweep the other endpoint so the inspection crew travels fewer steps.",
    "explanation": "Read all queries before answering. Group left endpoints into blocks of roughly √n positions. Process those blocks in order, sorting right endpoints within each block. Alternating the right-end ordering reduces typical travel. Move both ends of one maintained window and keep exact value frequencies. Save each answer using its original query ID.",
    "invariant": "After every window move, frequency[x] equals the number of occurrences of x in the current inclusive range. The distinct count changes exactly when a frequency crosses zero.",
    "pseudocode": "sort queries by left block and then right endpoint\nstart with an empty interval\nfor each sorted query:\n  expand then shrink the interval until both endpoints match\n  update the frequency at every boundary move\n  store the distinct count under the original query index",
    "time": "O(q log(q+1) + (n+q)√n) for n values and q queries",
    "space": "O(n+q+U) for the input, queries, answers and frequency table over U possible values",
    "trace": [
      [
        "Values [4,1,4,2,1]",
        "Queries arrive as [2,4], [0,2], [1,3]. Keep their original IDs."
      ],
      [
        "Process [0,2] first",
        "Frequencies of 4 and 1 are positive. Save answer 2 for the second query."
      ],
      [
        "Move to [1,3]",
        "Drop index 0 and add index 3. Values 1, 4 and 2 yield 3."
      ],
      [
        "Move to [2,4]",
        "Drop one 1 and add a later 1. Output by original ID as 3, 2, 3."
      ]
    ],
    "misconception": "Printing answers in processing order changes their association with input queries.",
    "debug": "Test repeated values crossing both sides of the moving window and input queries in reverse block order.",
    "fill": "When does removing one value decrease the distinct count?",
    "edgeCases": [
      "Repeated or single-position queries are valid.",
      "A zero-query input produces no lines.",
      "Reordering assumes the array is static and future queries are known."
    ],
    "revision": "What property of an aggregate makes it suitable for a moving offline window?",
    "further": "Coordinate-compress arbitrary values before maintaining their frequencies.",
    "quiz": {
      "question": "Why keep the original index of each query?",
      "answers": [
        "To reconstruct output order after sorting",
        "To avoid building frequencies",
        "To find the block width"
      ],
      "correct": 0,
      "feedback": "The processing order was chosen to minimize movement. The original ID restores the user’s query order."
    },
    "practice": {
      "title": "Count distinct samples in archived ranges",
      "description": "Answer distinct-value counts for static inclusive ranges in input order.",
      "format": "Read n q, then n values and q lines left right. Print the distinct count for each query in input order.",
      "constraints": "1 ≤ n ≤ 400, 0 ≤ q ≤ 400, 0 ≤ value ≤ 1000, and 0 ≤ left ≤ right < n.",
      "input": "5 3\n4 1 4 2 1\n2 4\n0 2\n1 3\n",
      "output": "3\n2\n3\n",
      "hints": [
        "Use around √n positions per left-end block.",
        "Keep frequencies correct as the interval expands or contracts."
      ]
    },
    code: {
      c: `#include <stdio.h>
#include <stdlib.h>
typedef struct { int left, right, id; } Query;
static int width = 1, values[400], freq[1001], distinct;
static int compare(const void *a, const void *b) {
    const Query *x = a, *y = b;
    int xb = x->left / width, yb = y->left / width;
    if (xb != yb) return xb - yb;
    return xb % 2 ? y->right - x->right : x->right - y->right;
}
static void add(int i) {
    if (freq[values[i]]++ == 0) distinct++;
}
static void remove_value(int i) {
    if (--freq[values[i]] == 0) distinct--;
}
int main(void) {
    int n, q, answer[400], left = 0, right = -1;
    Query queries[400];
    if (scanf("%d%d", &n, &q) != 2) return 0;
    while (width * width < n) width++;
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    for (int i = 0; i < q; i++) {
        scanf("%d%d", &queries[i].left, &queries[i].right);
        queries[i].id = i;
    }
    qsort(queries, (size_t)q, sizeof(Query), compare);
    for (int i = 0; i < q; i++) {
        Query query = queries[i];
        while (left > query.left) add(--left);
        while (right < query.right) add(++right);
        while (left < query.left) remove_value(left++);
        while (right > query.right) remove_value(right--);
        answer[query.id] = distinct;
    }
    for (int i = 0; i < q; i++) printf("%d\\n", answer[i]);
    return 0;
}`,
      python: `from math import isqrt
n, q = map(int, input().split())
values = list(map(int, input().split()))
width = isqrt(n - 1) + 1
queries = [(*map(int, input().split()), i) for i in range(q)]
queries.sort(key=lambda query: (query[0] // width, query[1] if (query[0] // width) % 2 == 0 else -query[1]))
freq, answer = [0] * 1001, [0] * q
distinct = 0

def move(index, delta):
    global distinct
    value = values[index]
    distinct -= freq[value] > 0
    freq[value] += delta
    distinct += freq[value] > 0

left, right = 0, -1
for lo, hi, index in queries:
    while left > lo:
        left -= 1
        move(left, 1)
    while right < hi:
        right += 1
        move(right, 1)
    while left < lo:
        move(left, -1)
        left += 1
    while right > hi:
        move(right, -1)
        right -= 1
    answer[index] = distinct
for count in answer:
    print(count)`,
      java: `import java.util.Arrays;
import java.util.Scanner;
class Main {
    record Query(int left, int right, int id) {}
    static int[] values, freq = new int[1001];
    static int distinct;
    static void move(int index, int delta) {
        int value = values[index];
        if (freq[value] > 0) distinct--;
        freq[value] += delta;
        if (freq[value] > 0) distinct++;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), q = in.nextInt(), block = 1;
        while (block * block < n) block++;
        final int width = block;
        values = new int[n];
        for (int i = 0; i < n; i++) values[i] = in.nextInt();
        Query[] queries = new Query[q];
        for (int i = 0; i < q; i++) queries[i] = new Query(in.nextInt(), in.nextInt(), i);
        Arrays.sort(queries, (x, y) -> {
            int xb = x.left() / width, yb = y.left() / width;
            if (xb != yb) return Integer.compare(xb, yb);
            return xb % 2 == 0 ? Integer.compare(x.right(), y.right()) : Integer.compare(y.right(), x.right());
        });
        int[] answer = new int[q];
        int left = 0, right = -1;
        for (Query query : queries) {
            while (left > query.left()) move(--left, 1);
            while (right < query.right()) move(++right, 1);
            while (left < query.left()) move(left++, -1);
            while (right > query.right()) move(right--, -1);
            answer[query.id()] = distinct;
        }
        for (int count : answer) System.out.println(count);
    }
}`,
    },
  }
]);
