import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

test("guest can choose a language, complete a prediction, and resume progress", async ({page}) => {
  await page.goto("/");
  await page.getByRole("link",{name:"Python",exact:true}).click();
  await expect(page.getByLabel("Primary language")).toHaveValue("python");
  await page.getByLabel("Primary language").selectOption("java");
  await page.getByRole("button",{name:"Open my roadmap"}).click();
  await expect(page.getByText("Java · Programming fundamentals · 15 min/day")).toBeVisible();
  await page.getByRole("link",{name:"Open lesson"}).click();
  await expect(page.getByLabel("Implementation language")).toHaveValue("java");
  await page.getByRole("radio",{name:"3",exact:true}).check();
  await page.getByRole("button",{name:"Check prediction"}).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await page.getByRole("link",{name:"Practice this concept"}).click();
  await expect(page.getByRole("heading",{name:"Signal Sum"})).toBeVisible();
  await expect(page.getByLabel("Workspace language")).toHaveValue("java");
  await expect(page.locator(".monaco-editor")).toBeVisible();
  await page.getByRole("button",{name:"Use plain text editor"}).click();
  await page.getByRole("textbox",{name:"Source code"}).fill("// My Java draft");
  await page.reload();
  await page.getByRole("button",{name:"Use plain text editor"}).click();
  await expect(page.getByRole("textbox",{name:"Source code"})).toHaveValue("// My Java draft");
  await page.getByRole("button",{name:"Reveal a hint"}).click();
  await expect(page.getByText("Ask what comes in and what should go out.")).toBeVisible();
  await page.getByRole("button",{name:"Focus mode",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Problem statement"})).toHaveCount(0);
  await page.getByRole("button",{name:"Exit focus mode"}).click();
  await expect(page.getByRole("heading",{name:"Problem statement"})).toBeVisible();
});

test("lab rejects unsorted input and steps through a valid search",async ({page}) => {
  await page.goto("/lab");
  await page.getByLabel("Array values").fill("8, 2, 4");
  await page.getByRole("button",{name:"Apply input"}).click();
  await expect(page.getByRole("alert").filter({hasText:"Binary search needs"})).toContainText("sorted");
  await page.getByLabel("Array values").fill("2, 4, 8");
  await page.getByLabel("Target",{exact:true}).fill("4");
  await page.getByRole("button",{name:"Apply input"}).click();
  await expect(page.getByRole("heading",{name:"Algorithm Battle"})).toBeVisible();
  await expect(page.getByText("Both searches return index 1.",{exact:false})).toBeVisible();
  await page.getByRole("button",{name:"Next step"}).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Compare a[1] = 4 with target 4.")).toBeVisible();
  await page.getByRole("button",{name:"Previous step"}).click();
  await expect(page.getByText("Start with the whole sorted array.")).toBeVisible();
  await page.getByRole("combobox",{name:"Algorithm",exact:true}).selectOption("bubble");
  await expect(page.getByText("Start with the full unsorted array.")).toBeVisible();
  if (process.env.ALGO_SCREENSHOTS) {
    await page.getByRole("combobox",{name:"Algorithm",exact:true}).selectOption("binary");
    await page.getByRole("button",{name:"Next step"}).click();
    await page.setViewportSize({width:1440,height:1160});
    await mkdir("docs/screenshots",{recursive:true});
    await page.evaluate(() => window.scrollTo(0,0));
    await page.screenshot({path:"docs/screenshots/visual-lab.png",animations:"disabled"});
  }
});

for (const width of [375,768,1440]) {
  test(`landing renders without overflow and passes axe at ${width}px`,async ({page}) => {
    await page.emulateMedia({colorScheme:width === 768 ? "light" : "dark",reducedMotion:"reduce"});
    await page.setViewportSize({width,height:width === 375 ? 850 : 1000});
    const errors: string[] = [];
    page.on("pageerror",error => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading",{level:1})).toHaveText(/Learn to think\s*in algorithms\./);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze()).violations).toEqual([]);
    await page.getByRole("button",{name:"Next step"}).click();
    await expect(page.getByText("38 is too small. Keep the right half.")).toBeVisible();
    expect(errors).toEqual([]);
    if (process.env.ALGO_SCREENSHOTS) {
      await mkdir("docs/screenshots",{recursive:true});
      await page.getByRole("button",{name:"Previous step"}).click();
      await page.evaluate(() => window.scrollTo(0,0));
      await page.screenshot({path:`docs/screenshots/home-${width}.png`,animations:"disabled"});
    }
  });
}

test("onboarding, lab, lessons and workspace have accessible names in both themes",async ({page}) => {
  for (const theme of ["light","dark"] as const) {
    await page.emulateMedia({colorScheme:theme,reducedMotion:"reduce"});
    for (const url of ["/start","/learn","/lab","/learn/binary-search","/practice","/practice/first-signal"]) {
      await page.goto(url);
      if (url === "/practice") await page.getByText("Estimate what fits the constraints").click();
      if (url.startsWith("/practice/")) await page.getByRole("button",{name:"Use plain text editor"}).click();
      const audit = await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
      expect(audit.violations,`${theme} ${url}`).toEqual([]);
    }
  }
});

test("the judge API reports an unavailable service without a fabricated result",async ({request}) => {
  const response = await request.post("/api/judge",{data:{problemId:"signal-sum",language:"c",source:"int main(void) {return 0;}",mode:"submit",stdin:""}});
  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({error:"Code execution requires a configured Judge0 service."});
});

test("learners can compare complexity and use authored hints without a provider",async ({page,request}) => {
  await page.goto("/practice");
  await page.getByText("Estimate what fits the constraints").click();
  await expect(page.getByRole("row",{name:/O\(n²\).*Exceeds/})).toBeVisible();
  await page.getByLabel("Input size").fill("10");
  await page.getByRole("button",{name:"Update estimates"}).click();
  await expect(page.getByRole("row",{name:/O\(n²\).*Fits/})).toBeVisible();
  const result = await request.post("/api/mentor",{data:{problemId:"first-signal",language:"python",mode:"hint",question:"What does the midpoint tell me?"}});
  expect(result.status()).toBe(503);
  expect(await result.json()).toEqual({error:"AlgoMentor is unavailable. Use the authored hints in the workspace."});
});
