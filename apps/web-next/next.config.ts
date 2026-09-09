import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@tigris/ui", "@tigris/auth", "@tigris/env", "@tigris/db"],
  devIndicators: {
    position: "bottom-right",
  },
};

export default config;
