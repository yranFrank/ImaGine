// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.openai.com"], // Adjust this if using OpenAI image URLs
  },
};

module.exports = nextConfig;
