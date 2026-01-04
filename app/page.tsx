import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createClient } from "../prismicio";
import { components } from "../slices";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getSingle("home");

  const title = home.data.meta_title || undefined;
  const description = home.data.meta_description || undefined;
  const imageUrl =
    home.data.meta_image && "url" in home.data.meta_image
      ? home.data.meta_image.url || undefined
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
}

export default async function Page() {
  const client = createClient();
  const home = await client.getSingle("home");

  return (
    <main className="bg-carrara">
      <SliceZone slices={home.data.slices} components={components} />
    </main>
  );
}
