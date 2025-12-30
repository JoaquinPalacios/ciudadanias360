import type { LinkResolverFunction } from "@prismicio/client";

/**
 * Centralized link resolver for Prismic document links.
 *
 * This is used as a fallback when Prismic `routes` are not enabled/available yet.
 */
export const linkResolver: LinkResolverFunction = (doc) => {
  if (!doc) return "/";

  switch (doc.type) {
    case "home":
      return "/";
    case "page":
      return doc.uid ? `/${doc.uid}` : "/";
    case "article_index":
      return "/articulos";
    case "article":
      return doc.uid ? `/articulos/${doc.uid}` : "/articulos";
    default:
      return "/";
  }
};
