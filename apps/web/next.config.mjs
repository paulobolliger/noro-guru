/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@noro/types', '@noro/renderer'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
