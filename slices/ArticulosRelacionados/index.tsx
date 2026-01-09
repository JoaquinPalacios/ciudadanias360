import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/prismicio";
import { getCategoryName } from "@/lib/articles/articleFields";

/**
 * Props for `ArticulosRelacionados`.
 */
export type ArticulosRelacionadosProps = SliceComponentProps<
  Content.ArticulosRelacionadosSlice,
  { currentArticleUid?: string }
>;

/**
 * Component for "ArticulosRelacionados" Slices.
 */
const ArticulosRelacionados = async ({
  slice,
  context,
}: ArticulosRelacionadosProps) => {
  const client = createClient();
  const currentArticleUid = context?.currentArticleUid;

  const articles = await client
    .getByType("article", {
      fetchLinks: ["category.name"],
      orderings: [{ field: "my.article.publish_date", direction: "desc" }],
      pageSize: currentArticleUid ? 6 : 3,
    })
    .then((res) =>
      res.results
        .filter((article) => article.uid && article.uid !== currentArticleUid)
        .slice(0, 3)
    )
    .catch(() => []);

  const { titulo, link } = slice.primary;
  const linkText =
    link && typeof link === "object" && "text" in link
      ? ((link as unknown as { text?: string | null }).text ?? undefined)
      : undefined;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-12 lg:px-6 lg:py-16 mx-auto w-full"
    >
      <header className="flex items-baseline justify-between gap-6 max-w-7xl mx-auto">
        {titulo ? (
          <h2 className="text-finn leading-none text-pretty">{titulo}</h2>
        ) : (
          <div />
        )}

        {link ? (
          <PrismicNextLink
            field={link}
            className="group inline-flex items-center gap-2 text-crete"
          >
            <span className="link-underline--group">
              {linkText || "Ver todos"}
            </span>
            <ArrowRight
              className="size-4 mt-0.5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
              strokeWidth={2.5}
            />
          </PrismicNextLink>
        ) : null}
      </header>

      <div className="mt-6 h-px w-full max-w-7xl mx-auto bg-gradient-to-r from-tussok/40 via-black/10 to-transparent" />

      {articles.length ? (
        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {articles.map((article) => {
            const href = article.uid
              ? `/articulos/${article.uid}`
              : "/articulos";
            const categoryName = getCategoryName(article.data.category);

            return (
              <Link
                key={article.id}
                href={href}
                className="group relative block h-full overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-xs transition-all duration-300 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tussok/30 focus-visible:ring-offset-2 focus-visible:ring-offset-carrara"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-tussok/70 via-laser/35 to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-laser/15 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />

                {article.data.featured_image ? (
                  <div className="relative aspect-video bg-carrara">
                    <PrismicNextImage
                      field={article.data.featured_image}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, 100vw"
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
                  <h3 className="text-xl font-semibold text-finn text-pretty line-clamp-2">
                    {article.data.title || "Sin título"}
                  </h3>

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
        <p className="mt-6 text-codGray/70 max-w-7xl mx-auto">
          Todavía no hay artículos publicados.
        </p>
      )}
    </section>
  );
};

export default ArticulosRelacionados;
