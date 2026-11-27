import assert from "node:assert/strict";

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
const sourceCode = {
  c:'#include <stdio.h>\nint main(void) { int a,b; if (scanf("%d %d",&a,&b)!=2) return 1; printf("%d\\n",a+b); return 0; }',
  python:"a,b=map(int,input().split())\nprint(a+b)",
  java:"import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner in = new Scanner(System.in); System.out.println(in.nextInt()+in.nextInt()); } }",
};

async function json(path,options) {
  const response = await fetch(new URL(path,origin), {signal:AbortSignal.timeout(75_000),...options});
  const body = await response.text();
  assert.ok(response.ok,`${path} returned HTTP ${response.status}.`);
  return JSON.parse(body);
}

async function judge(language,source,mode,stdin) {
  return json("/api/judge",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({language,source,mode,stdin,problemId:"signal-sum"}),
  });
}

const health = await json("/api/health");
assert.equal(health.status,"ok");
assert.equal(health.executionConfigured,true);
if (process.env.ALGO_EXPECTED_REVISION) assert.equal(health.revision,process.env.ALGO_EXPECTED_REVISION);
process.stdout.write(`Deployment healthy${health.revision ? ` at ${health.revision.slice(0,7)}` : ""}.\n`);

for (const [language,source] of Object.entries(sourceCode)) {
  const run = await judge(language,source,"run","12 -5\n");
  assert.equal(run.verdict,"Executed",language);
  assert.equal(run.cases[0].stdout,"7\n",language);

  const submission = await judge(language,source,"submit","");
  assert.equal(submission.verdict,"Accepted",language);
  assert.equal(submission.cases.length,3,language);
  assert.deepEqual(submission.cases.slice(1),[
    {label:"Hidden case 1",verdict:"Accepted"},
    {label:"Hidden case 2",verdict:"Accepted"},
  ],language);
  process.stdout.write(`${language}: custom stdout and hidden-case submission verified.\n`);
}

const isolation = await judge("python","import os, socket\nprint(','.join(name for _, name in socket.if_nameindex()))\nprint(bool(os.statvfs('/').f_flag & os.ST_RDONLY))","run","");
assert.equal(isolation.verdict,"Executed");
assert.equal(isolation.cases[0].stdout,"lo\nTrue\n");
process.stdout.write("Execution sandbox has a read-only root and loopback-only networking.\n");
