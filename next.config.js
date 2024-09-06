/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  serverExternalPackages: ["oslo"],
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
