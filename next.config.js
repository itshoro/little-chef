/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["oslo"],
    typedRoutes: true,
  },
};

module.exports = nextConfig;
