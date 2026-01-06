import { MetadataRoute } from "next";

import { createClient } from "../prismicio";

function getSiteUrl(): string {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  return env.replace(/\/+$/, "");
}

function toLastModified(dateLike?: string | null): Date | undefined {
  if (!dateLike) return undefined;
  const d = new Date(dateLike);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const client = createClient();

  const urls: MetadataRoute.Sitemap = [];

  // Homepage (singleton)
  try {
    const home = await client.getSingle("home");
    urls.push({
      url: `${siteUrl}/`,
      lastModified: toLastModified(home.last_publication_date) ?? new Date(),
    });
  } catch {
    urls.push({ url: `${siteUrl}/`, lastModified: new Date() });
  }

  // Repeatable pages: `app/[uid]/page.tsx` -> `/:uid`
  const pages = await client.getAllByType("page", { pageSize: 100 });
  for (const page of pages) {
    if (!page.uid) continue;
    urls.push({
      url: `${siteUrl}/${page.uid}`,
      lastModified: toLastModified(page.last_publication_date),
    });
  }

  // Articles (optional, behind env flag to avoid Prismic "Unknown type" errors)
  const enableArticleRoutes =
    process.env.NEXT_PUBLIC_PRISMIC_ENABLE_ARTICLES === "true";

  if (enableArticleRoutes) {
    try {
      const articleIndex = await client.getSingle("article_index");
      urls.push({
        url: `${siteUrl}/articulos`,
        lastModified: toLastModified(articleIndex.last_publication_date),
      });
    } catch {
      urls.push({ url: `${siteUrl}/articulos`, lastModified: new Date() });
    }

    const articles = await client.getAllByType("article", { pageSize: 100 });
    for (const article of articles) {
      if (!article.uid) continue;
      urls.push({
        url: `${siteUrl}/articulos/${article.uid}`,
        lastModified: toLastModified(article.last_publication_date),
      });
    }
  }

  return urls;
}
