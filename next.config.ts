import { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["sharp"],
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "*.ufs.sh",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  typedRoutes: true,
  experimental: {
    useCache: true,
    authInterrupts: true,
  },
};

module.exports = nextConfig;
