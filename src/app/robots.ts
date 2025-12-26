import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kryptage.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep internal/dynamic surfaces out of the index.
        disallow: [
          "/api/",
          "/_next/",
          "/dashboard",
          "/airdrop",
          "/proposals",
          "/pool",
          // NOTE: keep /docs indexable.
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
