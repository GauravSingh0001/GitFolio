import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Performance ───────────────────────────────────────────────────────────
  compress: true,

  // ─── Turbopack Root (silence workspace root detection warning) ─────────────
  turbopack: {
    root: __dirname,
  },

  // ─── Images ────────────────────────────────────────────────────────────────
  images: {
    // Allow GitHub avatar / content images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
    ],
    // Prefer modern formats
    formats: ["image/avif", "image/webp"],
  },

  // ─── Logging ───────────────────────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  // ─── TypeScript ────────────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },

  // ─── Security Headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
