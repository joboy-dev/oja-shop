import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/config/public-env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/account", "/admin", "/checkout", "/cart", "/login", "/api", "/dev"] }],
    sitemap: `${publicEnv.appUrl}/sitemap.xml`,
  };
}
