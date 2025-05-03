/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GATEWAY_BASEURL: process.env.NEXT_PUBLIC_GATEWAY_BASEURL,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
}

module.exports = nextConfig
