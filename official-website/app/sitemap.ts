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

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency:
      route === ""
        ? "weekly"
        : route === "/book-demo"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1
        : route === "/book-demo"
        ? 0.9
        : 0.8,
  }));
}