export type Algorithm = "binary" | "bubble";

export interface Frame {
  values: readonly number[];
  active: number[];
  low: number;
  high: number;
  operations: number;
  line: number;
  message: string;
  result?: number;
}

export const traces = {
  binary: {
    title: "Binary Search",
    complexity: "O(log n)",
    values: [4, 9, 16, 23, 38, 52, 67, 81, 95],
    target: 67,
    pseudocode: ["low = 0, high = n − 1", "mid = floor((low + high) / 2)", "if a[mid] < target: low = mid + 1", "else: high = mid − 1 (save a match)", "return first match, or −1"],
  },
  bubble: {
    title: "Bubble Sort",
    complexity: "O(n²)",
    values: [72, 20, 58, 33, 88, 45, 67],
    pseudocode: ["for each shrinking pass", "compare adjacent items", "if left > right: swap", "if no swaps: stop", "return the sorted array"],
  },
};

export function parseValues(input: string): number[] {
  const values = input.split(",").map(value => value.trim());
  if (values.length > 12 || values.some(value => !/^-?\d{1,3}$/.test(value))) {
    throw new Error("Enter 1–12 comma-separated integers between −999 and 999.");
  }
  return values.map(Number);
}

export function binaryTrace(values: readonly number[], target: number): Frame[] {
  if (values.some((value, index) => index > 0 && value < values[index - 1])) {
    throw new Error("Binary search needs values sorted from smallest to largest.");
  }

  let low = 0;
  let high = values.length - 1;
  let operations = 0;
  let result = -1;
  const frames: Frame[] = [];
  const add = (line: number, message: string, active: number[] = []) => {
    frames.push({ values: [...values], active, low, high, operations, line, message });
  };

  add(0, "Start with the whole sorted array.");
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    operations++;
    add(1, `Compare a[${mid}] = ${values[mid]} with target ${target}.`, [mid]);
    if (values[mid] < target) {
      low = mid + 1;
      add(2, `${values[mid]} is too small. Keep the right half.`);
    } else {
      if (values[mid] === target) result = mid;
      high = mid - 1;
      add(3, values[mid] === target ? "Save this match and check for an earlier duplicate." : `${values[mid]} is too large. Keep the left half.`);
    }
  }
  add(4, result === -1 ? "The target is absent. Return −1." : `First match found at index ${result}.`, result === -1 ? [] : [result]);
  frames[frames.length - 1].result = result;
  return frames;
}

export function bubbleTrace(input: readonly number[]): Frame[] {
  const values = [...input];
  let operations = 0;
  let high = values.length - 1;
  const frames: Frame[] = [];
  const add = (line: number, message: string, active: number[] = []) => {
    frames.push({ values: [...values], active, low: 0, high, operations, line, message });
  };

  add(0, "Start with the full unsorted array.");
  while (high > 0) {
    let swapped = false;
    for (let left = 0; left < high; left++) {
      const right = left + 1;
      operations++;
      add(1, `Compare ${values[left]} and ${values[right]}.`, [left, right]);
      if (values[left] > values[right]) {
        [values[left], values[right]] = [values[right], values[left]];
        swapped = true;
        add(2, "Swap this pair to put the larger value on the right.", [left, right]);
      }
    }
    high--;
    if (!swapped) {
      add(3, "No swaps in this pass. The array is already sorted.");
      break;
    }
    add(0, "The rightmost value of the pass is now in its final position.");
  }
  high = -1;
  add(4, "The array is sorted.");
  return frames;
}

export function linearFind(values: readonly number[], target: number) {
  for (const [index, value] of values.entries()) {
    if (value === target) return {index, comparisons:index + 1};
  }
  return {index:-1, comparisons:values.length};
}
