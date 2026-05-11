import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ecommerce-preset/ui",
    "@ecommerce-preset/types",
    "@ecommerce-preset/assets",
  ],
};

export default nextConfig;
