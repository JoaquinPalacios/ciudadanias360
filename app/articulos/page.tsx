import type { Metadata } from "next";
import Link from "next/link";
import { SliceZone } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { formatEsArDate } from "@/lib/articles/articleFormat";
import { getCategoryName } from "@/lib/articles/articleFields";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();

  try {
    const articleIndex = await client.getSingle("article_index");

    const title = articleIndex.data.meta_title || undefined;
    const description = articleIndex.data.meta_description || undefined;
    const imageUrl =
      articleIndex.data.meta_image && "url" in articleIndex.data.meta_image
        ? articleIndex.data.meta_image.url || undefined
        : undefined;

    return {
      title,
      description,
      openGraph: {
        title: title ?? undefined,
        description: description ?? undefined,
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticulosIndexPage() {
  const client = createClient();

  const articleIndex = await client
    .getSingle("article_index")
    .catch(() => null);

  const articles = await client
    .getAllByType("article", {
      fetchLinks: ["category.name"],
      orderings: [{ field: "my.article.publish_date", direction: "desc" }],
    })
    .catch(() => []);

  const slices = articleIndex?.data.slices ?? [];
  const topSlices = slices.filter((slice) => slice.slice_type !== "cta");
  const bottomCtaSlices = slices.filter((slice) => slice.slice_type === "cta");

  return (
    <main className="bg-carrara">
      {topSlices.length ? (
        <SliceZone slices={topSlices} components={components} />
      ) : null}

      <section
        aria-label="Listado de artículos"
        className="px-4 py-12 lg:px-6 lg:py-16 mx-auto w-full max-w-8xl"
      >
        {articles.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
            {articles.map((article) => {
              const href = article.uid
                ? `/articulos/${article.uid}`
                : "/articulos";
              const categoryName = getCategoryName(article.data.category);
              const dateLabel =
                article.data.publish_date &&
                typeof article.data.publish_date === "string"
                  ? formatEsArDate(article.data.publish_date, "medium")
                  : undefined;

              return (
                <Link
                  key={article.id}
                  href={href}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-xs transition-all duration-200 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tussok/30 focus-visible:ring-offset-2 focus-visible:ring-offset-carrara"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-tussok/70 via-laser/35 to-transparent"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-laser/15 blur-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  {article.data.featured_image ? (
                    <div className="relative aspect-video bg-carrara">
                      <PrismicNextImage
                        field={article.data.featured_image}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 100vw"
                        fallbackAlt=""
                      />
                      {categoryName ? (
                        <p className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-finn backdrop-blur-sm rounded-full px-3 py-1 shadow">
                          {categoryName}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="p-5">
                    {dateLabel ? (
                      <p className="text-xs text-codGray/60">{dateLabel}</p>
                    ) : null}

                    <h2 className="mt-2 text-xl font-semibold text-finn text-pretty line-clamp-2">
                      {article.data.title || "Sin título"}
                    </h2>

                    {article.data.excerpt ? (
                      <p className="mt-2 text-base text-codGray/90 line-clamp-3">
                        {article.data.excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-codGray/70">
            Todavía no hay artículos publicados.
          </p>
        )}
      </section>

      {bottomCtaSlices.length ? (
        <SliceZone slices={bottomCtaSlices} components={components} />
      ) : null}
    </main>
  );
}
