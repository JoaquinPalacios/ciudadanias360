"use client";

import Link from "next/link";

/**
 * Error boundary for runtime errors in pages.
 *
 * This is a Client Component that catches errors thrown in child routes
 * (but not in the root layout itself — see global-error.tsx for that).
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-carrara min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-tussok font-medium text-sm uppercase tracking-wide mb-3">
        Error 500
      </p>
      <h1 className="text-finn mb-4">Algo salió mal</h1>
      <p className="text-codGray/80 max-w-md mb-8">
        Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border-2 border-finn bg-transparent px-6 py-3 text-finn font-medium transition-colors hover:bg-finn hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tussok focus-visible:ring-offset-2 focus-visible:ring-offset-carrara"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-finn px-6 py-3 text-white font-medium transition-colors hover:bg-finn/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tussok focus-visible:ring-offset-2 focus-visible:ring-offset-carrara"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
