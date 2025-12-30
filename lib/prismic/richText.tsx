import type { JSXMapSerializer } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { linkResolver } from "@/lib/prismic/linkResolver";

/**
 * Shared Rich Text serializer for the project.
 *
 * Best practice: define this once and reuse it across slices/components,
 * optionally extending/overriding per-context.
 */
export const richTextComponents: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="text-pretty [&p+p]:mt-4 [&p+ul]:mb-4 [&p+ol]:mb-4">
      {children}
    </p>
  ),
  list: ({ children }) => (
    <ul className="list-disc ml-5 my-2 marker:text-tussok">{children}</ul>
  ),
  listItem: ({ children }) => <li className="text-pretty">{children}</li>,
  hyperlink: ({ node, children }) => (
    <PrismicNextLink
      field={node.data}
      linkResolver={linkResolver}
      className="underline underline-offset-2 hover:opacity-80 transition-opacity"
    >
      {children}
    </PrismicNextLink>
  ),
};
