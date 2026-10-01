import type { NextConfig } from "next";

const storageHost = (() => {
  try {
    return process.env.STORAGE_PUBLIC_URL ? new URL(process.env.STORAGE_PUBLIC_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // The email renderer uses react-dom/server, which must run outside the RSC bundle.
  serverExternalPackages: ["@react-email/render", "@react-email/components"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(storageHost ? [{ protocol: "https" as const, hostname: storageHost }] : []),
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "1mb" },
  },
};

export default nextConfig;
