import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photography comes from a curated, credited set of Unsplash photographs.
    // See src/content/media.ts for the register and attribution.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [96, 160, 240, 320, 420],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
};

export default nextConfig;
