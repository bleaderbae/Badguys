/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['cdn.shopify.com'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
