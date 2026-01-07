# Moji (文字) — Idea Doc

## What it is

Moji is a direct-to-consumer anime-aesthetic apparel brand based in Pune, India. The storefront in this repo is the first iteration of the website — a Souled Store-style shopping experience with a built-in AI art pipeline for product imagery.

"Moji" comes from 文字 — *characters*, *letters*, *lettering*. The brand is typography-led: custom kanji, katakana, and anime-adjacent lettering printed on heavyweight tees, hoodies, and accessories.

## Why

Every anime-adjacent brand in India sells the same licensed Naruto/Goku/Dragon Ball prints. That market is crowded, legally risky, and creatively dead. Moji is the bet that there's room for an anime-*aesthetic* brand — soft watercolor, cyberpunk alleys, cherry-blossom drift — that never puts a licensed character on a product.

The AI pipeline lets a solo founder generate original art per drop without paying an illustrator per SKU.

## Who it's for

- 18–26, India, follows anime/manga but isn't a cosplayer
- Wants quiet statement pieces over loud fan merch
- Cares about fit, fabric weight, and design over brand recognition
- Shops on Instagram, checks prices in USD and INR, buys cash-on-delivery or UPI

## Non-negotiables

1. **No licensed IP** — no Naruto, no Goku, no Marvel, no Studio Ghibli characters. Ever.
2. **Original designs only** — AI-generated art is prompt-driven and lands on brand guidelines, never copies a known character.
3. **Bright warm daytime** — never default navy / dark mode / cyberpunk-only. Paper-white + coral + butter + iris is the visual signature.
4. **Small batch** — every drop is limited. No dead stock chasing trends.

## Design system

| Token | Value |
| --- | --- |
| Paper | `#FBF8F3` |
| Ink | `#1A1614` |
| Coral (primary) | `#FF4D6D` |
| Iris (secondary) | `#1E2AAE` |
| Butter (accent) | `#FFD166` |
| Leaf (success) | `#6B9E7F` |
| Display font | M PLUS 1p (JP-capable, weight 900) |
| Body font | DM Sans |
| Surface style | Warm neumorphism on controls; flat cards with hairline border |

Every surface has a `文字` somewhere — watermark, placeholder, logo. It's the brand glyph.

## MVP features (shipped in this repo)

### Shopper

- Home: hero with coral/butter/leaf blobs, category tiles, fresh drops grid, CTA
- Shop: filter by category, search, sort (newest / price / name)
- Product detail: image, description, size selector (S–XXL on apparel), qty stepper, Add to cart / Buy now
- Cart: localStorage-persisted, qty controls, free-shipping progress, sticky summary
- Checkout: shipping form → fake order ID (no payment integration yet per scope)
- Cart badge in nav, toast feedback on every action

### Admin (separate layout at `/admin/*`)

- Dashboard: total products, in-stock / out-of-stock counts, inventory value, category breakdown, recent adds
- Products CRUD: add, edit, delete, filter, search
- Image Studio: generate product art with AI (Pollinations FLUX, free) or upload a file; copies URL for use in product form

### Backend

- Express + Prisma over Supabase Postgres
- Image upload + generation → Supabase Storage (`product-images` bucket, public)
- 17 backend tests (Jest + Supertest, SQLite fallback)
- 13 frontend tests (Vitest + Testing Library)

## Not in this build (deliberate scope)

- Payment (Razorpay) — phase 2
- Order persistence in DB — phase 2
- Fulfilment integration (Printrove / Shiprocket) — phase 2
- User accounts / wishlist — phase 3
- Email / SMS notifications — phase 3
- Admin auth — phase 2 (currently URL-only access)

## Roadmap

**Phase 1 (shipped):** Catalog + cart + fake checkout + admin CRUD + AI art pipeline
**Phase 2:** Razorpay test mode, Order model + `/api/orders`, basic admin login, Printrove webhook
**Phase 3:** Shiprocket tracking, user accounts, wishlist, email notifications, GA/Meta pixels

## Tech decisions

- **Supabase** — Postgres + object storage + future-ready auth, free tier covers MVP.
- **Pollinations.ai** — free, keyless AI image gen via FLUX.1 schnell. No per-image cost. Optional swap to Replicate with `IMAGE_PROVIDER=replicate`.
- **React + Vite + React Router** — no Next.js, no TypeScript migration per scope.
- **No monorepo tooling** — plain `server/` + `client/`. Faster to reason about as a solo dev.
- **Prisma with dual schemas** — `schema.prisma` for Supabase Postgres (prod/dev), `test.prisma` for SQLite (tests / CI).
- **Admin as separate layout** — `/admin/*` has its own sidebar, no public navbar/footer. URL-gated for MVP, real auth later.
