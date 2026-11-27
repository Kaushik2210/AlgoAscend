import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { parseEnv } from "node:util";

test("local setup fills template placeholders while preserving custom settings and tokens", async () => {
  const directory = await mkdtemp(join(tmpdir(),"algoascend-config-"));
  const file = join(directory,".env.local");
  const script = fileURLToPath(new URL("../runner/configure.mjs",import.meta.url));
  try {
    await writeFile(file,"ALGO_RUNNER_URL=\nALGO_RUNNER_TOKEN=\nALGO_RUNNER_PORT=2367\nOTHER_CONFIG=kept\n");
    execFileSync(process.execPath,[script],{cwd:directory});
    const current = await readFile(file,"utf8");
    const env = parseEnv(current);
    assert.equal(env.ALGO_RUNNER_URL,"http://127.0.0.1:2367/execute");
    assert.match(env.ALGO_RUNNER_TOKEN ?? "",/^[a-f0-9]{64}$/);
    assert.equal(env.OTHER_CONFIG,"kept");
    execFileSync(process.execPath,[script],{cwd:directory});
    assert.equal(await readFile(file,"utf8"),current);
  } finally {
    await unlink(file);
    await rmdir(directory);
  }
});
