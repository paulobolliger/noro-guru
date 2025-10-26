/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lib", "ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https'
      }
    ]
  }
}
export default nextConfig;