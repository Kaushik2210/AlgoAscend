import { evaluateSubmission, validateRequest } from "@/lib/judge";
import { executeCode, executionAvailable } from "@/lib/execution";
import { readJson } from "@/lib/http";

export const runtime = "nodejs";
let active = 0;
let windowStart = 0;
let requests = 0;

const failure = (error: string,status: number) => Response.json({error},{status});

export async function POST(request: Request) {
  if (!executionAvailable()) return failure("Code execution requires a configured sandbox or Judge0 service.",503);
  if (request.headers.get("sec-fetch-site") === "cross-site" || !request.headers.get("content-type")?.startsWith("application/json")) return failure("Expected same-origin JSON.",415);
  const now = Date.now();
  if (now - windowStart >= 60_000) {
    windowStart = now;
    requests = 0;
  }
  if (active >= 2 || requests >= 16) return failure("The judge is busy. Try again in a minute.",429);
  active++;
  requests++;
  try {
    const input = validateRequest(await readJson(request.body,192_000).catch(() => null));
    if (!input) return failure("Check the challenge, language, source and input size.",400);
    return Response.json(await evaluateSubmission(input,(source,language,stdin) => executeCode(source,language,stdin,request.signal)));
  } catch {
    return failure("The execution service did not return a result. Try again in a moment.",502);
  } finally {
    active--;
  }
}
