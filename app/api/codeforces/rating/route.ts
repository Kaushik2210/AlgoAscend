import { readJson } from "@/lib/http";
import { normalizeHandle, readRatingHistory } from "@/lib/codeforces";
import type { RatingEntry } from "@/lib/codeforces";

const cache = new Map<string,{history: RatingEntry[]; expiresAt: number}>();
let nextRequestAt = 0;

const fail = (error: string,status: number) => Response.json({error},{status});

export async function GET(request: Request) {
  const handle = normalizeHandle(new URL(request.url).searchParams.get("handle"));
  if (!handle) return fail("Enter a valid Codeforces handle.",400);
  const now = Date.now();
  const hit = cache.get(handle);
  if (hit && hit.expiresAt > now) return Response.json({handle,history:hit.history});
  if (now < nextRequestAt) return fail("Codeforces limits requests. Try again in a few seconds.",429);
  nextRequestAt = now + 2100;

  try {
    const url = new URL("https://codeforces.com/api/user.rating");
    url.searchParams.set("handle",handle);
    const response = await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8000),redirect:"error"});
    if (response.status === 429) return fail("Codeforces limits requests. Try again in a few seconds.",429);
    if (!response.ok && response.status !== 400) throw new Error("Codeforces unavailable");
    const data = await readJson(response.body,512_000);
    const history = readRatingHistory(data);
    if (!history) {
      const comment = (data as {comment?: unknown} | null)?.comment;
      if (typeof comment === "string" && /not found/i.test(comment)) return fail("Codeforces could not find this handle.",404);
      if (typeof comment === "string" && /limit/i.test(comment)) return fail("Codeforces limits requests. Try again in a few seconds.",429);
      throw new Error("Codeforces response unavailable");
    }

    if (cache.size >= 128) {
      const oldest = cache.keys().next().value;
      if (oldest) cache.delete(oldest);
    }
    cache.set(handle,{history,expiresAt:now+600_000});
    return Response.json({handle,history});
  } catch {
    return fail("The Codeforces API could not be reached. The practice links are still available.",502);
  }
}
