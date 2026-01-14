/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@noro/ui', '@noro/lib'],
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Auth avatars
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
