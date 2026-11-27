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
  ]
};
