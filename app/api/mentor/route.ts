import { readJson } from "@/lib/http";
import { mentorMessages, parseMentorQuestion } from "@/lib/mentor";

export const runtime = "nodejs";
let used = 0;
let start = 0;
let active = 0;
const error = (message: string, status: number) => Response.json({error:message},{status});

export async function POST(request: Request) {
  const {MENTOR_CHAT_URL,MENTOR_MODEL,MENTOR_API_KEY} = process.env;
  if (!MENTOR_CHAT_URL || !MENTOR_MODEL) return error("AlgoMentor is unavailable. Use the authored hints in the workspace.",503);
  if (request.headers.get("sec-fetch-site") === "cross-site" || !request.headers.get("content-type")?.startsWith("application/json")) return error("Expected same-origin JSON.",415);

  const now = Date.now();
  if (now - start >= 60_000) {
    start = now;
    used = 0;
  }
  if (used >= 12 || active >= 2) return error("AlgoMentor is busy. Try again in a minute.",429);
  active++;
  used++;
  try {
    const question = parseMentorQuestion(await readJson(request.body,12_000).catch(() => null));
    if (!question) return error("Choose a teaching mode and enter a question under 1,200 characters.",400);
    const headers: Record<string,string> = {"Content-Type":"application/json"};
    if (MENTOR_API_KEY) headers.Authorization = `Bearer ${MENTOR_API_KEY}`;
    const response = await fetch(MENTOR_CHAT_URL,{
      method:"POST",headers,redirect:"error",cache:"no-store",
      signal:AbortSignal.any([request.signal,AbortSignal.timeout(20_000)]),
      body:JSON.stringify({model:MENTOR_MODEL,messages:mentorMessages(question),max_completion_tokens:600}),
    });
    if (!response.ok) throw new Error("Mentor unavailable");
    const data = await response.json();
    const answer: unknown = data.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) throw new Error("Empty mentor reply");
    return Response.json({answer:answer.trim().slice(0,3000)});
  } catch {
    return error("AlgoMentor could not respond. Try again or use the authored hints.",502);
  } finally {
    active--;
  }
}
