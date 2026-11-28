// Supplementary judge fixtures, imported only by the server and tests.
export const lessonCases: Record<string, {stdin: string; expected: string}[]> = {
  "binary-representation-practice": [
    {
      "stdin": "00000\n",
      "expected": "0\n"
    },
    {
      "stdin": "111111111111111111111111111111\n",
      "expected": "1073741823\n"
    }
  ],
  "conditionals-and-functions-practice": [
    {
      "stdin": "-9 -3 4\n",
      "expected": "-3\n"
    },
    {
      "stdin": "7 2 7\n",
      "expected": "7\n"
    },
    {
      "stdin": "-3 -1 -1\n",
      "expected": "-1\n"
    }
  ],
  "recursion-and-growth-practice": [
    {
      "stdin": "0\n",
      "expected": "1\n"
    },
    {
      "stdin": "1000000000\n",
      "expected": "10\n"
    }
  ],
  "stacks-and-brackets-practice": [
    {
      "stdin": "([)]\n",
      "expected": "NO\n"
    },
    {
      "stdin": "]\n",
      "expected": "NO\n"
    },
    {
      "stdin": "((\n",
      "expected": "NO\n"
    }
  ],
  "prefix-sums-practice": [
    {
      "stdin": "1 1\n-9\n1 1\n",
      "expected": "-9\n"
    },
    {
      "stdin": "3 1\n1000000000 1000000000 1000000000\n1 3\n",
      "expected": "3000000000\n"
    }
  ],
  "binary-tree-traversal-practice": [
    {
      "stdin": "1\n7\n",
      "expected": "7\n"
    },
    {
      "stdin": "7\n1 0 2 0 0 3 4\n",
      "expected": "1 2 3 4\n"
    }
  ],
  "breadth-first-search-practice": [
    {
      "stdin": "4 1 1 4\n1 2\n",
      "expected": "-1\n"
    },
    {
      "stdin": "1 0 1 1\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 3 1 3\n1 2\n1 2\n2 3\n",
      "expected": "2\n"
    }
  ],
  "subset-backtracking-practice": [
    {
      "stdin": "0 0\n",
      "expected": "1\n"
    },
    {
      "stdin": "3 0\n1 -1 0\n",
      "expected": "4\n"
    },
    {
      "stdin": "3 4\n2 2 2\n",
      "expected": "3\n"
    }
  ],
  "interval-scheduling-practice": [
    {
      "stdin": "0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3\n1 4\n2 4\n4 5\n",
      "expected": "2\n"
    },
    {
      "stdin": "2\n0 3\n3 4\n",
      "expected": "2\n"
    }
  ],
  "coin-change-dp-practice": [
    {
      "stdin": "2 3\n2 4\n",
      "expected": "-1\n"
    },
    {
      "stdin": "1 0\n7\n",
      "expected": "0\n"
    },
    {
      "stdin": "1 6\n2\n",
      "expected": "3\n"
    }
  ],
  "euclidean-algorithm-practice": [
    {
      "stdin": "0 9\n",
      "expected": "9\n"
    },
    {
      "stdin": "0 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "35 12\n",
      "expected": "1\n"
    }
  ],
  "fenwick-trees-practice": [
    {
      "stdin": "1 3\n2 1 1\n1 1 -3\n2 1 1\n",
      "expected": "0\n-3\n"
    },
    {
      "stdin": "2 4\n1 1 1000000000\n1 1 1000000000\n1 2 1000000000\n2 1 2\n",
      "expected": "3000000000\n"
    }
  ],
  "kmp-string-matching-practice": [
    {
      "stdin": "aaaa\naa\n",
      "expected": "3\n"
    },
    {
      "stdin": "ab\nabcd\n",
      "expected": "0\n"
    },
    {
      "stdin": "xxyxx\nx\n",
      "expected": "4\n"
    }
  ],
  "xor-bitmasks-practice": [
    {
      "stdin": "0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3\n29 29 29\n",
      "expected": "536870912\n"
    },
    {
      "stdin": "2\n7 7\n",
      "expected": "0\n"
    }
  ],
  "interview-two-pointers-practice": [
    {
      "stdin": "1 10\n5\n",
      "expected": "NO\n"
    },
    {
      "stdin": "2 10\n5 5\n",
      "expected": "YES\n"
    },
    {
      "stdin": "0 0\n",
      "expected": "NO\n"
    },
    {
      "stdin": "3 -7\n-4 -3 0\n",
      "expected": "YES\n"
    }
  ],
  "fixed-sliding-window-practice": [
    {
      "stdin": "3 2\n-4 -1 -6\n",
      "expected": "-5\n"
    },
    {
      "stdin": "1 1\n-8\n",
      "expected": "-8\n"
    },
    {
      "stdin": "4 4\n2 -4 6 1\n",
      "expected": "5\n"
    }
  ],
  "difference-arrays-practice": [
    {
      "stdin": "3 0\n",
      "expected": "0 0 0\n"
    },
    {
      "stdin": "1 3\n0 0 7\n0 0 -9\n0 0 1\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4 1\n2 2 9\n",
      "expected": "0 0 9 0\n"
    }
  ],
  "disjoint-set-union-practice": [
    {
      "stdin": "1 2\n2 0 0\n1 0 0\n",
      "expected": "YES\n"
    },
    {
      "stdin": "3 5\n2 0 2\n1 0 1\n1 1 0\n2 1 2\n2 1 0\n",
      "expected": "NO\nNO\nYES\n"
    },
    {
      "stdin": "3 0\n",
      "expected": ""
    }
  ],
  "longest-common-subsequence-practice": [
    {
      "stdin": "axbyc abc\n",
      "expected": "3\n"
    },
    {
      "stdin": "abc xyz\n",
      "expected": "0\n"
    },
    {
      "stdin": "aba baa\n",
      "expected": "2\n"
    },
    {
      "stdin": "abc abc\n",
      "expected": "3\n"
    }
  ],
  "modular-exponentiation-practice": [
    {
      "stdin": "0 0 7\n",
      "expected": "1\n"
    },
    {
      "stdin": "8 0 1\n",
      "expected": "0\n"
    },
    {
      "stdin": "999999999 2 1000000000\n",
      "expected": "1\n"
    },
    {
      "stdin": "2 1000000000000000000 7\n",
      "expected": "2\n"
    }
  ],
  "sieve-of-eratosthenes-practice": [
    {
      "stdin": "0\n",
      "expected": "0\n"
    },
    {
      "stdin": "2\n",
      "expected": "1\n"
    },
    {
      "stdin": "49\n",
      "expected": "15\n"
    },
    {
      "stdin": "100000\n",
      "expected": "9592\n"
    }
  ],
  "circular-queues-practice": [
    {
      "stdin": "1 5\n2\n1 -8\n1 0\n2\n2\n",
      "expected": "EMPTY\nFULL\n-8\nEMPTY\n"
    },
    {
      "stdin": "3 6\n1 8\n2\n1 3\n1 2\n2\n2\n",
      "expected": "8\n3\n2\n"
    },
    {
      "stdin": "1 0\n",
      "expected": ""
    }
  ],
  "dijkstra-shortest-path-practice": [
    {
      "stdin": "3 1 0 2\n0 1 0\n",
      "expected": "-1\n"
    },
    {
      "stdin": "2 2 0 1\n0 1 0\n0 1 7\n",
      "expected": "0\n"
    },
    {
      "stdin": "1 0 0 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 3 0 2\n0 2 8\n0 1 1\n1 2 4\n",
      "expected": "5\n"
    }
  ],
  "segment-tree-range-minimum-practice": [
    {
      "stdin": "1 4\n5\n2 0 0\n1 0 -7\n2 0 0\n1 0 8\n",
      "expected": "5\n-7\n"
    },
    {
      "stdin": "3 3\n4 9 6\n2 0 2\n1 2 2\n2 1 2\n",
      "expected": "4\n2\n"
    },
    {
      "stdin": "4 3\n4 4 4 4\n1 3 -8\n2 0 2\n2 0 3\n",
      "expected": "4\n-8\n"
    }
  ],
  "problem-decomposition-practice": [
    {
      "stdin": "0 8\n",
      "expected": "0\n"
    },
    {
      "stdin": "4 -3\n-4 -3 -2 0\n",
      "expected": "3\n"
    },
    {
      "stdin": "3 8\n1 2 3\n",
      "expected": "0\n"
    }
  ],
  "nested-loops-practice": [
    {
      "stdin": "1 1\n0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 1\n-6\n0\n8\n",
      "expected": "1\n"
    },
    {
      "stdin": "2 2\n-1 -5\n-6 -2\n",
      "expected": "0\n"
    }
  ],
  "integer-types-and-division-practice": [
    {
      "stdin": "0 10\n",
      "expected": "0 0\n"
    },
    {
      "stdin": "5 7\n",
      "expected": "0 5\n"
    },
    {
      "stdin": "1000000000000000000 10\n",
      "expected": "100000000000000000 0\n"
    },
    {
      "stdin": "9007199254740993 2\n",
      "expected": "4503599627370496 1\n"
    }
  ],
  "program-execution-practice": [
    {
      "stdin": "0\n",
      "expected": "0\n"
    },
    {
      "stdin": "4\nADD 9\nSET -2\nMUL -3\nADD 1\n",
      "expected": "7\n"
    },
    {
      "stdin": "2\nMUL 5\nADD 2\n",
      "expected": "2\n"
    }
  ],
  "flowchart-decisions-practice": [
    {
      "stdin": "1 20\n",
      "expected": "EXPRESS\n"
    },
    {
      "stdin": "0 11\n",
      "expected": "FREIGHT\n"
    },
    {
      "stdin": "0 0\n",
      "expected": "STANDARD\n"
    }
  ],
  "variable-scope-practice": [
    {
      "stdin": "0 10\n\n",
      "expected": "0\n"
    },
    {
      "stdin": "4 -1\n-1 -2 0 -1\n",
      "expected": "3\n"
    },
    {
      "stdin": "2 3\n1 2\n",
      "expected": "0\n"
    }
  ],
  "amortized-array-growth-practice": [
    {
      "stdin": "0\n",
      "expected": "1 0\n"
    },
    {
      "stdin": "4\n",
      "expected": "4 3\n"
    },
    {
      "stdin": "5\n",
      "expected": "8 7\n"
    },
    {
      "stdin": "100000\n",
      "expected": "131072 131071\n"
    }
  ],
  "asymptotic-bounds-practice": [
    {
      "stdin": "0 0\n",
      "expected": "FITS\n"
    },
    {
      "stdin": "4 6\n",
      "expected": "FITS\n"
    },
    {
      "stdin": "1000000000 499999999499999999\n",
      "expected": "EXCEEDS\n"
    },
    {
      "stdin": "1000000000 499999999500000000\n",
      "expected": "FITS\n"
    }
  ],
  "loop-invariants-practice": [
    {
      "stdin": "0\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4\n1 1 1 1\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4\n1 1 0 -1\n",
      "expected": "2\n"
    },
    {
      "stdin": "2\n0 -1\n",
      "expected": "1\n"
    }
  ],
  "singly-linked-lists-practice": [
    {
      "stdin": "0\n",
      "expected": "\n"
    },
    {
      "stdin": "1\n-7\n",
      "expected": "-7\n"
    },
    {
      "stdin": "5\n1 2 2 -4 9\n",
      "expected": "9 -4 2 2 1\n"
    }
  ],
  "linear-search-practice": [
    {
      "stdin": "0 7\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4 0\n0 3 0 1\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 2\n1 3 7\n",
      "expected": "-1\n"
    }
  ],
  "binary-search-on-answer-practice": [
    {
      "stdin": "3 1\n2 3 5\n",
      "expected": "10\n"
    },
    {
      "stdin": "3 3\n2 3 5\n",
      "expected": "5\n"
    },
    {
      "stdin": "5 3\n5 1 1 1 5\n",
      "expected": "5\n"
    }
  ],
  "variable-sliding-window-practice": [
    {
      "stdin": "3 7\n0 0 7\n",
      "expected": "1\n"
    },
    {
      "stdin": "4 12\n1 0 2 3\n",
      "expected": "0\n"
    },
    {
      "stdin": "0 1\n",
      "expected": "0\n"
    },
    {
      "stdin": "4 10\n2 3 1 4\n",
      "expected": "4\n"
    }
  ],
  "suffix-sums-practice": [
    {
      "stdin": "0 2\n0 0\n",
      "expected": "0\n0\n"
    },
    {
      "stdin": "4 3\n2 -9 4 -3\n2 0 1\n",
      "expected": "1\n-6\n-8\n"
    },
    {
      "stdin": "2 0\n5 6\n",
      "expected": ""
    }
  ],
  "dfs-connected-components-practice": [
    {
      "stdin": "4 0\n",
      "expected": "4\n"
    },
    {
      "stdin": "3 4\n0 0\n0 1\n0 1\n1 2\n",
      "expected": "1\n"
    },
    {
      "stdin": "1 0\n",
      "expected": "1\n"
    }
  ],
  "topological-sorting-practice": [
    {
      "stdin": "3 2\n1 2\n2 1\n",
      "expected": "CYCLE\n"
    },
    {
      "stdin": "3 3\n1 0\n1 0\n1 2\n",
      "expected": "1 0 2\n"
    },
    {
      "stdin": "1 1\n0 0\n",
      "expected": "CYCLE\n"
    },
    {
      "stdin": "3 0\n",
      "expected": "0 1 2\n"
    }
  ],
  "binary-search-trees-practice": [
    {
      "stdin": "0 2\n-1 0\n",
      "expected": "NO\nNO\n"
    },
    {
      "stdin": "4 3\n3 3 3 2\n3 2 4\n",
      "expected": "YES\nYES\nNO\n"
    },
    {
      "stdin": "4 3\n-4 -3 -2 -1\n-1 -5 -4\n",
      "expected": "YES\nNO\nYES\n"
    }
  ],
  "grid-path-dp-practice": [
    {
      "stdin": "1 1\n.\n",
      "expected": "1\n"
    },
    {
      "stdin": "1 1\n#\n",
      "expected": "0\n"
    },
    {
      "stdin": "2 2\n.#\n#.\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 3\n...\n...\n...\n",
      "expected": "6\n"
    }
  ],
  "zero-one-knapsack-practice": [
    {
      "stdin": "1 4\n2 3\n",
      "expected": "3\n"
    },
    {
      "stdin": "2 0\n1 3\n2 4\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 5\n4 7\n3 6\n2 5\n",
      "expected": "11\n"
    },
    {
      "stdin": "0 20\n",
      "expected": "0\n"
    }
  ],
  "edit-distance-practice": [
    {
      "stdin": "\nabc\n",
      "expected": "3\n"
    },
    {
      "stdin": "abc\n\n",
      "expected": "3\n"
    },
    {
      "stdin": "\n\n",
      "expected": "0\n"
    },
    {
      "stdin": "ab\nba\n",
      "expected": "2\n"
    },
    {
      "stdin": "kitten\nsitting\n",
      "expected": "3\n"
    }
  ],
  "z-algorithm-practice": [
    {
      "stdin": "a\n",
      "expected": "0\n"
    },
    {
      "stdin": "aaaaa\n",
      "expected": "0 4 3 2 1\n"
    },
    {
      "stdin": "abcde\n",
      "expected": "0 0 0 0 0\n"
    },
    {
      "stdin": "aabxaabxcaabxaabxay\n",
      "expected": "0 1 0 0 4 1 0 0 0 8 1 0 0 5 1 0 0 1 0\n"
    }
  ],
  "fractional-knapsack-practice": [
    {
      "stdin": "2 5\n5 10\n2 9\n",
      "expected": "15\n"
    },
    {
      "stdin": "1 1\n3 5\n",
      "expected": "1\n"
    },
    {
      "stdin": "2 0\n2 9\n1 5\n",
      "expected": "0\n"
    },
    {
      "stdin": "2 500000\n1000000 999999\n1000000 1000000\n",
      "expected": "500000\n"
    }
  ],
  "bipartite-graphs-practice": [
    {
      "stdin": "4 4\n0 1\n1 2\n2 3\n3 0\n",
      "expected": "YES\n"
    },
    {
      "stdin": "4 3\n1 2\n2 3\n1 3\n",
      "expected": "NO\n"
    },
    {
      "stdin": "2 1\n1 1\n",
      "expected": "NO\n"
    },
    {
      "stdin": "3 0\n",
      "expected": "YES\n"
    }
  ],
  "records-and-objects-practice": [
    {
      "stdin": "0 0 3\n0 -1 1\n",
      "expected": "0\n0\n0\n"
    },
    {
      "stdin": "10 1 3\n9 -10 -1\n",
      "expected": "10\n0\n0\n"
    },
    {
      "stdin": "5 5 0\n",
      "expected": ""
    }
  ],
  "matrix-indexing-practice": [
    {
      "stdin": "1 3\n-1 0 2\n",
      "expected": "-1\n0\n2\n"
    },
    {
      "stdin": "3 1\n5\n0\n-3\n",
      "expected": "5 0 -3\n"
    },
    {
      "stdin": "1 1\n7\n",
      "expected": "7\n"
    }
  ],
  "frequency-maps-practice": [
    {
      "stdin": "0 3\n0 -1 5\n",
      "expected": "0\n0\n0\n"
    },
    {
      "stdin": "6 5\n-1 1020 -1 2041 1020 1020\n-1 1020 2041 -1022 0\n",
      "expected": "2\n3\n1\n0\n0\n"
    },
    {
      "stdin": "1 0\n4\n",
      "expected": ""
    }
  ],
  "safe-integer-conversion-practice": [
    {
      "stdin": "4\n+\n-\n0\n-0\n",
      "expected": "INVALID\nINVALID\n0\n0\n"
    },
    {
      "stdin": "4\n9999999999\n0000000007\n1_0\n+999\n",
      "expected": "INVALID\n7\nINVALID\n999\n"
    },
    {
      "stdin": "3\n-1000\n12.3\n--4\n",
      "expected": "INVALID\nINVALID\nINVALID\n"
    },
    {
      "stdin": "0\n",
      "expected": ""
    }
  ],
  "dynamic-storage-practice": [
    {
      "stdin": "0 100\n",
      "expected": "\n"
    },
    {
      "stdin": "1 1000000000\n-8\n",
      "expected": "-8\n"
    },
    {
      "stdin": "3 6\n-1 0 5\n",
      "expected": "-1 0 5\n"
    },
    {
      "stdin": "3 2\n7 8 9\n",
      "expected": "9 7 8\n"
    }
  ],
  "distinct-permutations-practice": [
    {
      "stdin": "a\n",
      "expected": "1\n"
    },
    {
      "stdin": "aaa\n",
      "expected": "0\n"
    },
    {
      "stdin": "abc\n",
      "expected": "6\n"
    },
    {
      "stdin": "aabb\n",
      "expected": "2\n"
    },
    {
      "stdin": "abcdefgh\n",
      "expected": "40320\n"
    }
  ],
  "n-queens-practice": [
    {
      "stdin": "1\n",
      "expected": "1\n"
    },
    {
      "stdin": "2\n",
      "expected": "0\n"
    },
    {
      "stdin": "3\n",
      "expected": "0\n"
    },
    {
      "stdin": "8\n",
      "expected": "92\n"
    },
    {
      "stdin": "9\n",
      "expected": "352\n"
    }
  ],
  "counting-combinations-practice": [
    {
      "stdin": "0 0\n",
      "expected": "1\n"
    },
    {
      "stdin": "2 3\n",
      "expected": "0\n"
    },
    {
      "stdin": "60 30\n",
      "expected": "118264581564861424\n"
    },
    {
      "stdin": "8 8\n",
      "expected": "1\n"
    }
  ],
  "prime-factorization-practice": [
    {
      "stdin": "1\n",
      "expected": "NONE\n"
    },
    {
      "stdin": "999983\n",
      "expected": "999983\n"
    },
    {
      "stdin": "49\n",
      "expected": "7 7\n"
    },
    {
      "stdin": "64\n",
      "expected": "2 2 2 2 2 2\n"
    },
    {
      "stdin": "1000000000\n",
      "expected": "2 2 2 2 2 2 2 2 2 5 5 5 5 5 5 5 5 5\n"
    }
  ],
  "binary-heaps-practice": [
    {
      "stdin": "0\n",
      "expected": ""
    },
    {
      "stdin": "8\n2\n1 -2\n1 5\n1 -2\n2\n2\n2\n2\n",
      "expected": "EMPTY\n-2\n-2\n5\nEMPTY\n"
    },
    {
      "stdin": "9\n1 4\n1 1\n1 3\n1 2\n2\n1 0\n2\n2\n2\n",
      "expected": "1\n0\n2\n3\n"
    }
  ],
  "merge-intervals-practice": [
    {
      "stdin": "0\n",
      "expected": ""
    },
    {
      "stdin": "3\n0 10\n2 3\n10 12\n",
      "expected": "0 12\n"
    },
    {
      "stdin": "3\n0 2\n3 4\n-4 -4\n",
      "expected": "-4 -4\n0 2\n3 4\n"
    },
    {
      "stdin": "3\n1 1\n1 4\n1 2\n",
      "expected": "1 4\n"
    }
  ],
  "monotonic-stacks-practice": [
    {
      "stdin": "0\n",
      "expected": "\n"
    },
    {
      "stdin": "3\n2 2 2\n",
      "expected": "-1 -1 -1\n"
    },
    {
      "stdin": "4\n-4 -1 -3 0\n",
      "expected": "1 3 3 -1\n"
    },
    {
      "stdin": "4\n9 8 7 6\n",
      "expected": "-1 -1 -1 -1\n"
    }
  ],
  "monotonic-deques-practice": [
    {
      "stdin": "4 1\n-4 -1 3 3\n",
      "expected": "-4 -1 3 3\n"
    },
    {
      "stdin": "5 3\n9 7 5 3 1\n",
      "expected": "9 7 5\n"
    },
    {
      "stdin": "5 3\n2 2 2 1 0\n",
      "expected": "2 2 2\n"
    },
    {
      "stdin": "4 4\n0 -3 1 -2\n",
      "expected": "1\n"
    }
  ],
  "coordinate-compression-practice": [
    {
      "stdin": "0\n",
      "expected": "\n"
    },
    {
      "stdin": "3\n6 6 6\n",
      "expected": "0 0 0\n"
    },
    {
      "stdin": "5\n-1000000000 1000000000 0 -1000000000 -1\n",
      "expected": "0 3 2 0 1\n"
    },
    {
      "stdin": "4\n4 3 2 1\n",
      "expected": "3 2 1 0\n"
    }
  ],
  "sparse-tables-practice": [
    {
      "stdin": "1 2\n-7\n0 0\n0 0\n",
      "expected": "-7\n-7\n"
    },
    {
      "stdin": "6 4\n6 -2 7 7 -9 20\n0 3\n1 5\n3 4\n5 5\n",
      "expected": "-2\n-9\n-9\n20\n"
    },
    {
      "stdin": "2 0\n7 8\n",
      "expected": ""
    }
  ],
  "rabin-karp-practice": [
    {
      "stdin": "a abc\n",
      "expected": "0\n"
    },
    {
      "stdin": "aaaaa aaa\n",
      "expected": "3\n"
    },
    {
      "stdin": "abc a\n",
      "expected": "1\n"
    },
    {
      "stdin": "zzzzzzzzabacaba abacaba\n",
      "expected": "1\n"
    },
    {
      "stdin": "abcdefgh xyz\n",
      "expected": "0\n"
    },
    {
      "stdin": "bridkylv ihsdzzlg\n",
      "expected": "0\n"
    }
  ],
  "longest-increasing-subsequence-practice": [
    {
      "stdin": "0\n",
      "expected": "0\n"
    },
    {
      "stdin": "4\n2 2 2 2\n",
      "expected": "1\n"
    },
    {
      "stdin": "6\n-4 -2 -3 0 0 1\n",
      "expected": "4\n"
    },
    {
      "stdin": "5\n5 4 3 2 1\n",
      "expected": "1\n"
    }
  ],
  "fibonacci-memoization-practice": [
    {
      "stdin": "0\n",
      "expected": ""
    },
    {
      "stdin": "3\n0\n1\n2\n",
      "expected": "0\n1\n1\n"
    },
    {
      "stdin": "3\n92\n90\n92\n",
      "expected": "7540113804746346429\n2880067194370816120\n7540113804746346429\n"
    },
    {
      "stdin": "3\n5\n10\n6\n",
      "expected": "5\n55\n8\n"
    }
  ],
  "lowest-common-ancestor-practice": [
    {
      "stdin": "1 2\n0 0\n0 0\n",
      "expected": "0\n0\n"
    },
    {
      "stdin": "7 4\n0 0 1 1 2 2\n3 4\n3 6\n5 6\n3 3\n",
      "expected": "1\n0\n2\n3\n"
    },
    {
      "stdin": "8 3\n0 1 2 3 4 5 6\n7 0\n7 2\n4 7\n",
      "expected": "0\n2\n4\n"
    }
  ],
  "tree-diameter-practice": [
    {
      "stdin": "1\n",
      "expected": "0\n"
    },
    {
      "stdin": "5\n0 1 2 3\n",
      "expected": "4\n"
    },
    {
      "stdin": "4\n0 0 0\n",
      "expected": "2\n"
    },
    {
      "stdin": "8\n0 1 1 2 3 4 5\n",
      "expected": "6\n"
    }
  ],
  "bellman-ford-practice": [
    {
      "stdin": "3 2 0\n1 2 -1\n2 1 -1\n",
      "expected": "0 INF INF\n"
    },
    {
      "stdin": "3 3 0\n0 1 0\n1 2 -1\n2 1 -1\n",
      "expected": "NEGATIVE CYCLE\n"
    },
    {
      "stdin": "1 1 0\n0 0 -1\n",
      "expected": "NEGATIVE CYCLE\n"
    },
    {
      "stdin": "2 0 1\n",
      "expected": "INF 0\n"
    }
  ],
  "floyd-warshall-practice": [
    {
      "stdin": "1 0 1\n0 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 3 3\n0 1 9\n0 1 4\n1 2 -9\n0 2\n1 2\n2 1\n",
      "expected": "-5\n-9\nINF\n"
    },
    {
      "stdin": "4 3 2\n0 3 5\n3 2 5\n2 1 -1\n0 1\n1 0\n",
      "expected": "9\nINF\n"
    }
  ],
  "interview-unique-window-practice": [
    {
      "stdin": "\n",
      "expected": "0\n"
    },
    {
      "stdin": "aaaa\n",
      "expected": "1\n"
    },
    {
      "stdin": "dvdf\n",
      "expected": "3\n"
    },
    {
      "stdin": "abcdefghijklmnopqrstuvwxyz\n",
      "expected": "26\n"
    }
  ],
  "interview-prefix-map-practice": [
    {
      "stdin": "0 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "2 0\n0 0\n",
      "expected": "3\n"
    },
    {
      "stdin": "5 3\n3 1 2 -3 3\n",
      "expected": "5\n"
    },
    {
      "stdin": "4 -1\n-1 0 -1 1\n",
      "expected": "5\n"
    }
  ],
  "interview-cycle-entry-practice": [
    {
      "stdin": "0\n",
      "expected": "-1\n"
    },
    {
      "stdin": "1\n0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3\n1 2 -1\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4\n1 -1 3 2\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4\n1 2 3 0\n",
      "expected": "0\n"
    }
  ],
  "zero-one-bfs-practice": [
    {
      "stdin": "1 0 0 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 1 0 2\n0 1 0\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4 5 0 3\n0 1 1\n1 2 0\n2 1 0\n2 3 1\n0 2 0\n",
      "expected": "1\n"
    },
    {
      "stdin": "2 2 0 1\n0 1 1\n0 1 0\n",
      "expected": "0\n"
    }
  ],
  "kruskal-spanning-tree-practice": [
    {
      "stdin": "1 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 1\n0 1 -2\n",
      "expected": "DISCONNECTED\n"
    },
    {
      "stdin": "3 5\n0 0 -10\n0 1 7\n0 1 -2\n1 2 1\n0 2 10\n",
      "expected": "-1\n"
    },
    {
      "stdin": "4 4\n0 1 5\n1 2 5\n2 3 5\n3 0 5\n",
      "expected": "15\n"
    }
  ],
  "strongly-connected-components-practice": [
    {
      "stdin": "4 3\n0 1\n1 2\n2 3\n",
      "expected": "4\n"
    },
    {
      "stdin": "3 3\n0 1\n1 2\n2 0\n",
      "expected": "1\n"
    },
    {
      "stdin": "5 4\n1 2\n2 1\n3 3\n1 2\n",
      "expected": "4\n"
    },
    {
      "stdin": "1 0\n",
      "expected": "1\n"
    }
  ],
  "bridges-articulation-points-practice": [
    {
      "stdin": "2 2\n0 1\n0 1\n",
      "expected": "0 0\n"
    },
    {
      "stdin": "5 3\n0 1\n0 2\n0 3\n",
      "expected": "3 1\n"
    },
    {
      "stdin": "6 4\n0 1\n1 2\n3 4\n4 4\n",
      "expected": "3 1\n"
    },
    {
      "stdin": "1 0\n",
      "expected": "0 0\n"
    }
  ],
  "prim-spanning-tree-practice": [
    {
      "stdin": "1 1\n0 0 -2\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 1\n1 2 4\n",
      "expected": "DISCONNECTED\n"
    },
    {
      "stdin": "3 4\n0 1 5\n0 1 -4\n0 2 7\n1 2 2\n",
      "expected": "-2\n"
    }
  ],
  "eulerian-trails-practice": [
    {
      "stdin": "5 0\n",
      "expected": "YES\n"
    },
    {
      "stdin": "4 3\n0 1\n0 2\n0 3\n",
      "expected": "NO\n"
    },
    {
      "stdin": "4 2\n0 0\n2 2\n",
      "expected": "NO\n"
    },
    {
      "stdin": "4 3\n0 1\n0 1\n0 0\n",
      "expected": "YES\n"
    }
  ],
  "max-flow-min-cut-practice": [
    {
      "stdin": "2 0 0 1\n",
      "expected": "0 0\n"
    },
    {
      "stdin": "2 4 1 0\n1 0 2\n1 0 3\n0 1 9\n1 1 10\n",
      "expected": "5 5\n"
    },
    {
      "stdin": "6 7 0 5\n0 1 1\n0 2 1\n1 3 1\n1 4 1\n2 3 1\n3 5 1\n4 5 1\n",
      "expected": "2 2\n"
    }
  ],
  "bipartite-matching-practice": [
    {
      "stdin": "0 3 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 1 4\n0 0\n0 0\n1 0\n2 0\n",
      "expected": "1\n"
    },
    {
      "stdin": "3 3 5\n0 0\n0 1\n1 1\n1 2\n2 0\n",
      "expected": "3\n"
    }
  ],
  "graph-representations-practice": [
    {
      "stdin": "1 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "2 3\n0 1\n1 0\n1 1\n",
      "expected": "0 1\n1 1\n"
    },
    {
      "stdin": "3 1\n1 2\n",
      "expected": "0 0 0\n0 0 1\n0 1 0\n"
    }
  ],
  "undirected-cycle-detection-practice": [
    {
      "stdin": "1 0\n",
      "expected": "-1\n"
    },
    {
      "stdin": "1 1\n0 0\n",
      "expected": "0\n"
    },
    {
      "stdin": "4 2\n1 2\n2 1\n",
      "expected": "1\n"
    },
    {
      "stdin": "5 3\n0 1\n2 3\n3 4\n",
      "expected": "-1\n"
    }
  ],
  "interview-grid-bfs-practice": [
    {
      "stdin": "1 1\n#\n",
      "expected": "0\n"
    },
    {
      "stdin": "1 1\n.\n",
      "expected": "-1\n"
    },
    {
      "stdin": "1 3\nS#.\n",
      "expected": "-1\n"
    },
    {
      "stdin": "1 6\nS....S\n",
      "expected": "2\n"
    },
    {
      "stdin": "2 3\nS#.\n...\n",
      "expected": "4\n"
    }
  ],
  "interview-lru-cache-practice": [
    {
      "stdin": "1 6\nGET 0\nPUT 0 -1\nPUT 0 4\nGET 0\nPUT 255 9\nGET 0\n",
      "expected": "MISS\n4\nMISS\n"
    },
    {
      "stdin": "2 6\nPUT 1 4\nPUT 2 5\nPUT 1 6\nPUT 3 7\nGET 2\nGET 1\n",
      "expected": "MISS\n6\n"
    },
    {
      "stdin": "3 0\n",
      "expected": ""
    }
  ],
  "lazy-segment-tree-practice": [
    {
      "stdin": "1 4\n2 0 0\n1 0 0 -7\n1 0 0 4\n2 0 0\n",
      "expected": "0\n-3\n"
    },
    {
      "stdin": "5 5\n1 1 3 4\n1 0 4 2\n2 2 2\n2 0 1\n2 0 4\n",
      "expected": "6\n8\n22\n"
    },
    {
      "stdin": "350 8\n1 0 349 1000000\n1 0 349 1000000\n1 0 349 1000000\n1 0 349 1000000\n1 0 349 1000000\n1 0 349 1000000\n1 0 349 1000000\n2 0 349\n",
      "expected": "2450000000\n"
    }
  ],
  "manacher-palindromes-practice": [
    {
      "stdin": "a\n",
      "expected": "1\n"
    },
    {
      "stdin": "abacdfgdcaba\n",
      "expected": "3\n"
    },
    {
      "stdin": "abcddcbaq\n",
      "expected": "8\n"
    },
    {
      "stdin": "bananas\n",
      "expected": "5\n"
    },
    {
      "stdin": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n",
      "expected": "2000\n"
    }
  ],
  "persistent-segment-tree-practice": [
    {
      "stdin": "1 5\n1 0 0 8\n1 1 0 -9\n2 1 0 0\n2 2 0 0\n2 0 0 0\n",
      "expected": "8\n-9\n0\n"
    },
    {
      "stdin": "5 6\n1 0 0 4\n1 1 4 9\n1 2 0 0\n2 1 0 4\n2 2 0 4\n2 3 1 4\n",
      "expected": "4\n13\n9\n"
    },
    {
      "stdin": "3 1\n2 0 1 2\n",
      "expected": "0\n"
    }
  ],
  "aho-corasick-practice": [
    {
      "stdin": "3\na\naa\naa\naaa\n",
      "expected": "7\n"
    },
    {
      "stdin": "3\nb\nab\nbab\nababab\n",
      "expected": "8\n"
    },
    {
      "stdin": "2\nabc\nbc\nxxyz\n",
      "expected": "0\n"
    },
    {
      "stdin": "1\naba\nababa\n",
      "expected": "2\n"
    }
  ],
  "suffix-array-practice": [
    {
      "stdin": "x\n",
      "expected": "0\n"
    },
    {
      "stdin": "aaaaa\n",
      "expected": "4 3 2 1 0\n"
    },
    {
      "stdin": "zyx\n",
      "expected": "2 1 0\n"
    },
    {
      "stdin": "abab\n",
      "expected": "2 0 3 1\n"
    }
  ],
  "lcp-array-practice": [
    {
      "stdin": "x\n0\n",
      "expected": "0\n"
    },
    {
      "stdin": "aaaaa\n4 3 2 1 0\n",
      "expected": "0 1 2 3 4\n"
    },
    {
      "stdin": "abab\n2 0 3 1\n",
      "expected": "0 2 0 1\n"
    },
    {
      "stdin": "abc\n0 1 2\n",
      "expected": "0 0 0\n"
    }
  ],
  "suffix-automaton-practice": [
    {
      "stdin": "z\n",
      "expected": "1\n"
    },
    {
      "stdin": "aaaaa\n",
      "expected": "5\n"
    },
    {
      "stdin": "abbb\n",
      "expected": "7\n"
    },
    {
      "stdin": "banana\n",
      "expected": "15\n"
    },
    {
      "stdin": "abcab\n",
      "expected": "12\n"
    }
  ],
  "sqrt-decomposition-practice": [
    {
      "stdin": "1 3\n-9\n2 0 0\n1 0 6\n2 0 0\n",
      "expected": "-9\n6\n"
    },
    {
      "stdin": "5 4\n1 2 3 4 5\n2 1 4\n2 0 2\n1 4 -6\n2 3 4\n",
      "expected": "14\n6\n-2\n"
    },
    {
      "stdin": "4 2\n-5 -2 0 9\n2 0 3\n2 2 3\n",
      "expected": "2\n9\n"
    }
  ],
  "mos-algorithm-practice": [
    {
      "stdin": "1 2\n0\n0 0\n0 0\n",
      "expected": "1\n1\n"
    },
    {
      "stdin": "5 5\n1 2 1 3 2\n4 4\n1 4\n2 3\n0 0\n0 4\n",
      "expected": "1\n3\n2\n1\n3\n"
    },
    {
      "stdin": "3 0\n0 1000 0\n",
      "expected": ""
    }
  ],
  "treap-ordered-set-practice": [
    {
      "stdin": "4\nK 1\nD -3\nR 0\nK 0\n",
      "expected": "NONE\n0\nNONE\n"
    },
    {
      "stdin": "10\nI -5\nI 8\nI 0\nI -3\nK 2\nD 0\nR 8\nI 0\nK 3\nK 4\n",
      "expected": "-3\n2\n0\n8\n"
    },
    {
      "stdin": "7\nI 2\nI 1\nI 3\nD 2\nK 1\nK 2\nR 3\n",
      "expected": "1\n3\n1\n"
    }
  ],
  "heavy-light-decomposition-practice": [
    {
      "stdin": "1 3\n-4\n2 0 0\n1 0 7\n2 0 0\n",
      "expected": "-4\n7\n"
    },
    {
      "stdin": "4 3\n1 2 3 4\n0 1 2\n2 3 0\n1 2 -5\n2 1 3\n",
      "expected": "10\n1\n"
    },
    {
      "stdin": "7 3\n1 2 4 8 16 32 64\n0 0 1 1 2 2\n2 4 6\n2 3 4\n2 5 2\n",
      "expected": "87\n26\n36\n"
    }
  ],
  "centroid-decomposition-practice": [
    {
      "stdin": "1 4\n2 0\n1 0\n1 0\n2 0\n",
      "expected": "-1\n0\n"
    },
    {
      "stdin": "6 5\n0 0 0 0 0\n1 1\n2 5\n2 0\n1 5\n2 5\n",
      "expected": "2\n1\n0\n"
    },
    {
      "stdin": "7 5\n0 0 1 1 2 2\n1 6\n2 3\n1 4\n2 3\n2 6\n",
      "expected": "4\n2\n0\n"
    }
  ],
  "offline-threshold-queries-practice": [
    {
      "stdin": "2 0 2\n0 0 -9\n0 1 9\n",
      "expected": "YES\nNO\n"
    },
    {
      "stdin": "4 3 4\n0 1 -2\n1 2 -2\n2 3 0\n0 2 -3\n0 3 0\n0 2 -2\n0 3 -2\n",
      "expected": "NO\nYES\nYES\nNO\n"
    },
    {
      "stdin": "1 0 0\n",
      "expected": ""
    }
  ],
  "prefix-tries-practice": [
    {
      "stdin": "0 2\na\nz\n",
      "expected": "0\n0\n"
    },
    {
      "stdin": "4 4\na\nab\nalps\na\na\nal\nab\nabc\n",
      "expected": "4\n1\n1\n0\n"
    },
    {
      "stdin": "1 0\nz\n",
      "expected": ""
    }
  ],
  "euler-tour-flattening-practice": [
    {
      "stdin": "1 2\n-5\n0\n0\n",
      "expected": "-5\n-5\n"
    },
    {
      "stdin": "5 4\n0 2 -3 7 -8\n0 0 1 2\n0\n1\n2\n4\n",
      "expected": "-2\n9\n-11\n-8\n"
    },
    {
      "stdin": "3 0\n3 2 1\n0 1\n",
      "expected": ""
    }
  ],
  "rerooting-tree-dp-practice": [
    {
      "stdin": "1\n",
      "expected": "0\n"
    },
    {
      "stdin": "5\n0 0 0 0\n",
      "expected": "4 7 7 7 7\n"
    },
    {
      "stdin": "5\n0 0 1 1\n",
      "expected": "6 5 9 8 8\n"
    },
    {
      "stdin": "2\n0\n",
      "expected": "1 1\n"
    }
  ],
  "digit-dp-practice": [
    {
      "stdin": "0 1\n",
      "expected": "1\n"
    },
    {
      "stdin": "1000000000000 1\n",
      "expected": "1000000000001\n"
    },
    {
      "stdin": "99 20\n",
      "expected": "1\n"
    },
    {
      "stdin": "10 2\n",
      "expected": "5\n"
    }
  ],
  "gcd-and-lcm-practice": [
    {
      "stdin": "2\n0 0\n1 0\n",
      "expected": "0\n0\n"
    },
    {
      "stdin": "2\n1000000000 999999999\n1000000000 1000000000\n",
      "expected": "999999999000000000\n1000000000\n"
    },
    {
      "stdin": "2\n4 16\n16 4\n",
      "expected": "16\n16\n"
    }
  ],
  "bitmask-dp-practice": [
    {
      "stdin": "1\n-7\n",
      "expected": "-7\n"
    },
    {
      "stdin": "3\n1 1 1\n1 1 1\n1 1 1\n",
      "expected": "3\n"
    },
    {
      "stdin": "3\n4 -3 5\n0 8 2\n-1 5 1\n",
      "expected": "-2\n"
    }
  ],
  "modular-inverses-practice": [
    {
      "stdin": "3\n0 7\n1 1000000000\n2 7\n",
      "expected": "NONE\n1\n4\n"
    },
    {
      "stdin": "3\n8 12\n7 9\n999999999 1000000000\n",
      "expected": "NONE\n4\n999999999\n"
    },
    {
      "stdin": "1\n1000000000 3\n",
      "expected": "1\n"
    }
  ],
  "tree-dp-practice": [
    {
      "stdin": "1\n-3\n",
      "expected": "0\n"
    },
    {
      "stdin": "4\n9 -1 -1 9\n0 1 2\n",
      "expected": "18\n"
    },
    {
      "stdin": "4\n6 3 3 3\n0 0 0\n",
      "expected": "9\n"
    },
    {
      "stdin": "3\n-1 -1 -1\n0 1\n",
      "expected": "0\n"
    }
  ],
  "probability-dp-practice": [
    {
      "stdin": "0 0\n",
      "expected": "1/1\n"
    },
    {
      "stdin": "2 2\n6 0\n",
      "expected": "0/1\n"
    },
    {
      "stdin": "2 1\n6 0\n",
      "expected": "1/1\n"
    },
    {
      "stdin": "20 20\n1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n",
      "expected": "1/3656158440062976\n"
    }
  ],
  "dag-dp-practice": [
    {
      "stdin": "1 0 0 0\n",
      "expected": "1\n"
    },
    {
      "stdin": "3 1 2 0\n0 1\n",
      "expected": "0\n"
    },
    {
      "stdin": "3 5 0 2\n0 1\n0 1\n1 2\n1 2\n0 2\n",
      "expected": "5\n"
    },
    {
      "stdin": "33 64 0 32\n0 1\n0 1\n1 2\n1 2\n2 3\n2 3\n3 4\n3 4\n4 5\n4 5\n5 6\n5 6\n6 7\n6 7\n7 8\n7 8\n8 9\n8 9\n9 10\n9 10\n10 11\n10 11\n11 12\n11 12\n12 13\n12 13\n13 14\n13 14\n14 15\n14 15\n15 16\n15 16\n16 17\n16 17\n17 18\n17 18\n18 19\n18 19\n19 20\n19 20\n20 21\n20 21\n21 22\n21 22\n22 23\n22 23\n23 24\n23 24\n24 25\n24 25\n25 26\n25 26\n26 27\n26 27\n27 28\n27 28\n28 29\n28 29\n29 30\n29 30\n30 31\n30 31\n31 32\n31 32\n",
      "expected": "294967268\n"
    }
  ],
  "interval-dp-practice": [
    {
      "stdin": "1\n9 8\n",
      "expected": "0\n"
    },
    {
      "stdin": "2\n100 100 100\n",
      "expected": "1000000\n"
    },
    {
      "stdin": "4\n2 2 2 2 2\n",
      "expected": "24\n"
    },
    {
      "stdin": "6\n30 35 15 5 10 20 25\n",
      "expected": "15125\n"
    }
  ],
  "chinese-remainder-theorem-practice": [
    {
      "stdin": "3\n0 1 3 7\n3 7 0 1\n0 1 0 1\n",
      "expected": "3\n3\n0\n"
    },
    {
      "stdin": "3\n5 6 1 4\n5 6 2 3\n5 6 0 3\n",
      "expected": "5\n5\nNONE\n"
    },
    {
      "stdin": "1\n999998 999999 999999 1000000\n",
      "expected": "999998999999\n"
    }
  ]
};
