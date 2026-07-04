import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
  },
}

export default nextConfig
