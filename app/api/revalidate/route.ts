import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { createClient } from "@/prismicio";

export const runtime = "nodejs";

function getExpectedSecret(): string | undefined {
  return (
    process.env.PRISMIC_REVALIDATE_SECRET ||
    process.env.REVALIDATE_SECRET ||
    undefined
  );
}

function getProvidedSecret(req: NextRequest): string | null {
  // Support both header and query param (useful for webhooks).
  const fromHeader = req.headers.get("x-revalidate-token");
  if (fromHeader) return fromHeader;

  const url = new URL(req.url);
  return url.searchParams.get("secret");
}

type PrismicWebhookBody = {
  type?: string;
  domain?: string;
  apiUrl?: string;
  masterRef?: string;
  documents?: string[];
  tags?: string[];
  secret?: string;
  // Prismic can include extra fields; we only care about the above.
};

async function tryParseJson<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await tryParseJson<PrismicWebhookBody>(req);

  const expected = getExpectedSecret();
  if (!expected) {
    return NextResponse.json(
      { revalidated: false, error: "Server misconfigured: missing secret." },
      { status: 500 }
    );
  }

  const provided = getProvidedSecret(req) || body?.secret || null;
  if (!provided || provided !== expected) {
    return NextResponse.json(
      { revalidated: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  // Always invalidate Prismic fetch caches.
  revalidateTag("prismic", "max");

  // Revalidate the root layout to pick up changes in shared singletons (menu/footer/etc).
  // This is a cheap way to avoid stale nav/footer after CMS updates.
  revalidatePath("/", "layout");

  // If this call came from a Prismic webhook, it usually includes `documents: string[]` (document IDs).
  // We translate those to URLs and revalidate the relevant pages so updates are reflected immediately.
  const documentIds = body?.documents?.filter(Boolean) ?? [];

  const pathsRevalidated: string[] = [];

  if (documentIds.length) {
    const client = createClient();
    const docs = await client.getAllByIDs(documentIds).catch(() => []);

    const urls = new Set<string>();
    for (const doc of docs) {
      if (typeof doc.url === "string" && doc.url.trim()) {
        urls.add(doc.url);
      }
    }

    for (const url of urls) {
      revalidatePath(url);
      pathsRevalidated.push(url);
    }

    // Changes in content can affect sitemap/robots (new pages, removed pages, etc.)
    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    paths: pathsRevalidated,
    webhookType: body?.type ?? null,
  });
}

// Some webhook systems may probe with GET; support it to avoid 405s.
export async function GET(req: NextRequest) {
  return POST(req);
}
