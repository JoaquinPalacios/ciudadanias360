import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { createClient } from "@/prismicio";
import { Navbar } from "@/components/Navbar";

const lato = Lato({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  // icons: {
  // 	icon: 'https://images.prismic.io/pachamama/ZtFsJkaF0TcGJju5_favicon.ico?auto=format,compress',
  // 	shortcut: 'https://images.prismic.io/pachamama/ZtFsJkaF0TcGJju5_favicon.ico?auto=format,compress',
  // },
  // manifest: "/manifest.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();
  const menu = await client.getSingle("menu");
  const footer = await client.getSingle("footer");

  return (
    <html lang="en">
      <body className={lato.className}>
        <Navbar menu={menu} />
        {children}
        <Footer footer={footer} />
      </body>
    </html>
  );
}
