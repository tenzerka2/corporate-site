import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  // Photos are prepared 1672 px WebP files; they are served as they are.
  images: { unoptimized: true },
};

export default config;
