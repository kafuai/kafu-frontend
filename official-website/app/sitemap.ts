import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

const routes = [
  "",
  "/platform",
  "/solutions",
  "/enterprise",
  "/about",
  "/contact",
  "/book-demo",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route, index) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route === "/book-demo" ? 0.9 : 0.8,
  }));
}