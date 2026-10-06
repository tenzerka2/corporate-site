import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  use: {
    baseURL: process.env.ONEGA_URL || "http://127.0.0.1:3106",
    launchOptions: { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] },
  },
  reporter: "list",
});
