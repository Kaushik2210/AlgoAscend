import { randomBytes } from "node:crypto";
import { appendFile, readFile } from "node:fs/promises";
import { parseEnv } from "node:util";

const file = ".env.local";
const existing = await readFile(file,"utf8").catch(error => {
  if (error.code === "ENOENT") return "";
  throw error;
});
const env = parseEnv(existing);
const port = env.ALGO_RUNNER_PORT || "2359";
const values = {
  ALGO_RUNNER_URL: `http://127.0.0.1:${port}/execute`,
  ALGO_RUNNER_TOKEN: randomBytes(32).toString("hex"),
};
const missing = Object.entries(values).filter(([key]) => !Object.hasOwn(env,key));
if (env.ALGO_RUNNER_URL === "" || (Object.hasOwn(env,"ALGO_RUNNER_TOKEN") && env.ALGO_RUNNER_TOKEN.length < 32)) {
  throw new Error("Existing local sandbox settings are incomplete. Update ALGO_RUNNER_URL and ALGO_RUNNER_TOKEN in .env.local.");
}
if (missing.length) {
  const lines = missing.map(([key,value]) => `${key}=${value}`).join("\n");
  await appendFile(file,`${existing && !existing.endsWith("\n") ? "\n" : ""}${lines}\n`,{encoding:"utf8",mode:0o600});
}
process.stdout.write("Local sandbox configuration is ready in .env.local.\n");
