# Moji (文字)

Anime-aesthetic D2C apparel store with an AI art pipeline built in. React + Express + Supabase + Pollinations.

See [Idea.md](./Idea.md) for the product vision, design system, and roadmap.

## Features

### Shop

- Home page with hero, category tiles, featured drops
- Shop listing with category filter, search, and sort
- Product detail with image, size (XS–XXL for apparel), qty stepper, Buy now
- Cart with localStorage persistence, qty controls, free-shipping progress
- Checkout flow (mock order — no real payment)
- Toast feedback on every action

### Admin (`/admin/*`, separate layout)

- Dashboard: totals, in-stock counts, category breakdown, recent adds
- Products CRUD with search + filter
- Image Studio: generate product art with AI (free via Pollinations) or upload a file

### Backend

- Products REST API: `GET / POST / PUT / DELETE /api/products`
- Image API: `POST /api/images/generate` · `POST /api/images/upload`
- Health: `GET /api/health`
- Supabase Storage uploads returning public URLs

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18 + Vite + React Router 6 + react-hot-toast |
| Backend | Express 4 + Prisma ORM |
| Database | Supabase Postgres (via Prisma) |
| Storage | Supabase Storage (`product-images` bucket) |
| Image gen | Pollinations.ai FLUX (free, default) · Replicate optional |
| Testing | Jest + Supertest (backend) · Vitest + Testing Library (frontend) |
| Container | Docker (multi-stage) |
| Deploy | Render (combined single service) |

## Folder structure

```text
shop-smart-app/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma       # Postgres (Supabase)
│   │   ├── test.prisma         # SQLite (tests)
│   │   └── seed.js             # 12 Moji products
│   ├── src/
│   │   ├── app.js              # Express app
│   │   ├── index.js            # server entrypoint
│   │   ├── lib/
│   │   │   ├── prisma.js       # Prisma singleton
│   │   │   └── supabase.js     # Supabase client
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── routes/
│   │       ├── products.js     # CRUD
│   │       └── images.js       # generate + upload
│   └── tests/
│       ├── app.test.js
│       └── products.test.js
├── client/
│   └── src/
│       ├── api/                # fetch helpers
│       ├── components/
│       │   ├── Navbar.jsx      # public nav
│       │   ├── Footer.jsx
│       │   ├── ProductCard.jsx # shop card (link)
│       │   └── admin/
│       │       ├── ProductCardAdmin.jsx
│       │       ├── ProductForm.jsx
│       │       ├── ImageGenerator.jsx
│       │       └── ImageUpload.jsx
│       ├── contexts/
│       │   └── CartContext.jsx # cart + localStorage
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ShopPage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   └── admin/
│       │       ├── AdminLayout.jsx
│       │       ├── AdminDashboard.jsx
│       │       ├── AdminProducts.jsx
│       │       └── AdminImages.jsx
│       ├── App.jsx             # Router + CartProvider + Toaster
│       └── index.css           # full design system
├── scripts/
│   ├── setup.sh                # install + init db
│   ├── dev.sh                  # start both dev servers
│   └── test.sh                 # run all tests
├── Dockerfile                  # multi-stage, one service
├── docker-compose.yml
├── render.yaml
├── Idea.md                     # product vision
└── README.md
```

## Prerequisites

- Node.js 18+
- A free Supabase project ([supabase.com](https://supabase.com))
- (Optional) Replicate account if you want to use Replicate instead of the default Pollinations

## Quick start

### 1. Clone and install

```bash
git clone <this-repo>
cd shop-smart-app
./scripts/setup.sh
```

The setup script installs both workspaces and seeds data after you fill in `.env`.

### 2. Configure Supabase

In the Supabase dashboard:

1. **Project Settings → Database → Connection pooling** — copy the pooled connection string (port 6543) and the direct URL (port 5432)
2. **Project Settings → API** — copy the Project URL and the `anon` public key
3. **Storage → New bucket** — create `product-images` (exact lowercase), toggle **Public bucket** ON
4. **Storage → Policies** — add two policies on `product-images`:

    ```sql
    create policy "anon upload"
    on storage.objects for insert to anon
    with check (bucket_id = 'product-images');

    create policy "anon read"
    on storage.objects for select to anon
    using (bucket_id = 'product-images');
    ```

### 3. Fill in `server/.env`

Copy `server/.env.example` → `server/.env` and fill in the values:

```bash
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://[REF].supabase.co"
SUPABASE_ANON_KEY="eyJ..."
IMAGE_PROVIDER="pollinations"
PORT=5001
NODE_ENV=development
```

### 4. Push schema + seed

```bash
cd server
npx prisma db push
npm run db:seed
```

### 5. Start both servers

```bash
./scripts/dev.sh
```

- Backend: <http://localhost:5001>
- Frontend: <http://localhost:5173>
- Admin: <http://localhost:5173/admin>

## Environment variables

| Key | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | Supabase pooled connection (port 6543) |
| `DIRECT_URL` | yes | Supabase direct connection (port 5432), for migrations |
| `SUPABASE_URL` | yes | `https://<ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | yes | Public anon JWT from Project Settings → API |
| `IMAGE_PROVIDER` | no | `pollinations` (default, free) or `replicate` |
| `REPLICATE_API_TOKEN` | only if `IMAGE_PROVIDER=replicate` | |
| `PORT` | no | Default 5001 |
| `NODE_ENV` | no | `development` / `production` |

## Image generation providers

### Pollinations (default, free)

FLUX.1 served by [pollinations.ai](https://pollinations.ai). No key needed. Rate-limited by Pollinations — enough for testing and small-batch generation. Images are PNG, 1024×1024.

### Replicate (optional, paid)

Set `IMAGE_PROVIDER=replicate` and add `REPLICATE_API_TOKEN`. Uses `black-forest-labs/flux-schnell`. Output is WebP, 1024×1024. Costs ~$0.003 per image.

Either way, the generated image is uploaded to Supabase Storage at `product-images/generated/<timestamp>.{png,webp}` and a public URL is returned.

## API reference

### Products

| Method | Path | Body | Notes |
| --- | --- | --- | --- |
| GET | `/api/products` | — | Query params: `category`, `search`, `sort`, `order` |
| GET | `/api/products/:id` | — | |
| POST | `/api/products` | `{ name, price, category, ... }` | 400 if required fields missing |
| PUT | `/api/products/:id` | partial product | 404 if id not found |
| DELETE | `/api/products/:id` | — | 204 on success |

### Images

| Method | Path | Body | Response |
| --- | --- | --- | --- |
| POST | `/api/images/generate` | `{ prompt, style? }` | `{ imageUrl, provider }` |
| POST | `/api/images/upload` | `{ image (base64 dataURL), filename? }` | `{ imageUrl }` |

Styles: `soft-anime`, `cyberpunk`, `watercolor`, `retro-90s`, `minimal`.

## Testing

```bash
# Everything
./scripts/test.sh

# Backend only (uses SQLite fallback via prisma/test.prisma)
cd server && npm test

# Frontend only
cd client && npm test -- --run
```

Backend tests run against a fresh SQLite file each run; no Supabase connection needed. Frontend tests use Vitest + jsdom with mocked `fetch`.

## Development

```bash
# Start backend (hot reload via nodemon)
cd server && npm run dev

# Start frontend (Vite HMR)
cd client && npm run dev

# Regenerate Prisma client (after schema edits)
cd server && npx prisma generate

# Push schema changes to Supabase
cd server && npx prisma db push

# Reseed products
cd server && npm run db:seed
```

After running backend tests, Prisma client is regenerated against `test.prisma` (SQLite). Run `npx prisma generate` to swap it back to the Postgres client for dev.

## Deployment

### Render (recommended, single service)

`render.yaml` is pre-configured for a single web service that builds both workspaces and serves the static client from Express:

1. Push to GitHub
2. In Render → New → Blueprint → select this repo
3. Add environment variables in the Render dashboard (`DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `IMAGE_PROVIDER`)
4. Render runs `cd server && npm install && npx prisma generate && npx prisma db push && cd ../client && npm install && npm run build` as the build step
5. Start command: `cd server && NODE_ENV=production node src/index.js`
6. Express serves `/api/*` and falls back to `client/dist/index.html` for every other route

In production the single service listens on `PORT` (Render default 10000). The frontend calls the API as relative URLs, so no CORS config is needed.

### Docker

```bash
docker compose up --build
```

The multi-stage Dockerfile builds both the client and server into one node:20-alpine image. The image serves everything on port 5001.

## Troubleshooting

### `Error: P1001: Can't reach database server`

You're using the direct URL instead of the pooled URL, or the region is wrong in `DATABASE_URL`. Grab the pooled connection string from Supabase → Project Settings → Database → Connection pooling.

### `new row violates row-level security policy`

The `product-images` bucket exists but policies are missing or too restrictive. See step 2.4 in Quick start — make sure both an INSERT and a SELECT policy exist for role `anon`.

### `Bucket not found`

The bucket isn't named exactly `product-images` (lowercase). Check Supabase → Storage.

### Image generate returns 503

Missing `SUPABASE_URL` or `SUPABASE_ANON_KEY` — the route guards against unconfigured storage so it fails fast rather than uploading to nowhere.

### Image generate returns 402 Payment Required

You're on `IMAGE_PROVIDER=replicate` with an empty Replicate account. Either top up at replicate.com or flip to `IMAGE_PROVIDER=pollinations` (free).

## Credits

- **Fonts:** [M PLUS 1p](https://fonts.google.com/specimen/M+PLUS+1p), [DM Sans](https://fonts.google.com/specimen/DM+Sans)
- **Free image gen:** [Pollinations](https://pollinations.ai)
- **Storage + DB:** [Supabase](https://supabase.com)

## License

MIT
