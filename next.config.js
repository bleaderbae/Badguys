/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.shopify.com', 'bgc.gg'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
