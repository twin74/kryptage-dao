import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kryptage.com";

  // App routes (keep it conservative: only index the pages that make sense for search).
  const routes: Array<{ path: string; lastModified?: string | Date; changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.9 },
    { path: "/governance", changeFrequency: "weekly", priority: 0.6 },
    // The following are product/app surfaces: indexable, but lower intent for generic SEO.
    { path: "/vault", changeFrequency: "weekly", priority: 0.5 },
    { path: "/swap", changeFrequency: "weekly", priority: 0.4 },
    { path: "/faucet", changeFrequency: "monthly", priority: 0.2 },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: r.lastModified ?? new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
