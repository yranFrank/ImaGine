// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.openai.com"], // Adjust this if using OpenAI image URLs
  },
  eslint: {
    ignoreDuringBuilds: true, // 忽略 ESLint 错误
  },
  typescript: {
    ignoreBuildErrors: true, // 忽略 TypeScript 错误
  },
};

module.exports = nextConfig;
