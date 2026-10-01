# AGENTS.md

Online shop built entirely inside one Next.js 16 app: storefront, Google sign-in, cart, checkout, orders, admin. Neon Postgres (Drizzle) persists everything; Mailgun sends email. No separate backend.

**Roadmap:** `PLAN.md` — read the matching section before starting any feature (pages §7, data model §3, checkout §5, email §6, design §8–9, phases §12). Its "Implementation status" table at the top says what is built and what is left.

## Layers — the one rule that matters

Code lives in exactly one of three zones, and imports flow one way:

- **`app/`** — routing and composition. Pages/layouts `await` params, call `server/services` for reads and `server/auth/session` for guards, pass plain DTOs to components. Only route handler: `app/api/auth/[...all]`.
- **`components/`** — UI only. Receives data as props; mutates through `server/actions/*`. Imports `lib/*`, other components, and `server/actions/*` — nothing else from `server/`.
- **`server/`** — backend. Every file starts with `import "server-only"` except `server/actions/*`, which start with `"use server"`.
  - `db/` Drizzle client + schema → `repositories/` queries only → `services/` business rules → `actions/` the browser's only door.
  - `email/` Mailgun transport, one function per email, React Email templates. Reached only through `services/notification.service.ts` (one function per business event), which actions call inside `after()` so mail can never fail a request.
  - `storage/` Neon Object Storage (S3 API) transport only; `services/media.service.ts` owns upload rules. File bytes never go in Postgres or Server Actions; the DB stores object keys, never full URLs — bucket hostnames change per Neon branch (`PLAN.md` §6a).
  - `auth/` Better Auth instance, `getSession` / `requireUser` / `requireAdmin`.
  - `config/env.ts` zod-validated server env; read env through it, not `process.env`.
- **`lib/`** — client-safe code shared by both sides: zod validators, DTO types, pure utils, `pricing/`, `cart/` (pure merge rules), config, hooks, Better Auth client. Imports nothing from `components/` or `server/`. The cart zustand store lives in `components/cart/cart-store.ts` because it calls server actions.

Admin mutations use `updateTag` (not `revalidateTag(…, "max")`, which serves stale pages once) so changes show immediately. Uploads go browser → bucket via `createUploadUrlAction`; `media.service.verifyUploads` is the real size/type gate, since a signed URL can't cap size.

Scripts (`npm run db:seed`, `storage:cleanup`) run with `tsx --conditions react-server` so `server-only` is a no-op; a script that renders React email needs a plain `tsx` run instead. Put long-running work in a `main()` function (no top-level await).

One feature = one file per layer (`order.repo.ts`, `order.service.ts`, `checkout.actions.ts`, `lib/validators/checkout.ts`, `lib/types/order.ts`). Keep files single-purpose; split rather than grow a grab-bag. `create_module.sh <name>` scaffolds this set.

## Server actions

Shape every action the same way: `requireUser()`/`requireAdmin()` → `schema.safeParse(input)` → one service call → `updateTag`/`revalidateTag` → return `ActionResult<T>` (`{ ok: true, data } | { ok: false, error, fieldErrors? }`). Expected failures return `ok: false`; the client shows them via Sonner toast or inline field errors.

## Invariants

- Money is integer **kobo** end to end; only `formatMoney()` in UI formats it.
- The server recomputes prices, totals and stock from the DB; client-sent prices are ignored. `lib/pricing/calculate-totals.ts` is the single totals function for both display and checkout.
- Order placement runs in one transaction (Neon WebSocket `Pool` driver) with a conditional stock decrement and an idempotency key. Order items are snapshots.
- Emails send in `after()`, are logged to `email_logs`, and never fail the user's request.
- `proxy.ts` redirects are convenience only; `requireUser`/`requireAdmin` in layouts and actions are the security boundary.
- Next 16: `params`/`searchParams` are Promises; `proxy.ts` replaces `middleware.ts`.

## UI work

Load these skills before building or restyling UI: `frontend-design` and `ui-ux-pro-max` (direction, UX rules), `apple-design` and `emil-design-eng` (feel, springs, press feedback), `animate` for new motion, `review-animations` before calling motion done, `ask-sonner` for toasts.

- Colours, fonts, radii, motion tokens: `PLAN.md` §8 is the source; `app/globals.css` implements them. Use semantic token classes (`bg-surface`, `text-fg-muted`, `bg-primary`) — raw hex and `bg-white` break dark mode.
- Primitives live in `components/ui/`; compose them rather than restyling ad hoc. Tailwind classes must be static strings (use a lookup map, not template interpolation).
- Every interactive element: visible focus ring, ≥44px target, pointer-down press feedback, loading and disabled states. Every data view: skeleton matching final layout, empty state with a next action, error state with retry.
- Motion animates `transform`/`opacity` only and degrades to short fades under `prefers-reduced-motion`.
- Mobile-first; verify at 360px and 1440px, light and dark.

## Done means

`npm run lint`, `npx tsc --noEmit` and `npm run build` pass; the feature works end to end against the Neon database; the phase's done-criterion in `PLAN.md` §12 holds.
