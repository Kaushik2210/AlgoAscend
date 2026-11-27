import { publishedTopics } from "./lessons/index.ts";
import type { Language } from "./curriculum.ts";

export type Problem = {
  id: string; title: string; topic: string; lesson: string; description: string;
  format: string; constraints: string; sample: {stdin: string; expected: string}; hints: string[];
  editorial: {approach: string; correctness: string; complexity: string; edgeCases: string[]};
};

export const starter: Record<Language, string> = {
  c: '#include <stdio.h>\n\nint main(void) {\n    // Read input and print the result.\n    return 0;\n}',
  python: '# Read input and print the result.\n',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        // Read input and print the result.\n    }\n}',
};

export const problems: Problem[] = [
  { id:"signal-sum", title:"Signal Sum", topic:"Input and output", lesson:"input-output",
    description:"Two sensors report integer offsets. Print their combined offset.",
    format:"Read two space-separated integers. Print their sum on a single line.",
    constraints:"−10,000 ≤ each offset ≤ 10,000.",
    sample:{stdin:"2 3\n",expected:"5\n"},
    hints:["Ask what comes in and what should go out.", "Parse both tokens as integers before adding them.", "Read a and b, add a + b, then print the sum."],
    editorial:{
      approach:"Parse two integer tokens, add them once, and print one integer followed by a newline.",
      correctness:"The first parsed number is the first offset and the second is the other offset. Their arithmetic sum equals the combined offset requested by the statement.",
      complexity:"O(1) time and O(1) additional space for the fixed-size input.",
      edgeCases:["Two offsets with opposite signs that cancel.","Both values at the lowest allowed bound.","A zero offset."],
    } },
  { id:"rolling-total", title:"Rolling Sensor Total", topic:"Loops and accumulation", lesson:"running-total",
    description:"A station records a sequence of signed adjustments. Report the new total after each adjustment.",
    format:"Read n on the first line and n space-separated integers on the second. Print the n running totals on one line, separated by spaces.",
    constraints:"1 ≤ n ≤ 1000. Every adjustment is between −10,000 and 10,000.",
    sample:{stdin:"4\n4 -8 3 1\n",expected:"4 -4 -1 0\n"},
    hints:["Track the previous total in one variable.", "Initialize that variable before reading the first adjustment.", "Add the current adjustment, print the updated total, and then advance."],
    editorial:{
      approach:"Start the accumulator at zero. For each adjustment, update the accumulator and emit its new value before reading the next adjustment.",
      correctness:"Before the first item, zero is the sum of the empty prefix. If the accumulator equals the sum of the previous prefix, adding this item gives the sum of the next prefix. Printing after the update therefore produces the requested totals in order.",
      complexity:"O(n) time. The accumulator uses O(1) additional space with streaming input and output. Reading or storing the entire sequence uses O(n) space.",
      edgeCases:["One negative adjustment.","A prefix that returns to zero.","Zeros before and after a nonzero total."],
    } },
  { id:"first-signal", title:"Find the First Signal", topic:"Binary search", lesson:"binary-search",
    description:"A monitoring array stores sorted signal strengths. Return the zero-based index of the first occurrence of a requested strength, or −1 if it is missing.",
    format:"Read n and target on the first line, followed by n ascending integers on the second. That line is empty when n is zero. Print the first matching index or −1.",
    constraints:"0 ≤ n ≤ 100,000. Values and target are between −10⁹ and 10⁹.",
    sample:{stdin:"6 7\n2 7 7 7 11 20\n",expected:"1\n"},
    hints:["Use ascending order to reason about what can be true on each side of the midpoint.", "When the midpoint matches, save its index and keep searching to the left.", "Move one boundary past the midpoint each iteration. Return the saved index when the interval is empty."],
    editorial:{
      approach:"Search an inclusive low–high interval. Move right after a midpoint below the target. Otherwise move left, saving the midpoint when it matches.",
      correctness:"Sorted order makes every position at or before a too-small midpoint too small. A greater midpoint eliminates positions at and after it. After an exact match, positions to the right cannot improve the saved index. The loop shrinks the remaining interval each time, so the saved match at termination is the earliest one.",
      complexity:"O(log n) search time and O(1) additional search space. Reading and storing the input array takes O(n) time and space.",
      edgeCases:["An empty array.","Identical target values at the beginning of the array.","A target that falls strictly between two readings."],
    } },
  { id:"repair-order", title:"Repair the Ordering", topic:"Sorting", lesson:"bubble-sort",
    description:"An instrument received unordered readings. Output the readings in ascending order, including duplicates.",
    format:"Read n, then n space-separated integers. Print the sorted readings separated by spaces.",
    constraints:"1 ≤ n ≤ 100. −999 ≤ each reading ≤ 999.",
    sample:{stdin:"5\n12 -4 7 7 0\n",expected:"-4 0 7 7 12\n"},
    hints:["Which order should an adjacent pair be in?", "A swap moves the larger value one place right.", "Shrink the pass by one at the right end. Stop after a pass without swaps."],
    editorial:{
      approach:"Walk from left to right, swapping each reversed adjacent pair. On the next pass, skip the value that reached its final position at the right.",
      correctness:"During a pass, the largest element encountered thus far keeps moving right whenever it is followed by a smaller value. It ends at the rightmost position of the unsorted range. Each subsequent pass extends the sorted suffix by one. A pass without a swap leaves every adjacent pair in order.",
      complexity:"O(n²) worst-case time, O(n) best-case time with an early exit, and O(1) additional space beyond the input array.",
      edgeCases:["One reading.","An already sorted list with duplicates.","A descending list with negative values."],
    } },
  ...publishedTopics.map(topic => topic.problem),
];
