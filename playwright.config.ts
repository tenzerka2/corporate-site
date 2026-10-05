import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.ONEGA_TEST_URL || "http://127.0.0.1:3106",
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH,
      args: ["--no-sandbox"],
    },
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/browser-results.json" }],
  ],
});
