import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // Next.js 16: Turbopack is now the default bundler
  // ESLint config moved out of next.config.ts - use eslint.config.mjs instead
  // Uncomment below to enable experimental features:
  // reactCompiler: true,  // Enable React Compiler for automatic memoization
  // cacheComponents: true,  // Enable Cache Components (replaces PPR)
};

export default nextConfig;
