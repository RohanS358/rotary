import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    qualities: [30, 75],
    minimumCacheTTL: 2592000, // 30d — stored filenames are content-hashed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.rotarydistrict3292.org.np",
      },
      {
        protocol: "https",
        hostname: "rotarydistrict3292.org.np",
      },
    ],
  },
};

export default nextConfig;
