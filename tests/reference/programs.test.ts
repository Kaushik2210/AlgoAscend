import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { lessons } from "../../lib/curriculum.ts";

const python = process.platform === "win32" ? "python" : "python3";
const windows = process.platform === "win32";

function run(command: string, args: string[], cwd: string, input?: string) {
  const result = spawnSync(command,args,{cwd,input,encoding:"utf8",timeout:30_000,windowsHide:true});
  assert.ifError(result.error);
  assert.equal(result.status,0,`${command} failed: ${result.stderr}\n${result.stdout}`);
  return result.stdout.replace(/\r\n/g,"\n");
}

const suffix = {
  "binary-search": {
    c:'\n#include <stdio.h>\nint main(void) {\nint a[] = {-7, -2, -2, -2, 6};\nprintf("%d %d %d\\n", first_index(a, 5, -2), first_index(a, 5, 3), first_index(a, 0, 3));\nreturn 0;\n}',
    python:'\na = [-7, -2, -2, -2, 6]\nprint(first_index(a, -2), first_index(a, 3), first_index([], 3))',
    java:'\npublic static void main(String[] args) {\nint[] a = {-7, -2, -2, -2, 6};\nSystem.out.println(firstIndex(a, -2) + " " + firstIndex(a, 3) + " " + firstIndex(new int[0], 3));\n}',
    expected:"1 -1 -1\n",
  },
  "bubble-sort": {
    c:'\n#include <stdio.h>\nint main(void) {\nint a[] = {7, -2, 7, 2, 0};\nbubble_sort(a, 5);\nfor (int i=0; i<5; i++) printf("%d%s", a[i], i == 4 ? "\\n" : " ");\nreturn 0;\n}',
    python:'\na = [7, -2, 7, 2, 0]\nbubble_sort(a)\nprint(*a)',
    java:'\npublic static void main(String[] args) {\nint[] a = {7, -2, 7, 2, 0};\nbubbleSort(a);\nfor (int i=0; i<a.length; i++) System.out.print(a[i] + (i == a.length - 1 ? "\\n" : " "));\n}',
    expected:"-2 0 2 7 7\n",
  },
};

for (const language of ["c","python","java"] as const) {
  test(`${language} lesson references produce the expected output`,async () => {
    const tempRoot = resolve(tmpdir());
    const directory = await mkdtemp(join(tempRoot,"algoascend-reference-"));
    try {
      for (const lesson of lessons) {
        const wrapper = suffix[lesson.id as keyof typeof suffix];
        const file = language === "python" ? "main.py" : language === "java" ? "Main.java" : "main.c";
        const sample = wrapper ? undefined : lesson.id === "running-total" ? "4\n4 -8 3 1\n" : "-3 5\n";
        let code = lesson.code[language];
        if (wrapper) code = language === "java" ? `public class Main {\n${code}${wrapper.java}\n}` : code + wrapper[language];
        await writeFile(join(directory,file),code);
        const executable = join(directory,windows ? "main.exe" : "main");
        if (language === "c") {
          run(windows ? "cl" : "cc",windows ? ["/nologo","/TC",file,"/Femain.exe"] : ["-std=c11","-Wall","-Wextra","-Werror",file,"-o",executable],directory);
        }
        if (language === "java") run("javac",[file],directory);
        const output = language === "python" ? run(python,[file],directory,sample) :
          language === "java" ? run("java",["-cp",directory,"Main"],directory,sample) :
          run(executable,[],directory,sample);
        assert.equal(output,wrapper?.expected ?? (lesson.id === "running-total" ? "4 -4 -1 0\n" : "2\n"),lesson.title);
      }
    } finally {
      assert.equal(dirname(directory),tempRoot);
      await rm(directory,{recursive:true,force:true});
    }
  });
}
