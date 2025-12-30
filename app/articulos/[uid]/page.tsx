import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { richTextComponents } from "@/lib/prismic/richText";
import { createClient } from "@/prismicio";

type Params = { uid: string };

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long" }).format(d);
};

const getAuthorName = (author: unknown): string | undefined => {
  if (!author || typeof author !== "object") return undefined;
  if (!("data" in author)) return undefined;
  const data = (author as { data?: unknown }).data;
  if (!data || typeof data !== "object") return undefined;
  const name = (data as { name?: unknown }).name;
  return typeof name === "string" && name.trim() ? name : undefined;
};

const getCategoryName = (category: unknown): string | undefined => {
  if (!category || typeof category !== "object") return undefined;
  if (!("data" in category)) return undefined;
  const data = (category as { data?: unknown }).data;
  if (!data || typeof data !== "object") return undefined;
  const name = (data as { name?: unknown }).name;
  return typeof name === "string" && name.trim() ? name : undefined;
};

export async function generateStaticParams() {
  const client = createClient();
  try {
    const articles = await client.getAllByType("article");
    return articles.flatMap((article) =>
      article.uid != null ? [{ uid: article.uid }] : []
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  try {
    const article = await client.getByUID("article", uid);

    const title = article.data.meta_title || undefined;
    const description = article.data.meta_description || undefined;
    const imageUrl =
      article.data.meta_image && "url" in article.data.meta_image
        ? article.data.meta_image.url || undefined
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

export default async function ArticuloPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const client = createClient();

  const article = await client
    .getByUID("article", uid, { fetchLinks: ["author.name", "category.name"] })
    .catch(() => notFound());

  const title =
    article.data.title && typeof article.data.title === "string"
      ? article.data.title
      : "Artículo";

  const authorName = getAuthorName(article.data.author);
  const categoryName = getCategoryName(article.data.category);

  const dateLabel =
    article.data.publish_date && typeof article.data.publish_date === "string"
      ? formatDate(article.data.publish_date)
      : undefined;

  return (
    <main className="px-4 py-10 lg:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-5xl px-4 lg:px-6">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Artículos", href: "/articulos" },
            { label: title },
          ]}
          className="mb-6"
        />

        <header className="mb-8">
          {categoryName ? (
            <p className="text-sm mb-2 font-medium text-tussok">
              {categoryName}
            </p>
          ) : null}
          <h1 className="text-finn leading-none text-pretty">{title}</h1>

          {dateLabel ? (
            <p className="mt-3 text-sm text-codGray/70">{dateLabel}</p>
          ) : null}

          {article.data.featured_image ? (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-carrara border border-black/5">
              <PrismicNextImage
                field={article.data.featured_image}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
              />
            </div>
          ) : null}
        </header>

        {article.data.body ? (
          <article className="prose prose-neutral max-w-none">
            <PrismicRichText
              field={article.data.body}
              components={richTextComponents}
            />
          </article>
        ) : null}

        {authorName ? (
          <footer className="mt-10 pt-6 border-t border-black/5">
            <p className="text-sm text-codGray/70">
              <span className="font-medium text-codGray/90">Autor:</span>{" "}
              {authorName}
            </p>
          </footer>
        ) : null}
      </div>
    </main>
  );
}
