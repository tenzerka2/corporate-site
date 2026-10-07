import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  // Photos are prepared 1672 px WebP files; they are served as they are.
  images: { unoptimized: true },
};

export default config;
