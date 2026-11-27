import { problems } from "./problems.ts";
import type { Language } from "./curriculum.ts";

type RequestData = {problemId: string; language: Language; source: string; mode: "run" | "submit"; stdin: string};
export type Execution = {status: number; stdout: string; stderr: string; compileOutput: string; time: string | null; memory: number | null};
type Runner = (source: string, language: Language, stdin: string) => Promise<Execution>;
type CaseResult = {label: string; verdict: string; stdout?: string; expected?: string; stderr?: string; compileOutput?: string; time?: string | null; memory?: number | null};
export type JudgeResult = {verdict: string; cases: CaseResult[]};

const verdicts: Record<number, string> = {
  3:"Executed",4:"Wrong answer",5:"Time limit exceeded",6:"Compilation error",
  7:"Runtime error",8:"Runtime error",9:"Runtime error",10:"Runtime error",
  11:"Runtime error",12:"Runtime error",13:"Judge error",14:"Runtime error",17:"Memory limit exceeded",
};

const hidden: Record<string, {stdin: string; expected: string}[]> = {
  "signal-sum":[{stdin:"-10000 10000\n",expected:"0\n"},{stdin:"-10000 -10000\n",expected:"-20000\n"}],
  "first-signal":[{stdin:"0 9\n\n",expected:"-1\n"},{stdin:"5 -2\n-2 -2 -2 -1 4\n",expected:"0\n"},{stdin:"4 3\n-1 0 2 5\n",expected:"-1\n"}],
  "repair-order":[{stdin:"1\n-9\n",expected:"-9\n"},{stdin:"6\n5 4 3 2 1 0\n",expected:"0 1 2 3 4 5\n"},{stdin:"4\n-4 -4 0 6\n",expected:"-4 -4 0 6\n"}],
};

export function validateRequest(data: unknown): RequestData | null {
  if (!data || typeof data !== "object") return null;
  const {problemId, source, language, mode, stdin} = data as Record<string, unknown>;
  if (typeof problemId !== "string" || !problems.some(problem => problem.id === problemId)) return null;
  if (language !== "c" && language !== "python" && language !== "java") return null;
  if (mode !== "run" && mode !== "submit") return null;
  if (typeof source !== "string" || !source.trim() || source.length > 20000 || typeof stdin !== "string" || stdin.length > 8192) return null;
  return {problemId, source, language, mode, stdin};
}

const normalize = (text: string) => text.trim().replace(/\r\n/g,"\n").replace(/[ \t]+$/gm,"");

export async function evaluateSubmission(request: RequestData, run: Runner): Promise<JudgeResult> {
  const problem = problems.find(item => item.id === request.problemId);
  if (!problem) throw new Error("Unknown challenge.");
  const submit = request.mode === "submit";
  const tests = submit
    ? [problem.sample, ...hidden[problem.id]]
    : [{stdin:request.stdin,expected:request.stdin === problem.sample.stdin ? problem.sample.expected : undefined}];
  const cases: CaseResult[] = [];
  for (const [index, item] of tests.entries()) {
    const output = await run(request.source, request.language, item.stdin);
    const verdict = output.status === 3 && item.expected !== undefined
      ? (normalize(output.stdout) === normalize(item.expected) ? "Accepted" : "Wrong answer")
      : verdicts[output.status] ?? "Judge error";
    if (index > 0) cases.push({label:`Hidden case ${index}`,verdict});
    else cases.push({label:submit ? "Sample case" : "Run result",verdict,stdout:output.stdout.slice(0,8000),expected:item.expected,stderr:output.stderr.slice(0,8000),compileOutput:output.compileOutput.slice(0,8000),time:output.time,memory:output.memory});
    if (verdict !== "Accepted" && verdict !== "Executed") return {verdict,cases};
  }
  return {verdict:cases[0].verdict,cases};
}
