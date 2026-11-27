import { defineTopics } from "./define.ts";

export const fundamentals = defineTopics([
  {
    "id": "binary-representation",
    "stage": 0,
    "title": "Binary representation",
    "objective": "Convert binary digits to a decimal value by accumulating place values.",
    "prerequisites": "Integer addition and multiplication.",
    "analogy": "Adding a decimal digit shifts the current number one place to the left. Binary follows the same rule with place values that double.",
    "explanation": "Read the bits from left to right. Multiply the current value by two, then add the next bit. A leading zero has no effect.",
    "invariant": "After processing the first k bits, the accumulator equals the value of that prefix. Appending bit b takes prefix x to 2x + b.",
    "pseudocode": "value ← 0\nfor each bit b:\n    value ← 2 × value + b\nprint value",
    "time": "O(n) time for n bits",
    "space": "O(n) space for the input string and O(1) auxiliary space",
    "trace": [
      [
        "10101 | value = 0",
        "Start before the first bit."
      ],
      [
        "10 | value = 2",
        "After the first 1 the value is 1. Appending 0 doubles it to 2."
      ],
      [
        "1010 | value = 10",
        "Append 1 to get 5, then append 0 to get 10."
      ],
      [
        "10101 | value = 21",
        "Double 10 and add the last bit, 1."
      ]
    ],
    "misconception": "A character has an encoding. Convert it to the numeric bit before adding it.",
    "debug": "A conversion of 10 produces 10. What base multiplier did the program use?",
    "fill": "Complete the update: value = __ × value + bit.",
    "edgeCases": [
      "Try the all-zero input.",
      "Try leading zeros.",
      "The 30-bit upper bound fits a signed 32-bit integer."
    ],
    "revision": "Shift by one binary place, then add the bit.",
    "further": "Compare this left-to-right conversion with repeatedly dividing a decimal number by two and collecting the remainders.",
    "quiz": {
      "question": "What value does 1101 represent?",
      "answers": [
        "11",
        "13",
        "7"
      ],
      "correct": 1,
      "feedback": "Starting at zero, the four updates give 1, 3, 6, and 13."
    },
    "practice": {
      "title": "Decode a binary word",
      "description": "Convert a binary word to its decimal value.",
      "format": "Read one binary word. Print one decimal integer.",
      "constraints": "1 to 30 characters, each 0 or 1.",
      "input": "10101\n",
      "output": "21\n",
      "hints": [
        "Start at zero.",
        "Every new bit shifts the processed prefix one place.",
        "Use a multiplier of two."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    char bits[31];
    if (scanf("%30s", bits) != 1) return 1;
    int value = 0;
    for (int i = 0; bits[i]; ++i) value = 2 * value + (bits[i] - '0');
    printf("%d\\n", value);
    return 0;
}`,
      python: `value = 0
for bit in input().strip():
    value = 2 * value + int(bit)
print(value)`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String bits = new Scanner(System.in).next();
        int value = 0;
        for (char bit : bits.toCharArray()) value = 2 * value + (bit - '0');
        System.out.println(value);
    }
}`,
    },
  },
  {
    "id": "conditionals-and-functions",
    "stage": 1,
    "title": "Conditionals and small functions",
    "objective": "Write and test a function whose conditions cover every input case.",
    "prerequisites": "Variables, operators, and integer input.",
    "analogy": "An elevator controller keeps a requested floor inside the building’s supported range.",
    "explanation": "A range clamp handles three cases. If the number is below the lower bound, return the lower bound. If it is above the upper bound, return the upper bound. Otherwise return the number unchanged.",
    "invariant": "With low ≤ high, the cases x < low, x > high, and low ≤ x ≤ high are disjoint and cover every x. The result is always in [low, high].",
    "pseudocode": "if x < low: return low\nif x > high: return high\nreturn x",
    "time": "O(1) time",
    "space": "O(1) auxiliary space",
    "trace": [
      [
        "x = 13 | low = 0 | high = 10",
        "Call the clamp function with the requested value and legal bounds."
      ],
      [
        "13 < 0 → false",
        "The lower-bound branch does not return."
      ],
      [
        "13 > 10 → true | result = 10",
        "The upper-bound branch returns immediately."
      ]
    ],
    "misconception": "Returning x inside the first false branch can skip the upper-bound check.",
    "debug": "A request equal to the upper bound was flagged as out of range. Which comparison should be strict?",
    "fill": "Fill in the second condition: if x __ high.",
    "edgeCases": [
      "Test both boundary values.",
      "When low equals high there is only one legal result.",
      "Negative bounds are valid."
    ],
    "revision": "Partition the inputs and test a representative from each partition.",
    "further": "Try assigning different shipping costs with ordered conditions and write a test at every threshold.",
    "quiz": {
      "question": "What is clamp(-3, -2, 4)?",
      "answers": [
        "-3",
        "4",
        "-2"
      ],
      "correct": 2,
      "feedback": "The value is below the lower bound, so the function returns −2."
    },
    "practice": {
      "title": "Keep the reading in range",
      "description": "Clamp a sensor reading to a safe range.",
      "format": "Read x, low, and high. Print the clamped value.",
      "constraints": "−10⁹ ≤ low ≤ high ≤ 10⁹ and −10⁹ ≤ x ≤ 10⁹.",
      "input": "13 0 10\n",
      "output": "10\n",
      "hints": [
        "Check the lower and upper bounds.",
        "Return early for an out-of-range input.",
        "Keep the value when it is already in range."
      ]
    },
    code:{
      c: `#include <stdio.h>

static int clamp(int x, int low, int high) {
    if (x < low) return low;
    if (x > high) return high;
    return x;
}

int main(void) {
    int x, low, high;
    if (scanf("%d%d%d", &x, &low, &high) != 3) return 1;
    printf("%d\\n", clamp(x, low, high));
    return 0;
}`,
      python: `def clamp(x, low, high):
    if x < low:
        return low
    if x > high:
        return high
    return x

print(clamp(*map(int, input().split())))`,
      java: `import java.util.Scanner;

public class Main {
    static int clamp(int x, int low, int high) {
        if (x < low) return low;
        if (x > high) return high;
        return x;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.println(clamp(in.nextInt(), in.nextInt(), in.nextInt()));
    }
}`,
    },
  },
  {
    "id": "recursion-and-growth",
    "stage": 2,
    "title": "Recursion, base cases, and growth",
    "objective": "Trace a recursive call, show that it terminates, and relate call count to input size.",
    "prerequisites": "Functions and integer division.",
    "analogy": "Peel one label from a stack and ask how many labels remain underneath.",
    "explanation": "To count decimal digits, a number below ten contributes one digit. For any larger number, remove its final digit with integer division by ten and add one to the answer for the smaller number.",
    "invariant": "For n ≥ 10, floor(n/10) is strictly smaller and loses exactly one decimal digit. The recurrence T(n)=T(floor(n/10))+O(1) stops after one call per digit.",
    "pseudocode": "digits(n):\n    if n < 10: return 1\n    return 1 + digits(floor(n / 10))",
    "time": "O(log(n+1)+1) time",
    "space": "O(log(n+1)+1) call-stack space",
    "trace": [
      [
        "digits(1209)",
        "1209 has at least two digits. Delegate the count of 120 and add one."
      ],
      [
        "digits(120) → digits(12) → digits(1)",
        "Each division removes one digit and strictly decreases the input."
      ],
      [
        "1 → 2 → 3 → 4",
        "The base returns one. The results add one per suspended call."
      ]
    ],
    "misconception": "Returning zero for all one-digit values makes every positive count one too small.",
    "debug": "A base case checks n == 1. Will input 20 ever reach it?",
    "fill": "Complete the recursive argument: digits(n __ 10).",
    "edgeCases": [
      "Zero has one written digit.",
      "Use integer division.",
      "The stated bound keeps recursion shallow."
    ],
    "revision": "Name a base case and a strictly decreasing measure before writing recursion.",
    "further": "Translate the recurrence into a loop and compare stack usage.",
    "quiz": {
      "question": "How many active calls are on the stack when digits(80) reaches its base case?",
      "answers": [
        "1",
        "2",
        "8"
      ],
      "correct": 1,
      "feedback": "digits(80) calls digits(8), which is the base. Both calls are active."
    },
    "practice": {
      "title": "Count decimal digits",
      "description": "Count the digits in the usual decimal representation.",
      "format": "Read one nonnegative integer. Print its decimal digit count.",
      "constraints": "0 ≤ n ≤ 1,000,000,000.",
      "input": "1209\n",
      "output": "4\n",
      "hints": [
        "A number below ten has one digit.",
        "Divide by ten without rounding up.",
        "Add one for the removed digit."
      ]
    },
    code:{
      c: `#include <stdio.h>

static int digits(int n) {
    return n < 10 ? 1 : 1 + digits(n / 10);
}

int main(void) {
    int n;
    if (scanf("%d", &n) != 1) return 1;
    printf("%d\\n", digits(n));
    return 0;
}`,
      python: `def digits(n):
    if n < 10:
        return 1
    return 1 + digits(n // 10)

print(digits(int(input())))`,
      java: `import java.util.Scanner;

public class Main {
    static int digits(int n) {
        if (n < 10) return 1;
        return 1 + digits(n / 10);
    }

    public static void main(String[] args) {
        System.out.println(digits(new Scanner(System.in).nextInt()));
    }
}`,
    },
  },
  {
    "id": "stacks-and-brackets",
    "stage": 3,
    "title": "Stacks and nested delimiters",
    "objective": "Use last-in, first-out order to match the most recent unmatched opener.",
    "prerequisites": "Loops, character comparisons, and arrays or lists.",
    "analogy": "Pulling plates from a stack always removes the plate most recently added.",
    "explanation": "Record each opening bracket. For a closing bracket, inspect the most recent unmatched opener. Reject if the stack is empty or the types differ. After the scan, every opener must have been matched.",
    "invariant": "Before each character, the stack holds exactly the unmatched opening brackets of the scanned prefix in encounter order. A valid closer can match only the top.",
    "pseudocode": "for each character c:\n    if c is opening: push c\n    otherwise: require matching top, then pop\naccept only if the stack is empty",
    "time": "O(n) time",
    "space": "O(n) stack space",
    "trace": [
      [
        "[] → [ '(' ]",
        "Push the opening parenthesis."
      ],
      [
        "[ '(' ] → [ '(', '[' ]",
        "Push the square bracket on top."
      ],
      [
        "[ '(', '[' ] → [ '(' ] → []",
        "The right square bracket removes [. The right parenthesis then removes (."
      ]
    ],
    "misconception": "Equal counts of opening and closing brackets do not prove valid nesting.",
    "debug": "An implementation accepts ([)]. Which one should be at the top when ) is read?",
    "fill": "After a valid close, the implementation must __ the top.",
    "edgeCases": [
      "Reject a closer before any opener.",
      "Reject leftover opening brackets.",
      "Reject crossed bracket types."
    ],
    "revision": "Only the top can be closed next.",
    "further": "Use a stack to store undo actions or evaluate postfix expressions.",
    "quiz": {
      "question": "For ([)], what top value is inspected at the first closing bracket?",
      "answers": [
        "(",
        "[",
        "The stack is empty"
      ],
      "correct": 1,
      "feedback": "The last opener pushed was [. It cannot match ), so the string is invalid."
    },
    "practice": {
      "title": "Read the nested signal",
      "description": "Decide whether paired parentheses, square brackets, and braces are correctly nested.",
      "format": "Read one nonempty token containing only brackets. Print YES for valid nesting, otherwise NO.",
      "constraints": "1 ≤ token length ≤ 10,000.",
      "input": "([]{})\n",
      "output": "YES\n",
      "hints": [
        "Keep unmatched openers.",
        "A closing bracket must match the most recent opener.",
        "At the end the stack must be empty."
      ]
    },
    code:{
      c: `#include <stdio.h>

int main(void) {
    char text[10001], stack[10000];
    if (scanf("%10000s", text) != 1) return 1;
    int size = 0;
    for (int i = 0; text[i]; ++i) {
        char ch = text[i];
        if (ch == '(' || ch == '[' || ch == '{') {
            stack[size++] = ch;
        } else {
            char required = ch == ')' ? '(' : ch == ']' ? '[' : '{';
            if (size == 0 || stack[--size] != required) {
                puts("NO");
                return 0;
            }
        }
    }
    puts(size == 0 ? "YES" : "NO");
    return 0;
}`,
      python: `pairs = {")": "(", "]": "[", "}": "{"}
stack = []
for bracket in input().strip():
    if bracket not in pairs:
        stack.append(bracket)
    elif not stack or stack.pop() != pairs[bracket]:
        print("NO")
        break
else:
    print("NO" if stack else "YES")`,
      java: `import java.util.ArrayDeque;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String text = new Scanner(System.in).next();
        ArrayDeque<Character> stack = new ArrayDeque<>();
        for (char ch : text.toCharArray()) {
            if (ch == '(' || ch == '[' || ch == '{') {
                stack.push(ch);
            } else {
                char required = ch == ')' ? '(' : ch == ']' ? '[' : '{';
                if (stack.isEmpty() || stack.pop() != required) {
                    System.out.println("NO");
                    return;
                }
            }
        }
        System.out.println(stack.isEmpty() ? "YES" : "NO");
    }
}`,
    },
  }
]);
