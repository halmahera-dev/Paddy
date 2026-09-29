import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: [
    "@paddy-field/ui",
    "@paddy-field/auth",
    "@paddy-field/env",
    "@paddy-field/db",
  ],
  images: {
    qualities: [75, 90],
  },
  devIndicators: {
    position: "bottom-right",
  },
};

export default config;
