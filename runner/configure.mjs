import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";

const file = ".env.local";
const existing = await readFile(file,"utf8").catch(error => {
  if (error.code === "ENOENT") return "";
  throw error;
});
const env = parseEnv(existing);
const port = Number(process.env.ALGO_RUNNER_PORT || env.ALGO_RUNNER_PORT || "2359");
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid ALGO_RUNNER_PORT.");
if (env.ALGO_RUNNER_TOKEN && env.ALGO_RUNNER_TOKEN.length < 32) throw new Error("Use an ALGO_RUNNER_TOKEN of at least 32 characters.");

const defaults = {
  ALGO_RUNNER_URL: `http://127.0.0.1:${port}/execute`,
  ALGO_RUNNER_TOKEN: randomBytes(32).toString("hex"),
};
let next = existing;
for (const [key,value] of Object.entries(defaults)) {
  if (env[key]) continue;
  const assignment = new RegExp(`^[ \\t]*(?:export[ \\t]+)?${key}[ \\t]*=[^\\r\\n]*`, "gm");
  const placeholder = [...next.matchAll(assignment)].at(-1);
  if (placeholder) {
    next = next.slice(0,placeholder.index) + `${key}=${value}` + next.slice(placeholder.index + placeholder[0].length);
  } else {
    next += `${next && !next.endsWith("\n") ? "\n" : ""}${key}=${value}\n`;
  }
}
if (next !== existing) await writeFile(file,next,{encoding:"utf8",mode:0o600});
process.stdout.write("Local sandbox configuration is ready in .env.local.\n");
