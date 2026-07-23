import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KAFU AI Enterprise Intelligence Platform",
    short_name: siteConfig.shortName,
    description: siteConfig.description,

    start_url: "/",
    scope: "/",

    display: "standalone",
    orientation: "portrait",

    background_color: "#071321",
    theme_color: "#071321",

    lang: "en",
    categories: ["business", "productivity", "enterprise"],

    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}