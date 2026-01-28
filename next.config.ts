import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  register: true, // Force the service worker to register
  workboxOptions: {
    disableDevLogs: true,
    // iOS is very strict about Service Worker updates
    skipWaiting: true,
    clientsClaim: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Your existing config...
  output: "standalone",
  serverExternalPackages: ["handlebars"],
  experimental: {
    authInterrupts: true,
  },
  // Ensure the manifest and SW are not optimized away
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
