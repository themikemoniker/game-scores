import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The root layout lives under app/[lang], so the 404 page for the whole app is app/global-not-found.tsx.
  experimental: { globalNotFound: true },
};

export default nextConfig;
