import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { dockerPath } from "./docker.mjs";
import { imageName, parseJob, runSandbox } from "./sandbox.mjs";

const docker = dockerPath();
const token = process.env.ALGO_RUNNER_TOKEN;
const port = Number(process.env.ALGO_RUNNER_PORT ?? 2359);
if (!token || token.length < 32) throw new Error("Set an ALGO_RUNNER_TOKEN of at least 32 characters.");
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid ALGO_RUNNER_PORT.");
const authorization = Buffer.from(`Bearer ${token}`);
let active = 0;

function json(response, status, body) {
  response.writeHead(status, {"Content-Type":"application/json", "Cache-Control":"no-store"});
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const parts = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 192000) throw new Error("Request too large.");
    parts.push(chunk);
  }
  return JSON.parse(Buffer.concat(parts).toString("utf8"));
}

const server = createServer({ requestTimeout:10000, headersTimeout:5000 }, async (request, response) => {
  if (request.method !== "POST" || request.url !== "/execute") return json(response,404,{error:"Not found."});
  const provided = Buffer.from(request.headers.authorization ?? "");
  if (provided.length !== authorization.length || !timingSafeEqual(provided, authorization)) return json(response,401,{error:"Unauthorized."});
  if (!request.headers["content-type"]?.startsWith("application/json")) return json(response,415,{error:"Expected JSON."});
  if (active >= 2) return json(response,429,{error:"The sandbox is busy."});

  active++;
  try {
    const job = parseJob(await readBody(request).catch(() => null));
    if (!job) return json(response,400,{error:"Invalid source, language, or input."});
    return json(response,200,await runSandbox(job, docker, imageName));
  } catch {
    return json(response,502,{error:"The sandbox could not complete the job."});
  } finally {
    active--;
  }
});

server.listen(port, "127.0.0.1", () => process.stdout.write(`AlgoAscend sandbox listening on 127.0.0.1:${port}\n`));
