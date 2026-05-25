import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Avoid picking C:\Users\User\package-lock.json as monorepo root
  outputFileTracingRoot: projectRoot,
  // API routes only — do not externalize next-auth/react (breaks SessionProvider prerender)
  serverExternalPackages: ["bcryptjs"],
  // Reduces dev-only SegmentViewNode noise when .next cache is mid-rebuild (Next 15.5+)
  devIndicators: false,
  webpack: (config, { dev }) => {
    // Windows: webpack pack cache rename races → ENOENT / undefined module 'call'
    if (dev && process.platform === "win32") {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
