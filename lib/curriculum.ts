export type Language = "c" | "python" | "java";
export type Goal = "fundamentals" | "university" | "placement" | "interviews" | "contests" | "advanced";
export type Experience = "new" | "basics" | "practice";

export const languageNames: Record<Language, string> = { c: "C", python: "Python", java: "Java" };
export const goals: Record<Goal, string> = { fundamentals: "Programming fundamentals", university: "University exams", placement: "Placement preparation", interviews: "Technical interviews", contests: "Competitive programming", advanced: "Advanced algorithms" };
export const experiences: Record<Experience, string> = { new: "Starting from scratch", basics: "I know the basics", practice: "I solve coding problems" };

type Lesson = {
  id: string;
  title: string;
  stage: number;
  minutes: number;
  objective: string;
  prerequisites: string;
  analogy: string;
  explanation: string;
  formal: string;
  runtime: string;
  memory: string;
  walkthrough: string;
  mistakes: string;
  edge: string;
  debug: string;
  fill: string;
  revision: string;
  question: string;
  answers: string[];
  correct: number;
  feedback: string;
  algorithm?: "binary" | "bubble" | "accumulate";
  problem: string;
  pseudocode: string;
  code: Record<Language, string>;
};

const ioCode = {
  c: "#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    if (scanf(\"%d %d\", &a, &b) != 2) return 1;\n    printf(\"%d\\n\", a + b);\n    return 0;\n}",
  python: "a, b = map(int, input().split())\nprint(a + b)",
  java: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int a = in.nextInt();\n        int b = in.nextInt();\n        System.out.println(a + b);\n    }\n}",
};

export const searchCode: Record<Language, string> = {
  c: "int first_index(const int a[], int n, int target) {\n    int low = 0, high = n - 1, result = -1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] < target) low = mid + 1;\n        else {\n            if (a[mid] == target) result = mid;\n            high = mid - 1;\n        }\n    }\n    return result;\n}",
  python: "def first_index(a, target):\n    low, high, result = 0, len(a) - 1, -1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if a[mid] < target:\n            low = mid + 1\n        else:\n            if a[mid] == target:\n                result = mid\n            high = mid - 1\n    return result",
  java: "static int firstIndex(int[] a, int target) {\n    int low = 0, high = a.length - 1, result = -1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (a[mid] < target) low = mid + 1;\n        else {\n            if (a[mid] == target) result = mid;\n            high = mid - 1;\n        }\n    }\n    return result;\n}",
};

const sortCode = {
  c: "void bubble_sort(int a[], int n) {\n    for (int end = n - 1; end > 0; --end) {\n        int swapped = 0;\n        for (int i = 0; i < end; ++i) {\n            if (a[i] > a[i + 1]) {\n                int temp = a[i];\n                a[i] = a[i + 1];\n                a[i + 1] = temp;\n                swapped = 1;\n            }\n        }\n        if (!swapped) break;\n    }\n}",
  python: "def bubble_sort(a):\n    for end in range(len(a) - 1, 0, -1):\n        swapped = False\n        for i in range(end):\n            if a[i] > a[i + 1]:\n                a[i], a[i + 1] = a[i + 1], a[i]\n                swapped = True\n        if not swapped:\n            break",
  java: "static void bubbleSort(int[] a) {\n    for (int end = a.length - 1; end > 0; end--) {\n        boolean swapped = false;\n        for (int i = 0; i < end; i++) {\n            if (a[i] > a[i + 1]) {\n                int temp = a[i];\n                a[i] = a[i + 1];\n                a[i + 1] = temp;\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}",
};

const accumulationCode = {
  c: "#include <stdio.h>\n\nint main(void) {\n    int n, total = 0;\n    if (scanf(\"%d\", &n) != 1) return 1;\n    for (int i = 0; i < n; ++i) {\n        int value;\n        if (scanf(\"%d\", &value) != 1) return 1;\n        total += value;\n        printf(\"%s%d\", i == 0 ? \"\" : \" \", total);\n    }\n    puts(\"\");\n    return 0;\n}",
  python: "n = int(input())\nvalues = map(int, input().split())\ntotal = 0\nfor i, value in enumerate(values):\n    total += value\n    print(total, end=\"\\n\" if i == n - 1 else \" \")",
  java: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        int n = in.nextInt(), total = 0;\n        for (int i = 0; i < n; i++) {\n            total += in.nextInt();\n            System.out.print((i == 0 ? \"\" : \" \") + total);\n        }\n        System.out.println();\n    }\n}",
};

export const lessons: Lesson[] = [
  {
    id: "input-output", title: "Input, process, output", stage: 0, minutes: 8,
    objective: "Trace two values through a small program and explain where the result goes.",
    prerequisites: "None. You can start here without having written code.",
    analogy: "A cashier reads two prices, adds them, and prints a total. A program follows the same sequence.",
    explanation: "Programs consume information, perform a transformation, and produce a result. In a coding judge, input comes from standard input. The judge checks what you print to standard output.",
    formal: "For two valid integers a and b in the exercise range, compute the function f(a, b) = a + b.",
    runtime: "O(1) for two bounded integers", memory: "O(1) extra space",
    walkthrough: "Read the two tokens into a and b. Compute the sum and print it on its own line. For −3 and 5, the output is 2.",
    mistakes: "Adding text values can join them together in some contexts. Parse both tokens into integers first.",
    edge: "Try negative operands, zero, and sums that cancel out. Use the problem bounds to ensure the chosen integer type can represent the result.",
    debug: "A judge expects 12 but your program prints Total: 12. Which printed characters should you remove?",
    fill: "Replace the blank with the expression that computes the answer: print(____).",
    revision: "Read exactly what the statement promises. Print exactly what the judge requests.",
    question: "What should the program print for input −4 and 7?", answers: ["−11", "3", "−47"], correct: 1,
    feedback: "The program adds the parsed integers. Starting at −4 and moving seven units right lands on 3.",
    problem: "signal-sum", pseudocode: "read a, b\nanswer ← a + b\nprint answer", code: ioCode,
  },
  {
    id: "running-total", title: "Loops and running totals", stage: 1, minutes: 10,
    objective: "Update a variable once per input and explain what it represents after each iteration.",
    prerequisites: "Reading and adding integers. Start with Input, process, output if those steps are new.",
    analogy: "A bank balance changes after each deposit or withdrawal. The next balance uses the previous balance and the current transaction.",
    explanation: "A loop applies the same operation to each item. An accumulator carries information from one iteration to the next. Start at zero for a sum, then add each item exactly once.",
    formal: "After processing i items, total equals the sum of items at indexes 0 through i − 1. The next iteration adds the item at index i and preserves this relationship.",
    runtime: "O(n) additions", memory: "O(1) for the accumulator. The Python example allocates O(n) space for split input.",
    walkthrough: "Read the number of items. Initialize total once outside the loop. Read one value in each iteration, add it to total, then print the updated total. For [4, −8, 3, 1], the outputs are 4, −4, −1, 0.",
    mistakes: "Declaring total inside the loop resets it every iteration. Printing before the addition shifts every reported balance one step behind.",
    edge: "Try a single value, repeated zeros, and negative values. Check that the sum fits your integer type.",
    debug: "A program prints [4, −8, 3] for input [4, −8, 3]. Where is the accumulator likely being reset?",
    fill: "Complete the update: total = total + ____.",
    revision: "Initialize once. Add the current item. Inspect or emit the new value before advancing.",
    question: "For [5, −2, 4], what is the running total immediately after the second item?", answers: ["−2", "3", "7"], correct: 1,
    feedback: "The current total after the first value is 5. Adding the second value, −2, gives 3.",
    algorithm: "accumulate", problem: "rolling-total", pseudocode: "total ← 0\nfor each value in input order:\n  total ← total + value\n  print total", code: accumulationCode,
  },
  {
    id: "binary-search", title: "Binary search", stage: 4, minutes: 14,
    objective: "Explain which half of a sorted array can be discarded and find the first occurrence of a target.",
    prerequisites: "Arrays, ascending order, and zero-based indexing.",
    analogy: "Open a sorted index in the middle. If the entry you need comes later alphabetically, everything before this page can be set aside.",
    explanation: "Compare the middle value with the target. Sorting tells you what can be true on each side. When you find a match, save its index and keep looking left for an earlier copy.",
    formal: "While low ≤ high, the interval [low, high] holds any candidate that could improve the best matching index recorded so far.",
    runtime: "O(log n) comparisons", memory: "O(1) extra space",
    walkthrough: "Initialize the full range and a missing-result sentinel. Compute the midpoint inside the loop. A smaller value moves the low boundary right. A larger value or a saved match moves the high boundary left. Return the saved match after the interval empties.",
    mistakes: "Setting low to mid without moving past the inspected item can stall when only one candidate remains.",
    edge: "Check an empty array, a one-item array, duplicate targets, and targets below or above the entire range.",
    debug: "A search for 9 in [2, 9] keeps comparing index 0. Which update must move beyond index 0?",
    fill: "When a[mid] < target, the correct update is low = ____.",
    revision: "The array must be sorted. Every iteration excludes the midpoint and shrinks the interval.",
    question: "In [4, 9, 16, 23, 38, 52, 67, 81, 95], the midpoint is 38. Where could target 67 still be?",
    answers: ["Only to the left", "Only to the right", "On either side"], correct: 1,
    feedback: "All values at or left of 38 are at most 38. Only values to its right can equal 67.",
    algorithm: "binary", problem: "first-signal", pseudocode: "low ← 0, high ← n − 1, result ← −1\nwhile low ≤ high:\n  mid ← floor((low + high) / 2)\n  if a[mid] < target: low ← mid + 1\n  else:\n    if a[mid] = target: result ← mid\n    high ← mid − 1\nreturn result", code: searchCode,
  },
  {
    id: "bubble-sort", title: "Bubble sort", stage: 4, minutes: 12,
    objective: "Trace an adjacent swap and explain why each pass fixes the rightmost unsorted value.",
    prerequisites: "Arrays, loops, and comparing two values.",
    analogy: "Move along a row of crates. Each time a heavier crate sits left of a lighter one, swap those two crates.",
    explanation: "A pass moves from left to right and repairs reversed adjacent pairs. By the end of the pass, the largest unsorted element has reached its final position.",
    formal: "After k completed passes, the rightmost k values are in their final sorted positions.",
    runtime: "O(n²) worst case, O(n) best case with early exit", memory: "O(1) extra space",
    walkthrough: "On [3, 1, 2], swap 3 and 1, then 3 and 2. The array is [1, 2, 3]. The next pass compares 1 and 2, performs no swaps, and ends the algorithm.",
    mistakes: "Comparing a[i + 1] when i is already at the end reads beyond the permitted pair.",
    edge: "Test empty or singleton input, already sorted input, and repeated values. Swapping only strictly reversed pairs preserves the order of equal values.",
    debug: "The inner loop uses i ≤ end. Why does the final comparison overflow the active range?",
    fill: "A pass can stop the algorithm when swapped is ____.",
    revision: "Adjacent comparisons push the largest remaining element right. A pass with no swaps proves the array is sorted.",
    question: "After one full pass over [4, 2, 3, 1], which value must be in its final position?", answers: ["1", "2", "4"], correct: 2,
    feedback: "The 4 swaps rightward whenever it meets a smaller neighbor, so it finishes at the end of the pass.",
    algorithm: "bubble", problem: "repair-order", pseudocode: "for end from n − 1 down to 1:\n  swapped ← false\n  for i from 0 to end − 1:\n    if a[i] > a[i + 1]:\n      swap a[i], a[i + 1]\n      swapped ← true\n  if swapped = false: stop", code: sortCode,
  },
];

export const stages = ["Computational thinking", "Programming fundamentals", "Algorithmic foundations", "Essential data structures", "Algorithmic patterns", "Trees and hierarchies", "Graphs", "Recursion and backtracking", "Greedy algorithms", "Dynamic programming", "Competitive programming mathematics", "Advanced data structures", "String algorithms", "Advanced competitive programming", "Interview and placement preparation"];

export function recommendNext(experience: Experience, goal: Goal, completed: string[]): Lesson | undefined {
  const upcoming = lessons.filter(lesson => !completed.includes(lesson.id));
  if (experience === "new") return upcoming[0];
  const search = upcoming.find(lesson => lesson.id === "binary-search");
  const sort = upcoming.find(lesson => lesson.id === "bubble-sort");
  return goal === "contests" || goal === "advanced"
    ? sort ?? search ?? upcoming[0]
    : search ?? sort ?? upcoming[0];
}
