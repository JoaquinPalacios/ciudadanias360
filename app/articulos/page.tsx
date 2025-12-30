import type { Metadata } from "next";
import Link from "next/link";
import { SliceZone } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(d);
};

const getCategoryName = (category: unknown): string | undefined => {
  if (!category || typeof category !== "object") return undefined;
  if (!("data" in category)) return undefined;
  const data = (category as { data?: unknown }).data;
  if (!data || typeof data !== "object") return undefined;
  const name = (data as { name?: unknown }).name;
  return typeof name === "string" && name.trim() ? name : undefined;
};

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

  return (
    <main>
      {articleIndex?.data.slices?.length ? (
        <SliceZone slices={articleIndex.data.slices} components={components} />
      ) : null}

      <section
        aria-label="Listado de artículos"
        className="px-4 py-12 lg:px-6 lg:py-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          {articles.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => {
                const href = article.uid
                  ? `/articulos/${article.uid}`
                  : "/articulos";
                const categoryName = getCategoryName(article.data.category);
                const dateLabel =
                  article.data.publish_date &&
                  typeof article.data.publish_date === "string"
                    ? formatDate(article.data.publish_date)
                    : undefined;

                return (
                  <Link
                    key={article.id}
                    href={href}
                    className="group bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden hover:shadow-md hover:border-black/10 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tussok/30 focus-visible:ring-offset-2 focus-visible:ring-offset-carrara"
                  >
                    {article.data.featured_image ? (
                      <div className="relative aspect-[16/9] bg-carrara">
                        <PrismicNextImage
                          field={article.data.featured_image}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 100vw"
                        />
                        {categoryName ? (
                          <p className="absolute bottom-3 left-3 text-xs font-medium text-white/90 bg-finn backdrop-blur-sm rounded-full px-3 py-1">
                            {categoryName}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="p-5">
                      {dateLabel ? (
                        <p className="text-xs text-codGray/60">{dateLabel}</p>
                      ) : null}

                      <h2 className="mt-2 text-xl font-semibold text-finn text-pretty group-hover:underline underline-offset-4">
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
        </div>
      </section>
    </main>
  );
}
