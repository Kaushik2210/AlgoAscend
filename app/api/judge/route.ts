import { evaluateSubmission, validateRequest } from "@/lib/judge";
import type { Language } from "@/lib/curriculum";

export const runtime = "nodejs";
let active = 0;
let windowStart = 0;
let requests = 0;

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return JSON.parse(text + decoder.decode());
    size += value.byteLength;
    if (size > 96_000) {
      await reader.cancel();
      throw new Error("Request too large");
    }
    text += decoder.decode(value,{stream:true});
  }
}

const failure = (error: string,status: number) => Response.json({error},{status});
const decode = (raw: unknown) => typeof raw === "string" ? Buffer.from(raw,"base64").toString("utf8").slice(0,8000) : "";
const encode = (text: string) => Buffer.from(text,"utf8").toString("base64");

export async function POST(request: Request) {
  const url = process.env.JUDGE0_URL;
  if (!url) return failure("Code execution requires a configured Judge0 service.",503);
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
    const input = validateRequest(await readBody(request).catch(() => null));
    if (!input) return failure("Check the challenge, language, source and input size.",400);
    const endpoint = new URL(url);
    endpoint.pathname = endpoint.pathname.replace(/\/$/,"") + "/submissions";
    endpoint.search = "base64_encoded=true&wait=true&fields=status,stdout,stderr,compile_output,time,memory";
    const headers: Record<string,string> = {"Content-Type":"application/json"};
    if (process.env.JUDGE0_TOKEN) headers["X-Auth-Token"] = process.env.JUDGE0_TOKEN;
    const ids: Record<Language,number> = {
      c:Number(process.env.JUDGE0_C_ID ?? 50),python:Number(process.env.JUDGE0_PYTHON_ID ?? 71),java:Number(process.env.JUDGE0_JAVA_ID ?? 62),
    };
    return Response.json(await evaluateSubmission(input, async (source,language,stdin) => {
      const result = await fetch(endpoint,{
        method:"POST",headers,redirect:"error",cache:"no-store",
        signal:AbortSignal.any([request.signal,AbortSignal.timeout(12_000)]),
        body:JSON.stringify({language_id:ids[language],source_code:encode(source),stdin:encode(stdin),enable_network:false,cpu_time_limit:2,wall_time_limit:5,memory_limit:language === "java" ? 262144 : 128000,max_processes_and_or_threads:language === "java" ? 40 : 12,max_file_size:512}),
      });
      if (!result.ok) throw new Error("Judge unavailable");
      const output = await result.json();
      if (!Number.isInteger(output.status?.id)) throw new Error("Invalid judge response");
      return {status:output.status.id,stdout:decode(output.stdout),stderr:decode(output.stderr),compileOutput:decode(output.compile_output),time:typeof output.time === "string" ? output.time : null,memory:typeof output.memory === "number" ? output.memory : null};
    }));
  } catch {
    return failure("The execution service did not return a result. Try again in a moment.",502);
  } finally {
    active--;
  }
}
