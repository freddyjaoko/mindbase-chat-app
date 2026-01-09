import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Set to false because strict mode breaks components that call APIs when the component is rendered (like in Conversation)
  reactStrictMode: false,
  // Only use Redis cache handler if REDIS_URL is present
  ...(process.env.USE_REDIS && {
    cacheMaxMemorySize: 0, // disable default in-memory caching
  }),
  output: "standalone",
  experimental: {
    authInterrupts: true,
  },
};

export default withPWA(nextConfig);
