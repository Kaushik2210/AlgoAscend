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
    await page.screenshot({path:"docs/screenshots/visual-lab.png",animations:"disabled",fullPage:true});
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
    for (const url of ["/start","/learn","/lab","/learn/binary-search","/practice","/practice/first-signal","/practice/external","/review"]) {
      await page.goto(url);
      if (url === "/practice") await page.getByText("Estimate what fits the constraints").click();
      if (url === "/practice/first-signal") await page.getByRole("button",{name:"Use plain text editor"}).click();
      const audit = await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
      expect(audit.violations,`${theme} ${url}`).toEqual([]);
    }
  }
});

test("the judge API reports an unavailable service without a fabricated result",async ({request}) => {
  const response = await request.post("/api/judge",{data:{problemId:"signal-sum",language:"c",source:"int main(void) {return 0;}",mode:"submit",stdin:""}});
  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({error:"Code execution requires a configured sandbox or Judge0 service."});
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

test("missed predictions schedule revision and keep editable notes after reload",async ({page}) => {
  await page.goto("/learn/input-output");
  await page.getByRole("radio",{name:"−11",exact:true}).check();
  await page.getByRole("button",{name:"Check prediction"}).click();
  await page.getByRole("link",{name:"Revision and mistakes"}).click();
  await expect(page.getByText("Due now")).toBeVisible();
  await page.getByLabel("Category").selectOption("Input or output");
  await page.getByLabel("Your note").fill("Add the signed integers.");
  await page.getByRole("button",{name:"Save note"}).click();
  await expect(page.getByText("Saved",{exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Your note")).toHaveValue("Add the signed integers.");
  await page.getByRole("link",{name:"Review",exact:true}).click();
  await page.getByRole("radio",{name:"3",exact:true}).check();
  await page.getByRole("button",{name:"Check prediction"}).click();
  await page.getByRole("link",{name:"Revision and mistakes"}).click();
  await expect(page.getByText(/Next review/)).toBeVisible();
});

test("external practice preserves manual completion and presents Codeforces history",async ({page,request}) => {
  await page.route("**/api/codeforces/rating?handle=learner",route => route.fulfill({json:{handle:"learner",history:[{
    contestId:123,contestName:"Practice Round",rank:42,updatedAt:1_780_000_000_000,rating:1342,delta:24,
  }]}}));
  await page.goto("/practice");
  await page.getByRole("link",{name:"Explore external practice"}).click();
  await expect(page.getByRole("link",{name:"Open on LeetCode"})).toHaveAttribute("href","https://leetcode.com/problems/binary-search/");
  const completion = page.getByRole("button",{name:"Mark Binary Search complete",exact:true});
  await completion.click();
  await expect(completion).toHaveAttribute("aria-pressed","true");
  await page.reload();
  await expect(completion).toHaveAttribute("aria-pressed","true");
  await page.getByRole("textbox",{name:"Codeforces handle"}).fill("learner");
  await page.getByRole("button",{name:"Look up handle"}).click();
  await expect(page.getByText("learner · Latest rating 1342")).toBeVisible();
  await expect(page.getByRole("link",{name:"Practice Round"})).toHaveAttribute("href","https://codeforces.com/contest/123");
  const invalid = await request.get("/api/codeforces/rating?handle=not%3Bvalid");
  expect(invalid.status()).toBe(400);
});

test("running totals trace signed input and lead to a practice problem",async ({page}) => {
  await page.goto("/learn/running-total");
  await page.getByLabel("Array values").fill("4, -8, 3, 1");
  await page.getByRole("button",{name:"Apply input"}).click();
  await page.getByRole("button",{name:"Next step"}).click();
  await page.getByRole("button",{name:"Next step"}).click();
  await expect(page.getByText("Add 4 to get a running total of 4.")).toBeVisible();
  await page.getByLabel("Timeline").fill("9");
  await expect(page.getByText("Every value has been counted. The final total is 0.")).toBeVisible();
  await page.getByRole("link",{name:"Practice this concept"}).click();
  await expect(page.getByRole("heading",{name:"Rolling Sensor Total"})).toBeVisible();
});

test("Pattern Detective explains counterexamples and remembers solved cases",async ({page}) => {
  await page.goto("/practice");
  await page.getByRole("link",{name:"Open Pattern Detective"}).click();
  await page.getByRole("button",{name:"The balancing window",exact:true}).click();
  await page.getByRole("radio",{name:"Shrink the left side whenever the sum exceeds the target"}).check();
  await page.getByRole("button",{name:"Check approach"}).click();
  await expect(page.getByText("A negative value can bring an oversized sum back down.",{exact:false})).toBeVisible();
  await page.getByRole("radio",{name:"Track the earliest index of each cumulative total"}).check();
  await page.getByRole("button",{name:"Check approach"}).click();
  await expect(page.getByText("That approach fits")).toBeVisible();
  await expect(page.getByText("1 of 3 solved")).toBeVisible();
  await page.reload();
  await expect(page.getByText("1 of 3 solved")).toBeVisible();
  for (const theme of ["light","dark"] as const) {
    await page.emulateMedia({colorScheme:theme});
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze()).violations).toEqual([]);
  }
});

test("challenge editorials stay collapsed until requested and link to tested examples",async ({page}) => {
  await page.setViewportSize({width:375,height:850});
  await page.emulateMedia({colorScheme:"dark",reducedMotion:"reduce"});
  await page.goto("/practice/first-signal");
  await expect(page.getByRole("heading",{name:"Why it works"})).toBeHidden();
  await page.getByText("Reveal the approach").click();
  await expect(page.getByRole("heading",{name:"Why it works"})).toBeVisible();
  await expect(page.getByText("An empty array.",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Use plain text editor"}).click();
  expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("link",{name:"See the C, Python, and Java examples"}).click();
  await expect(page).toHaveURL(/\/learn\/binary-search#implementation$/);
  await expect(page.getByRole("heading",{name:"From pseudocode to implementation"})).toBeVisible();
});

test("a learner steps through a worked example and opens its matching challenge",async ({page}) => {
  await page.setViewportSize({width:390,height:850});
  await page.goto("/learn/binary-representation");
  const trace = page.getByRole("heading",{name:"Trace the example"}).locator("..");
  await expect(trace.getByText("Step 1 of 4")).toBeVisible();
  await trace.getByRole("button",{name:"Next step"}).click();
  await expect(trace.getByText("10 | value = 2",{exact:true})).toBeVisible();
  await trace.getByRole("button",{name:"Previous step"}).click();
  await expect(trace.getByText("Step 1 of 4")).toBeVisible();
  for (const theme of ["light","dark"] as const) {
    await page.emulateMedia({colorScheme:theme,reducedMotion:"reduce"});
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze()).violations).toEqual([]);
  }
  await page.getByRole("link",{name:"Practice this concept"}).click();
  await expect(page.getByRole("heading",{name:"Decode a binary word"})).toBeVisible();
});

test("interview rehearsal starts a timer and keeps separate behavioral drafts", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.clock.install({time: new Date("2026-01-01T09:00:00Z")});
  await page.goto("/learn");
  await page.getByRole("link", {name: "Interview rehearsal"}).click();
  await expect(page.getByRole("heading", {name: "Rehearse your interview."})).toBeVisible();
  const challenge = page.getByRole("link", {name: "Coding mock: longest unique substring"});
  await expect(challenge).toHaveAttribute("href", "/practice/interview-unique-window-practice");
  await expect(challenge).toHaveAttribute("target", "_blank");
  const timer = page.getByRole("timer", {name: "Time remaining"});
  await expect(timer).toHaveText("30:00");
  await page.getByRole("button", {name: "Start timer"}).click();
  await page.clock.fastForward(2000);
  await expect(timer).toHaveText("29:58");
  await page.getByRole("button", {name: "Pause timer"}).click();
  await page.clock.fastForward(3000);
  await expect(timer).toHaveText("29:58");
  await page.getByRole("button", {name: "Reset timer"}).click();
  await page.getByLabel("Rehearsal format").selectOption("behavioral");
  await expect(timer).toHaveText("02:00");
  const draft = page.getByRole("textbox", {name: "Your practice notes"});
  await draft.fill("I documented the failed release and coordinated the rollback.");
  await page.getByLabel("Behavioral prompt").selectOption("feedback");
  await expect(draft).toHaveValue("");
  await page.getByLabel("Behavioral prompt").selectOption("setback");
  await expect(draft).toHaveValue("I documented the failed release and coordinated the rollback.");
  await page.getByRole("button", {name: "Start timer"}).click();
  await page.clock.fastForward(120_010);
  await expect(timer).toHaveText("00:00");
  await expect(page.getByRole("status")).toHaveText("Time is up. Review your response.");
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({colorScheme: theme, reducedMotion: "reduce"});
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze()).violations).toEqual([]);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
