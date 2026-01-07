import Link from "next/link";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

/**
 * Not Found page (404).
 *
 * Attempts to fetch a Prismic `page` document with reserved UID `404`.
 * If it exists, renders its slices via SliceZone; otherwise, shows a static fallback.
 */
export default async function NotFound() {
  const client = createClient();

  const page = await client.getByUID("page", "404").catch(() => null);

  if (page) {
    return (
      <main className="bg-carrara">
        <SliceZone slices={page.data.slices} components={components} />
      </main>
    );
  }

  // Static fallback when Prismic document is unavailable
  return (
    <main className="bg-carrara min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-tussok font-medium text-sm uppercase tracking-wide mb-3">
        Error 404
      </p>
      <h1 className="text-finn mb-4">Página no encontrada</h1>
      <p className="text-codGray/80 max-w-md mb-8">
        Lo sentimos, la página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-finn px-6 py-3 text-white font-medium transition-colors hover:bg-finn/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tussok focus-visible:ring-offset-2 focus-visible:ring-offset-carrara"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
