import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 3004 --strictPort",
    url: "http://127.0.0.1:3004",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:3004",
      },
    },
  ],
  use: {
    baseURL: "http://127.0.0.1:3004",
    headless: true,
    trace: "on-first-retry",
  },
  reporter: [["list"]],
});
