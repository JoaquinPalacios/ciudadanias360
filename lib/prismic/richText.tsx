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
  heading2: ({ children }) => (
    <h2 className="text-finn text-pretty mb-4">{children}</h2>
  ),
  heading3: ({ children }) => (
    <h3 className="text-finn text-pretty mb-4">{children}</h3>
  ),
  heading4: ({ children }) => (
    <h4 className="text-finn font-medium text-pretty mb-4 lg:text-2xl">
      {children}
    </h4>
  ),
  heading5: ({ children }) => (
    <h5 className="text-finn text-pretty mb-4">{children}</h5>
  ),
  heading6: ({ children }) => (
    <h6 className="text-finn text-pretty mb-4">{children}</h6>
  ),
  paragraph: ({ children }) => (
    <p className="text-pretty [&p+p]:mt-4 [&p+ul]:mb-4 [&p+ol]:mb-4 [&p+h2]:mt-8 [&p+h3]:mt-8 [&p+h4]:mt-6 [&p+h5]:mt-6 [&p+h6]:mt-4">
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
