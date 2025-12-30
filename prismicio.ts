import {
  createClient as baseCreateClient,
  type ClientConfig,
  type Route,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "./slicemachine.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
// Route resolver used by `@prismicio/next` (e.g. `PrismicNextLink`) to generate
// internal links for Prismic documents.
const baseRoutes: Route[] = [
  // Homepage singleton
  { type: "home", path: "/" },

  // Repeatable pages
  { type: "page", path: "/:uid" },
];

/**
 * IMPORTANT:
 * Prismic validates the `routes` query param against the repository's known Custom Types.
 * If you add route resolver entries for types that do not exist yet in the Prismic repo,
 * *every* query can fail with: "[Link resolver error] Unknown type".
 *
 * Enable article routes only once the `article_index` and `article` custom types exist
 * in your Prismic repository.
 */
const enableArticleRoutes =
  process.env.NEXT_PUBLIC_PRISMIC_ENABLE_ARTICLES === "true";

const routes: Route[] = enableArticleRoutes
  ? [
      ...baseRoutes,
      { type: "article_index", path: "/articulos" },
      { type: "article", path: "/articulos/:uid" },
    ]
  : baseRoutes;

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
  const client = baseCreateClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
