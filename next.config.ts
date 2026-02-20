import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Turbopack is the default bundler in Next.js 16
  // Adding an empty turbopack config to acknowledge it
  turbopack: {},
  // Server external packages that should not be bundled
  serverExternalPackages: ["pdf-parse", "tesseract.js"],
};

export default nextConfig;
