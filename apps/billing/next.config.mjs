/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@noro/ui", "@noro/lib"],
  experimental: {
    serverActions: true,
  }
};

export default nextConfig;