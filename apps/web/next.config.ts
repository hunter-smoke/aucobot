import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@aucobot/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
