import type { MetadataRoute } from "next";

const BASE_URL = "https://rotaryclubofpashupati.org.np";

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFreq: "weekly" as const },
  { path: "/about", priority: 0.9, changeFreq: "monthly" as const },
  { path: "/about/trf-contributors", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/members", priority: 0.8, changeFreq: "monthly" as const },
  { path: "/projects", priority: 0.9, changeFreq: "weekly" as const },
  { path: "/gallery", priority: 0.8, changeFreq: "weekly" as const },
  { path: "/archives", priority: 0.7, changeFreq: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFreq: "yearly" as const },
  { path: "/donate", priority: 0.9, changeFreq: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return STATIC_ROUTES.map(({ path, priority, changeFreq }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }));
}
