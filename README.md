# maknisa-next

Maknisa furniture website — Next.js 16 (App Router) with Maknisa-branded product pages and catalog layout.

## Requirements

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Import this repo in [Vercel](https://vercel.com/new).
2. **Root directory:** repository root (this folder).
3. **Framework:** Next.js (auto-detected).
4. Build command: `npm run build` — Output: `.next`
5. Deploy.

Product and collection images load from external CDNs; no local `public/media` folder is required in production.

## Project structure

| Path | Purpose |
|------|---------|
| `app/` | Routes and global styles |
| `components/` | UI (layout, home, collection, product) |
| `lib/` | Data, navigation, site config |
| `public/styles/` | `maknisa.css` (main stylesheet) |
| `public/client/` | Sprite / asset paths referenced by CSS |

## Notes

- `public/www.scavolini.com/` is an old HTTrack mirror and is **gitignored** — do not commit it.
- Run `npm run build` before pushing to confirm all routes compile.
