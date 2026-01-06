import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { createClient } from "@/prismicio";
import { Navbar } from "@/components/Navbar";

const lato = Lato({ weight: ["400", "700"], subsets: ["latin"] });

function getSiteUrl(): string {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  return env.replace(/\/+$/, "");
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Ciudadanías 360 | Ciudadanía, visas y trámites consulares",
  description:
    "Asesoramiento integral en ciudadanías, visas y trámites consulares. Evaluamos tu caso, armamos tu carpeta y te acompañamos en cada etapa. Agendá una consulta.",
  keywords: [
    "Ciudadanía española",
    "Ciudadanía italiana",
    "Asesoramiento de visas",
    "Ciudadanía europea",
    "Ciudadanía argentina",
    "Visa para Estados Unidos",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Ciudadanías 360 | Ciudadanía, visas y trámites consulares",
    description:
      "Asesoramiento integral en ciudadanías, visas y trámites consulares. Evaluamos tu caso, armamos tu carpeta y te acompañamos en cada etapa. Agendá una consulta.",
    url: "/",
    siteName: "Ciudadanías 360",
    locale: "es_AR",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ciudadanías 360",
    description: "Tramitamos tu ciudadanía en el exterior",
    images: ["/opengraph-image"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();
  const menu = await client.getSingle("menu");
  const footer = await client.getSingle("footer");
  const detalleContacto = await client
    .getSingle("detallecontacto")
    .catch(() => null);

  return (
    <html lang="es">
      <body className={lato.className}>
        <Navbar menu={menu} />
        {children}
        <Footer footer={footer} detalleContacto={detalleContacto} />
      </body>
    </html>
  );
}
