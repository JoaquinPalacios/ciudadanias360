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
# Prismic
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=ciudadanias360
NEXT_PUBLIC_PRISMIC_ENABLE_ARTICLES=true

# Contact form (Gmail via Nodemailer)
EMAIL_ADDRESS=example@gmail.com
EMAIL_PASSWORD=your-app-password
```

Notes:

- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` is the Prismic repository name. If omitted, we fall back to `slicemachine.config.json` (`repositoryName`).
- `NEXT_PUBLIC_PRISMIC_ENABLE_ARTICLES` should be `"true"` only after the `article_index` and `article` custom types exist in your Prismic repo.
- For Gmail, use an **App Password** (recommended) instead of your normal password.

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

## Deploy

This project is deployed on **Vercel** (standard Next.js build pipeline).
