import type { NextConfig } from "next";

// GitHub Pages project sites are served under /<repo-name>/ ; configure-pages does not
// patch next.config.ts, so we set this explicitly for production deploys (see workflow).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath } : {}),
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.1.131"],
};

export default nextConfig;
