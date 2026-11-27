import { defineTopics } from "./define.ts";

export const executionBasics = defineTopics([
  {
    "id": "program-execution",
    "stage": 0,
    "title": "How programs execute instructions",
    "objective": "Trace instructions through a small accumulator machine and explain where translation fits.",
    "prerequisites": "Input, process and output.",
    "analogy": "A clerk follows numbered instruction cards and keeps the current total on a reusable note.",
    "explanation": "The toy machine has a register and a program counter. It reads the next instruction, applies its effect to the register, and advances. Real machines execute encoded instructions. A compiler translates source to a target such as machine code or bytecode. An interpreter executes a representation at run time. Implementations can combine both approaches. For example, a typical CPython runtime compiles source to bytecode and interprets it, and a JVM can compile frequently executed bytecode while running.",
    "invariant": "After k instructions, the program counter points to the next instruction and the register holds the result of applying exactly the first k transformations in order.",
    "pseudocode": "register = 0\nrepeat n times:\n  read operation and operand\n  if operation is SET, replace the register\n  if operation is ADD, increase it by the operand\n  if operation is MUL, multiply by the operand\nprint register",
    "time": "O(n) time",
    "space": "O(1) with streaming input",
    "trace": [
      [
        "pc=0, register=0",
        "The program starts before SET 4, ADD −2, MUL 3."
      ],
      [
        "pc=1, register=4",
        "SET replaces the previous register value."
      ],
      [
        "pc=2, register=2",
        "ADD −2 changes 4 to 2."
      ],
      [
        "pc=3, register=6",
        "MUL 3 gives 6. The program counter has advanced beyond the final instruction."
      ]
    ],
    "misconception": "Compilers and interpreters describe techniques a runtime can combine. A language definition alone does not determine which techniques are used.",
    "debug": "Trace ADD 2 then MUL 3, and reverse them. The different totals reveal an ordering mistake.",
    "fill": "After applying one ordinary instruction, how far does the program counter advance?",
    "edgeCases": [
      "An empty program leaves the register at zero.",
      "SET discards earlier arithmetic.",
      "Negative operands follow ordinary integer arithmetic."
    ],
    "revision": "What two pieces of state are enough to describe the running toy machine?",
    "further": "Add a conditional jump and trace when the program counter changes by more than one.",
    "quiz": {
      "question": "After SET 4 then ADD −2, what is in the register?",
      "answers": [
        "4",
        "2",
        "−2"
      ],
      "correct": 1,
      "feedback": "SET leaves 4 in the register. ADD combines the current value with −2."
    },
    "practice": {
      "title": "Run the register",
      "description": "Simulate a toy register machine whose instructions execute in input order.",
      "format": "Read n, followed by n lines with an operation SET, ADD or MUL and a signed operand. Print the final register, which starts at zero.",
      "constraints": "0 ≤ n ≤ 300, |operand| ≤ 100, and every intermediate register value has absolute value at most 10⁹.",
      "input": "3\nSET 4\nADD -2\nMUL 3\n",
      "output": "6\n",
      "hints": [
        "Keep one variable for the current register.",
        "SET replaces the value instead of adding to it."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int n;
    long long value = 0;
    if (scanf("%d", &n) != 1) return 0;
    for (int pc = 0; pc < n; pc++) {
        char op[4];
        int operand;
        if (scanf("%3s%d", op, &operand) != 2) return 0;
        if (op[0] == 'S') value = operand;
        else if (op[0] == 'A') value += operand;
        else value *= operand;
    }
    printf("%lld\\n", value);
    return 0;
}`,
      python: `n = int(input())
value = 0
for pc in range(n):
    op, argument = input().split()
    operand = int(argument)
    if op == "SET":
        value = operand
    elif op == "ADD":
        value += operand
    else:
        value *= operand
print(value)`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt();
        long value = 0;
        for (int pc = 0; pc < n; pc++) {
            String op = in.next();
            int operand = in.nextInt();
            if (op.equals("SET")) value = operand;
            else if (op.equals("ADD")) value += operand;
            else value *= operand;
        }
        System.out.println(value);
    }
}`,
    },
  },
  {
    "id": "flowchart-decisions",
    "stage": 0,
    "title": "Flowcharts and decision paths",
    "objective": "Follow a flowchart and translate its decision nodes into ordered conditions.",
    "prerequisites": "Comparison and logical reasoning.",
    "analogy": "A parcel sorting sign sends a package down one of two paths at each fork.",
    "explanation": "A flowchart makes control flow explicit. Use a terminator for start or stop, a process box for an action, and a diamond for a decision. Label the outgoing decision paths. Read the diagram from start to stop and translate each branch into a condition. For the parcel rule, check the priority flag first, then use the weight when priority is absent.",
    "invariant": "Every path reaches exactly one output. A priority parcel always takes the first branch. Among the remaining parcels, the weight predicate partitions the two possible outcomes.",
    "pseudocode": "START → read priority and weight\npriority? yes → output EXPRESS → STOP\n          no  → weight > 10?\n                 yes → output FREIGHT → STOP\n                 no  → output STANDARD → STOP",
    "time": "O(1) time",
    "space": "O(1) space",
    "trace": [
      [
        "Input priority=0, weight=10",
        "Start at the input step, then follow the arrow to the first decision."
      ],
      [
        "Priority? → no",
        "Priority is zero, so follow the no branch."
      ],
      [
        "Weight > 10? → no",
        "At the boundary of 10, strict greater-than is false."
      ],
      [
        "Output STANDARD → stop",
        "This path has one output and ends."
      ]
    ],
    "misconception": "An unlabeled arrow from a decision makes it unclear which condition takes that path.",
    "debug": "Try a priority parcel weighing 20. A FREIGHT result suggests the conditions were checked in the wrong order.",
    "fill": "Which flowchart shape holds the question weight > 10?",
    "edgeCases": [
      "Weight 10 is STANDARD without priority.",
      "Priority overrides the weight branch.",
      "Every allowed input leads to exactly one label."
    ],
    "revision": "What labeled decision path leads to FREIGHT?",
    "further": "Add a decision for hazardous parcels and update the tests for every exit.",
    "quiz": {
      "question": "Which path does a priority parcel weighing 12 take?",
      "answers": [
        "EXPRESS",
        "FREIGHT",
        "STANDARD"
      ],
      "correct": 0,
      "feedback": "The priority decision takes the EXPRESS branch before weight is examined."
    },
    "practice": {
      "title": "Route a parcel",
      "description": "Choose a dispatch lane by following the parcel decision rules.",
      "format": "Read priority and weight. Print EXPRESS if priority is 1, otherwise FREIGHT if weight exceeds 10, otherwise STANDARD.",
      "constraints": "priority is 0 or 1. Weight is an integer from 0 through 1000.",
      "input": "0 10\n",
      "output": "STANDARD\n",
      "hints": [
        "Check priority first.",
        "Use a strict comparison for the freight weight threshold."
      ]
    },
    code:{
      c: `#include <stdio.h>
int main(void) {
    int priority, weight;
    if (scanf("%d%d", &priority, &weight) != 2) return 0;
    if (priority) puts("EXPRESS");
    else if (weight > 10) puts("FREIGHT");
    else puts("STANDARD");
    return 0;
}`,
      python: `priority, weight = map(int, input().split())
if priority:
    print("EXPRESS")
elif weight > 10:
    print("FREIGHT")
else:
    print("STANDARD")`,
      java: `import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int priority = in.nextInt(), weight = in.nextInt();
        if (priority == 1) System.out.println("EXPRESS");
        else if (weight > 10) System.out.println("FREIGHT");
        else System.out.println("STANDARD");
    }
}`,
    },
  },
  {
    "id": "variable-scope",
    "stage": 1,
    "title": "Variable scope and function calls",
    "objective": "Distinguish local variables from caller state when a helper processes one record.",
    "prerequisites": "Functions, conditions and loops.",
    "analogy": "Each task gets a scratch sheet. The tally stays on the main page between tasks.",
    "explanation": "A function parameter and its local variables belong to the current call. Use a helper to decide one record and return its contribution. Keep the total in the caller so it survives repeated calls. C and Java give local declarations block scope. Python ordinary if and for blocks do not introduce a new local scope, while a function does.",
    "invariant": "Each call computes an independent contribution of one or zero. After k calls the caller's tally equals the sum of the first k returned contributions.",
    "pseudocode": "contribution(reading, threshold):\n  qualified = reading >= threshold\n  return 1 if qualified else 0\ncaller:\n  total = 0\n  for reading: add contribution(reading, threshold) to total\n  output total",
    "time": "O(n) time for n records",
    "space": "O(1) for local state. Python stores the input line in O(n) space",
    "trace": [
      [
        "threshold=7, total=0",
        "The caller owns the total."
      ],
      [
        "contribution(8, 7) → 1",
        "The helper creates a fresh decision value. The caller adds one."
      ],
      [
        "contribution(5, 7) → 0",
        "This call has its own parameter values. The caller keeps its earlier total of one."
      ],
      [
        "contribution(7, 7) → 1",
        "The caller reaches two after adding the final result."
      ]
    ],
    "misconception": "Initializing the tally inside the helper resets it on each call.",
    "debug": "Try two qualifying records separated by one miss. A result of one may mean the tally is being reset.",
    "fill": "Which function should own the total that accumulates across all records?",
    "edgeCases": [
      "An empty list returns zero.",
      "A record equal to the threshold qualifies.",
      "All qualifying records produce a total equal to the record count."
    ],
    "revision": "Which value is new for each call, and which value survives between calls?",
    "further": "Return a signed contribution for each of three categories and compare the helper with an implementation that uses global state.",
    "quiz": {
      "question": "Where should the variable that accumulates all records live?",
      "answers": [
        "In the caller",
        "In each helper call",
        "In the helper’s threshold parameter"
      ],
      "correct": 0,
      "feedback": "The caller spans all helper calls, so its tally keeps each earlier contribution."
    },
    "practice": {
      "title": "Count passing inspections",
      "description": "Use a helper to check each inspection and count the scores that meet the required minimum.",
      "format": "Read n and a threshold on one line. The next line contains n scores, or is empty when n is zero. Print the passing count.",
      "constraints": "0 ≤ n ≤ 400. Scores and threshold are between −1000 and 1000.",
      "input": "3 7\n8 5 7\n",
      "output": "2\n",
      "hints": [
        "Use a helper that returns one or zero.",
        "Add the result of each call to a tally owned by the main program."
      ]
    },
    code:{
      c: `#include <stdio.h>
static int contribution(int score, int threshold) {
    int qualified = score >= threshold;
    return qualified;
}
int main(void) {
    int n, threshold, total = 0;
    if (scanf("%d%d", &n, &threshold) != 2) return 0;
    for (int i = 0; i < n; i++) {
        int score;
        scanf("%d", &score);
        total += contribution(score, threshold);
    }
    printf("%d\\n", total);
    return 0;
}`,
      python: `def contribution(score, threshold):
    qualified = score >= threshold
    return int(qualified)

n, threshold = map(int, input().split())
scores = map(int, input().split())
total = 0
for score in scores:
    total += contribution(score, threshold)
print(total)`,
      java: `import java.util.Scanner;
class Main {
    static int contribution(int score, int threshold) {
        boolean qualified = score >= threshold;
        return qualified ? 1 : 0;
    }
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int n = in.nextInt(), threshold = in.nextInt(), total = 0;
        for (int i = 0; i < n; i++) total += contribution(in.nextInt(), threshold);
        System.out.println(total);
    }
}`,
    },
  }
]);
