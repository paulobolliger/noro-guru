/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@noro/types', '@noro/lib', '@noro/ui'],
  images: {
    domains: ['supabase.co', 'cloudinary.com'],
  },
};

export default nextConfig;
