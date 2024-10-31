import { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["oslo", "better-sqlite3", "sharp"],
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
