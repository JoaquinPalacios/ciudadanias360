"use client";

import Link from "next/link";

/**
 * Global error boundary that catches errors in the root layout.
 *
 * This component must provide its own <html> and <body> tags since it
 * completely replaces the root layout when an error occurs.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily:
            'Lato, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: "#f8f8f5", // carrara
          color: "#181818", // codGray
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#be9e44", // tussok
              fontWeight: 500,
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            Error 500
          </p>
          <h1
            style={{
              color: "#522546", // finn
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Algo salió mal
          </h1>
          <p
            style={{
              maxWidth: "28rem",
              marginBottom: "2rem",
              opacity: 0.8,
            }}
          >
            Ocurrió un error inesperado. Podés intentar de nuevo o volver al
            inicio.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "9999px",
                border: "2px solid #522546",
                backgroundColor: "transparent",
                padding: "0.75rem 1.5rem",
                color: "#522546",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: "#522546",
                padding: "0.75rem 1.5rem",
                color: "#fff",
                fontWeight: 500,
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              Volver al inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
