import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir:"./tests/browser",
  timeout:60_000,
  use:{baseURL:"http://127.0.0.1:3100",channel:process.env.ALGO_TEST_BROWSER,trace:"retain-on-failure"},
  webServer:{
    command:"npm run start -- --hostname 127.0.0.1 --port 3100",
    url:"http://127.0.0.1:3100",
    reuseExistingServer:!process.env.CI,
    timeout:60_000,
    env:process.env.ALGO_LIVE_EXECUTION === "1" ? undefined : {ALGO_RUNNER_URL:"",ALGO_CLOUD_SNAPSHOT:"",JUDGE0_URL:"",MENTOR_CHAT_URL:""},
  },
});
