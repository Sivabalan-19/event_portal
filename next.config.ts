import type { NextConfig } from "next";

const API_BACKEND = process.env.BASE_URL ?? "https://event-portal-server.vercel.app/api";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BACKEND}/:path*`,
      },
    ];
  },
};

export default nextConfig;
