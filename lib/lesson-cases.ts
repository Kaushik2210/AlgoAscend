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
  ]
};
