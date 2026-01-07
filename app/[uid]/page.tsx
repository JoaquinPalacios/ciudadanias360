import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "../../prismicio";
import { components } from "../../slices";

type Params = { uid: string };

/** Reserved UIDs that should not be served as normal pages (e.g. 404 content). */
const RESERVED_UIDS = ["404"];

export async function generateStaticParams() {
  const client = createClient();
  try {
    const pages = await client.getAllByType("page");

    return pages.flatMap((page) =>
      page.uid != null && !RESERVED_UIDS.includes(page.uid)
        ? [{ uid: page.uid }]
        : []
    );
  } catch {
    // If the `page` custom type hasn't been created in the Prismic repository yet,
    // the API will error. Returning an empty list allows builds to succeed.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;

  // Reserved UIDs are handled by special pages (e.g. not-found.tsx)
  if (RESERVED_UIDS.includes(uid)) {
    return {};
  }

  const client = createClient();

  try {
    const page = await client.getByUID("page", uid);

    const title = page.data.meta_title || undefined;
    const description = page.data.meta_description || undefined;
    const imageUrl =
      page.data.meta_image && "url" in page.data.meta_image
        ? page.data.meta_image.url || undefined
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

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;

  // Reserved UIDs trigger 404 so their content is rendered via not-found.tsx
  if (RESERVED_UIDS.includes(uid)) {
    notFound();
  }

  const client = createClient();

  const page = await client.getByUID("page", uid).catch(() => notFound());

  return (
    <main className="bg-carrara">
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
