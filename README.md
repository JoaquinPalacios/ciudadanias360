## UI notes

- **Navbar scroll behavior**: the top navbar is **sticky** and will **hide on scroll down** / **reappear on scroll up** (always visible at the top). Implemented with the [`motion`](https://www.npmjs.com/package/motion) package.
- **Mobile menu** (< `lg` / 1024px): the navbar shows a **burger button** that opens a **right-side drawer** with backdrop; closes on **link click**, **backdrop click**, or **Escape**.
- **Hero enumeration marquee** (< `md` / 768px): the `Hero` slice enumeration renders as a **left-scrolling marquee** with **press/hold to pause** and a **prefers-reduced-motion fallback** (static list). See `slices/Hero/index.tsx` + `slices/Hero/components/EnumeracionMarquee.tsx`.

## Getting Started

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Build

```bash
pnpm build
pnpm start
```
