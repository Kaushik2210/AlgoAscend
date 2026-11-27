import { defineTopics } from "./define.ts";

export const safeConversion = defineTopics([
  {
    "id": "safe-integer-conversion",
    "stage": 1,
    "title": "Type conversion and input errors",
    "objective": "Validate a text token before converting it to an integer or reporting an error.",
    "prerequisites": "Integer types, conditions and strings.",
    "analogy": "A ticket scanner checks that an entire ticket code matches the expected rules before accepting its numeric value.",
    "explanation": "Specify the accepted syntax first. This exercise allows an optional sign followed by at least one ASCII digit. Convert a validated token and check its range. C can validate with an end pointer from strtol and inspect conversion errors. Python and Java provide exceptions for failed numeric conversion. Their accepted syntax can differ, so the examples check the task’s grammar explicitly.",
    "invariant": "A token reaches the numeric result only if every character matches the grammar and the parsed value is within the inclusive range. The conversion must consume the entire token.",
    "pseudocode": "if token does not match optional sign then digits: print INVALID\nelse convert token as decimal\nif conversion fails or value outside [−999,999]: print INVALID\nelse print normalized integer",
    "time": "O(total input characters)",
    "space": "O(maximum token length) for the token being processed",
    "trace": [
      [
        "token +0042",
        "A leading plus is allowed and is followed by digits."
      ],
      [
        "parse → 42",
        "Leading zeros affect the spelling but not the integer."
      ],
      [
        "range check → valid",
        "42 lies within [−999,999]. Print 42."
      ],
      [
        "token 12x → INVALID",
        "The conversion cannot accept a valid prefix and ignore the rest."
      ]
    ],
    "misconception": "A numeric prefix does not validate the entire token. C strtol can return 12 for 12x while leaving its end pointer at x.",
    "debug": "Try + by itself, 12x, and the exact upper boundary.",
    "fill": "Which check confirms that strtol consumed the whole token?",
    "edgeCases": [
      "A sign by itself is invalid.",
      "Leading zeros are allowed.",
      "The spellings −0 and +0 normalize to 0.",
      "A valid number outside the permitted range is still invalid for the exercise."
    ],
    "revision": "Which test distinguishes valid syntax from an acceptable numeric value?",
    "further": "Accept fixed-point measurements with a decimal point and two digits after it.",
    "quiz": {
      "question": "Which token represents the valid integer 42?",
      "answers": [
        "+0042",
        "42x",
        "+ 42"
      ],
      "correct": 0,
      "feedback": "The optional sign is immediately followed by digits. The other spellings contain extra characters or a space."
    },
    "practice": {
      "title": "Check delivery codes",
      "description": "Normalize signed decimal tokens in a small range and mark invalid entries.",
      "format": "Read q, followed by q individual tokens, one per line. Print each valid value in decimal or INVALID. The optional sign must be followed by ASCII digits only.",
      "constraints": "0 ≤ q ≤ 300. Each token has 1 through 10 printable non-space ASCII characters. Valid values are from −999 through 999.",
      "input": "4\n+0042\n12x\n-999\n1000\n",
      "output": "42\nINVALID\n-999\nINVALID\n",
      "hints": [
        "Check the unusual forms + and 12x.",
        "Range validation is a separate check after syntax."
      ]
    },
    code:{
      c: `#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
static int valid_syntax(const char *cursor) {
    if (*cursor == '+' || *cursor == '-') cursor++;
    if (!*cursor) return 0;
    for (; *cursor; cursor++) {
        if (*cursor < '0' || *cursor > '9') return 0;
    }
    return 1;
}
int main(void) {
    int q;
    if (scanf("%d", &q) != 1) return 0;
    for (int i = 0; i < q; i++) {
        char token[11], *end;
        if (scanf("%10s", token) != 1) return 0;
        errno = 0;
        long value = strtol(token, &end, 10);
        if (!valid_syntax(token) || *end || errno == ERANGE || value < -999 || value > 999) {
            puts("INVALID");
        } else {
            printf("%ld\\n", value);
        }
    }
    return 0;
}`,
      python: `import re
count = int(input())
for _ in range(count):
    token = input()
    if re.fullmatch(r"[+-]?[0-9]+", token) is None:
        print("INVALID")
        continue
    value = int(token)
    print(value if -999 <= value <= 999 else "INVALID")`,
      java: `import java.util.Scanner;
import java.util.regex.Pattern;
class Main {
    public static void main(String[] args) {
        var in = new Scanner(System.in);
        int count = in.nextInt();
        var signedDecimal = Pattern.compile("[+-]?[0-9]+");
        for (int i = 0; i < count; i++) {
            String token = in.next();
            if (!signedDecimal.matcher(token).matches()) {
                System.out.println("INVALID");
                continue;
            }
            try {
                int value = Integer.parseInt(token);
                System.out.println(value >= -999 && value <= 999 ? String.valueOf(value) : "INVALID");
            } catch (NumberFormatException overflow) {
                System.out.println("INVALID");
            }
        }
    }
}`,
    },
  }
]);
