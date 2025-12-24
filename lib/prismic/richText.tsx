import type { JSXMapSerializer } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

/**
 * Shared Rich Text serializer for the project.
 *
 * Best practice: define this once and reuse it across slices/components,
 * optionally extending/overriding per-context.
 */
export const richTextComponents: JSXMapSerializer = {
  paragraph: ({ children }) => <p className="text-pretty">{children}</p>,
  list: ({ children }) => <ul className="list-disc ml-5 my-2">{children}</ul>,
  listItem: ({ children }) => <li className="text-pretty">{children}</li>,
  hyperlink: ({ node, children }) => (
    <PrismicNextLink
      field={node.data}
      className="underline underline-offset-2 hover:opacity-80 transition-opacity"
    >
      {children}
    </PrismicNextLink>
  ),
};
