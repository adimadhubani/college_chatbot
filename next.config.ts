import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
experimental: {
serverActions: { allowedOrigins: ["*"] }
}
};

export default nextConfig;
