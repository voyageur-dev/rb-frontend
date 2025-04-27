/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GATEWAY_BASEURL: process.env.NEXT_PUBLIC_GATEWAY_BASEURL,
  }
}

module.exports = nextConfig
