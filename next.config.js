// next.config.js

const path = require('path');

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
  webpack: (config) => {
    // 强制使用 postcss@8.5.3
    config.resolve.alias['postcss'] = path.resolve(__dirname, 'node_modules/postcss');
    return config;
  },
};

module.exports = nextConfig;
