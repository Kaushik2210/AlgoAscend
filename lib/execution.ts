import type { Language } from "./curriculum";
import type { Execution } from "./judge";
import { readJson } from "./http";

const decode = (raw: unknown) => typeof raw === "string" ? Buffer.from(raw,"base64").toString("utf8") : "";
const encode = (text: string) => Buffer.from(text,"utf8").toString("base64");

export function executionAvailable() {
  return Boolean((process.env.ALGO_RUNNER_URL && process.env.ALGO_RUNNER_TOKEN) || process.env.JUDGE0_URL || process.env.ALGO_CLOUD_SNAPSHOT);
}

export async function executeCode(source: string, language: Language, stdin: string, signal: AbortSignal): Promise<Execution> {
  const localUrl = process.env.ALGO_RUNNER_URL;
  const token = process.env.ALGO_RUNNER_TOKEN;
  if (localUrl && token) {
    const response = await fetch(localUrl, {
      method:"POST",
      headers:{"Content-Type":"application/json", Authorization:`Bearer ${token}`},
      redirect:"error",
      cache:"no-store",
      signal:AbortSignal.any([signal,AbortSignal.timeout(23_000)]),
      body:JSON.stringify({source,language,stdin}),
    });
    if (!response.ok) throw new Error("Sandbox unavailable");
    const result = await readJson(response.body,1_000_000) as Partial<Execution>;
    if (!Number.isInteger(result?.status) || typeof result.stdout !== "string" || typeof result.stderr !== "string" ||
        typeof result.compileOutput !== "string" || (result.time !== null && typeof result.time !== "string") ||
        (result.memory !== null && typeof result.memory !== "number")) throw new Error("Invalid sandbox response");
    return result as Execution;
  }

  const url = process.env.JUDGE0_URL;
  if (!url) throw new Error("Judge unavailable");
  const endpoint = new URL(url);
  endpoint.pathname = endpoint.pathname.replace(/\/$/,"") + "/submissions";
  endpoint.search = "base64_encoded=true&wait=true&fields=status,stdout,stderr,compile_output,time,memory";
  const headers: Record<string,string> = {"Content-Type":"application/json"};
  if (process.env.JUDGE0_TOKEN) headers["X-Auth-Token"] = process.env.JUDGE0_TOKEN;
  const ids: Record<Language,number> = {
    c:Number(process.env.JUDGE0_C_ID ?? 50),
    python:Number(process.env.JUDGE0_PYTHON_ID ?? 71),
    java:Number(process.env.JUDGE0_JAVA_ID ?? 62),
  };
  const result = await fetch(endpoint,{
    method:"POST",headers,redirect:"error",cache:"no-store",
    signal:AbortSignal.any([signal,AbortSignal.timeout(12_000)]),
    body:JSON.stringify({
      language_id:ids[language],source_code:encode(source),stdin:encode(stdin),
      enable_network:false,cpu_time_limit:2,wall_time_limit:5,memory_limit:language === "java" ? 262144 : 128000,
      max_processes_and_or_threads:language === "java" ? 40 : 12,max_file_size:512,
    }),
  });
  if (!result.ok) throw new Error("Judge unavailable");
  const output = await result.json();
  if (!Number.isInteger(output.status?.id)) throw new Error("Invalid judge response");
  return {
    status:output.status.id,stdout:decode(output.stdout),stderr:decode(output.stderr),
    compileOutput:decode(output.compile_output),time:typeof output.time === "string" ? output.time : null,
    memory:typeof output.memory === "number" ? output.memory : null,
  };
}
