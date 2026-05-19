/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@noro/types', '@noro/renderer'],
  serverExternalPackages: ['canvas'],
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
