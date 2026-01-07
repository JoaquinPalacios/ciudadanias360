# ⚖️ Ciudadanías 360 (Web)

Marketing site built with **Next.js (App Router)** and **Prismic CMS** (Slice Machine).

## Tech stack

- **Next.js** (v16)
- **React** (v19)
- **TypeScript**
- **Prismic** (`@prismicio/*`) + **Slice Machine** (`slice-machine-ui`)
- **Tailwind CSS** (v4)
- **Nodemailer** (contact form API)

## Requirements

- **Node.js `24.3.0`** (see `.nvmrc`)
- **pnpm** (recommended via Corepack)

## Quick start

```bash
pnpm install
pnpm dev
```

App runs on `http://localhost:3000`.

## Scripts

- **dev**: `pnpm dev`
- **build**: `pnpm build`
- **start**: `pnpm start`
- **lint**: `pnpm lint`
- **Slice Machine**: `pnpm slicemachine` (opens the Slice Machine UI)

## Environment variables

Create a `.env.local` file in the project root:

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://www.ciudadanias360.com

# Prismic
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=ciudadanias360
NEXT_PUBLIC_PRISMIC_ENABLE_ARTICLES=true

# Contact form (Gmail via Nodemailer)
EMAIL_ADDRESS=example@gmail.com
EMAIL_PASSWORD=your-app-password

# Protect /api/revalidate (Prismic webhook)
PRISMIC_REVALIDATE_SECRET=change-me
```

Notes:

- `NEXT_PUBLIC_SITE_URL` should be your production canonical origin. It is used by `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts`.
- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` is the Prismic repository name. If omitted, we fall back to `slicemachine.config.json` (`repositoryName`).
- `NEXT_PUBLIC_PRISMIC_ENABLE_ARTICLES` should be `"true"` only after the `article_index` and `article` custom types exist in your Prismic repo.
- For Gmail, use an **App Password** (recommended) instead of your normal password.
- `PRISMIC_REVALIDATE_SECRET` is required in production to prevent unauthorized cache invalidation.

You can also use `env.example` as a starting point.

## Prismic integration notes

- **Slices live in** `slices/`
- **Custom Types live in** `customtypes/`
- **Slice Simulator**: `http://localhost:3000/slice-simulator` (`app/slice-simulator/page.tsx`)

### Preview

Prismic preview routes:

- **Start preview**: `GET /api/preview`
- **Exit preview**: `GET /api/exit-preview`

### Revalidation

- **Webhook endpoint**: `POST /api/revalidate`
- Uses Next.js cache tags (revalidates the `prismic` tag).
- Must include the secret:
  - Header: `x-revalidate-token: <PRISMIC_REVALIDATE_SECRET>`
  - Or query param: `?secret=<PRISMIC_REVALIDATE_SECRET>`
- Prismic also includes a `secret` field in the webhook JSON payload; the endpoint accepts that as well (so Prismic’s built-in “Secret” field works).
- Recommended: configure a **Prismic Webhook** to call this endpoint on publish/update. The webhook payload includes `documents: string[]` (document IDs); the API will resolve their URLs and `revalidatePath()` the affected pages.

## Deploy

This project is deployed on **Vercel** (standard Next.js build pipeline).
