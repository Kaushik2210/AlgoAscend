import { expect, test } from "@playwright/test";

const programs = {
  c: '#include <stdio.h>\nint main(void) { int a,b; if (scanf("%d %d",&a,&b)!=2) return 1; printf("%d\\n",a+b); return 0; }',
  python: "a,b=map(int,input().split())\nprint(a+b)",
  java: "import java.util.Scanner; public class Main { public static void main(String[] args) { Scanner in = new Scanner(System.in); System.out.println(in.nextInt()+in.nextInt()); } }",
};

test.describe("live code execution", () => {
  test.skip(process.env.ALGO_LIVE_EXECUTION !== "1", "Requires the local Docker runner.");

  test("runs custom input and submits from the workspace in C, Python, and Java", async ({page}) => {
    await page.goto("/practice/signal-sum");
    await page.getByRole("button",{name:"Use plain text editor"}).click();
    for (const [language,source] of Object.entries(programs)) {
      await page.getByLabel("Workspace language").selectOption(language);
      await page.getByRole("textbox",{name:"Source code"}).fill(source);
      await page.getByLabel("Custom input").fill("12 -5\n");
      await page.getByRole("button",{name:"Run code"}).click();
      await expect(page.getByRole("heading",{name:"Executed",exact:true})).toBeVisible({timeout:15_000});
      await page.getByText("Run result · Executed",{exact:true}).click();
      await expect(page.locator(".results pre")).toHaveText("7");
      await page.getByRole("button",{name:"Submit code"}).click();
      await expect(page.getByRole("heading",{name:"Accepted",exact:true})).toBeVisible({timeout:20_000});
      await expect(page.getByText("Hidden case 2 · Accepted",{exact:true})).toBeVisible();
    }
  });

  test("reports compilation, runtime, time, memory, and output errors from actual programs", async ({request}) => {
    const scenarios = [
      {language:"c",source:"int main( {",verdict:"Compilation error"},
      {language:"python",source:"if:",verdict:"Compilation error"},
      {language:"java",source:"public class Main {",verdict:"Compilation error"},
      {language:"python",source:"raise ValueError('sample runtime error')",verdict:"Runtime error"},
      {language:"python",source:"while True:\n    pass",verdict:"Time limit exceeded"},
      {language:"python",source:"items = bytearray(320 * 1024 * 1024)\nprint(len(items))",verdict:"Memory limit exceeded"},
      {language:"python",source:"print(0)",verdict:"Wrong answer"},
    ];
    for (const {language,source,verdict} of scenarios) {
      const response = await request.post("/api/judge",{data:{language,source,problemId:"signal-sum",mode:"run",stdin:"2 3\n"}});
      expect(response.ok(),`${language} ${verdict}`).toBe(true);
      const result = await response.json();
      expect(result.verdict,language).toBe(verdict);
      if (verdict === "Compilation error") expect(result.cases[0].compileOutput).toBeTruthy();
    }
  });

  test("starts jobs with only the loopback interface and a read-only root", async ({request}) => {
    const response = await request.post("/api/judge",{data:{
      language:"python",problemId:"signal-sum",mode:"run",stdin:"",
      source:"import os, socket\nprint(','.join(name for _, name in socket.if_nameindex()))\nprint(bool(os.statvfs('/').f_flag & os.ST_RDONLY))",
    }});
    expect(response.ok()).toBe(true);
    const result = await response.json();
    expect(result.verdict).toBe("Executed");
    expect(result.cases[0].stdout).toBe("lo\nTrue\n");
  });
});
