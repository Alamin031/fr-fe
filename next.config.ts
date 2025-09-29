import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 turbopack : {root : __dirname}, 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },

  /* config options here */
};

export default nextConfig;
