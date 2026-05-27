/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@noro/types', '@noro/lib', '@noro/ui'],
  images: {
    domains: ['cloudinary.com'],
  },
};

export default nextConfig;
