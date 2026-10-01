# Shop — Implementation Plan

**Brief:** Build a website for a shop with a checkout page. Persist everything in Neon (Postgres). Send confirmation emails with Mailgun. Sign in with Google (Google Cloud Console OAuth). Everything lives in this one Next.js app — no separate backend.

**Status:** plan only. No code has been changed yet besides `AGENTS.md`, `CLAUDE.md`, `.env.example`, `.env.local`, and a `.gitignore` tweak.

---

## 0. Decisions at a glance

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19, already installed | Server Components + Server Actions give us a backend inside the app |
| Database | **Neon Postgres** + **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`) | Typed schema in TS, SQL-first, first-class Neon driver, easy migrations |
| Auth | **Better Auth** with Google social provider + Drizzle adapter | Auth.js is now maintained under the Better Auth project; Better Auth is the recommended path for new apps. Sessions stored in our DB |
| Email | **Mailgun REST API via `fetch`** (no SDK) + **React Email** templates | Zero-dependency transport, templates written as React components |
| File storage | **Neon Object Storage** (S3-compatible, beta) with presigned direct uploads; metadata in Postgres | Same vendor and project as the database; files never go in Postgres; S3 API means any S3 tool works and we can switch providers by changing env vars. See §6a |
| Validation | **Zod v4** (installed) — one schema shared by form and server action | Single source of truth for input rules |
| Client state | **Zustand** (installed) — guest cart + UI state only | Server is the source of truth for everything persisted |
| Motion | **`motion`** (Framer Motion successor) + CSS for simple transitions | Springs, layout animations, interruptible gestures |
| Toasts | **Sonner** (replaces `react-hot-toast`) | Better stacking, promise toasts, theming |
| Overlays | **Radix primitives** (Dialog, Dropdown, Select, Tabs, Accordion, Tooltip) + **Vaul** (mobile bottom sheet) | Accessible focus-trapping, keyboard support out of the box |
| Styling | Tailwind v4 (installed) with semantic CSS tokens | Already set up; tokens redefined below |
| Money | Integer **minor units** (kobo), currency `NGN` by default | No float rounding bugs |

### Open decisions — defaults chosen, change any of these before Phase 1

1. **What the shop sells + its name.** Default: **Ọjà** (Yoruba for "market"; code slug `oja`) — a Lagos shop of hand-made home and lifestyle goods: adire textiles, ceramics, woven baskets, candles, body care. The whole visual identity (below) is derived from indigo adire dye. Name/tagline live in one file (`lib/config/site.ts`), so renaming is a one-line change; the palette works for any lifestyle catalogue.
2. **Payment.** The brief does not ask for a payment provider. Default: **Pay on delivery** / **Bank transfer** (manual). `payment_method` and `payment_status` columns exist so Paystack (test mode) can slot in later as a stretch goal without schema changes.
3. **Guest checkout.** Default: **browsing and cart work signed-out; checkout requires Google sign-in.** This guarantees a verified email for the confirmation mail and ties orders to an account. The guest cart merges into the account cart on sign-in.
4. **Product variants (size/colour).** Default: **not in v1** — one SKU per product with stock count. Schema leaves room for a `product_variants` table later.

---

## 1. Current codebase audit

The repo is a reused admin/portfolio template (still branded "Medstaq"). It has no backend, no database, and no pages beyond a placeholder home.

**What exists**
- `app/` — root layout, placeholder `page.tsx` (Medstaq copy), `loading.tsx`, `not-found.tsx`, empty `app/(external)/`.
- `components/shared/` — ~50 generic components (Button, LinkButton, form inputs, Modal, FormModal, SlidePanel, Sidebar, Skeleton, Pagination, etc.).
- `lib/` — axios `API` client pointing at an external `NEXT_PUBLIC_API_URL`, zustand stores that call that external API (`auth`, `file`, `user`), zod validators, interfaces, utils.
- `create_module.sh` — scaffolds interface/validator/axios-service/zustand-store for an external REST API.

**Bugs and problems to fix during migration**
- `app/layout.tsx`: `<Toaster>` is rendered *outside* `<html>`; favicon path typo `/favidon/`; Medstaq metadata; Geist fonts are loaded but their CSS variables are never applied.
- `app/globals.css`: global `* { transition: … 150ms }` animates *every* property change on *every* element (jank, unwanted motion, fights with `motion`); `@custom-variant dark` declared twice; scrollbar thumb and track are the same colour; custom breakpoints drop Tailwind's `xl`/`2xl`; `bg-gradient-primary` is used by components but its utility is commented out.
- Two competing `variantStyles` (`lib/constants/styles.ts` and `components/shared/styles.ts`), the second references a non-existent `bg-gradeint-accent`.
- Dynamic Tailwind classes (`w-[${width}]`, `text-${titleSize}`, `bg-${backgroundColor}`) never get generated.
- `Tiptap.tsx` imports `@tiptap/*`, which is not installed (the `tiptap` package is an unrelated legacy one). `scrollToTop.ts` imports `react-router-dom` (not installed).
- `cookie.ts` and `localStorage.ts` touch `document`/`window` at import → crash during SSR.
- `Sidebar.tsx` uses `window` in a dependency array (SSR crash).
- `FormInput` spreads `...props` after `register()` so a passed `onChange`/`onBlur` silently breaks form binding.
- `toaster.info` calls `toast.error`.
- Modals have no focus trap, no Escape handling, no scroll lock, hard-coded `bg-white` (breaks dark mode).
- `package.json` name is `medstaq.web`.

**Keep / rewrite / delete**

| Item | Action |
|---|---|
| `lib/hooks/useZodForm.ts`, `lib/utils/formatter.ts`, `lib/utils/date.ts`, `lib/utils/string.tsx` | Keep, move into new `lib/` layout, add `formatMoney(kobo)` |
| `Button`, `LinkButton`, `Badge`, `Skeleton`, `Pagination`, `Avatar`, `Accordion`, `FormInput`, `TextAreaInput`, `FormCheckbox`, `FormToggle`, `SelectField`, `SearchField`, `PasswordInput`* | **Rewrite** as `components/ui/*` primitives on the new tokens (details in §9) |
| `Modal`, `ConfirmationModal`, `FormModal`, `SlidePanel` | Replace with Radix Dialog + Vaul `Sheet` |
| `PublicNavbar`, `AuthNavbar`, `Footer`, `Logo`, `Sidebar` | Rewrite as `SiteHeader`, `CheckoutHeader`, `SiteFooter`, `Logo`, `AdminSidebar` |
| `lib/utils/API.ts`, `lib/stores/{auth,file,user}`, `lib/hooks/auth/*`, `session.ts`, `cookie.ts`, `localStorage.ts`, `refetch.ts`, `scrollToTop.ts`, `objectToFormData.ts` | **Delete** — replaced by Server Actions, Better Auth and the server layer |
| `CustomFileUpload`, `FormFileUpload`, `Gallery`, `lib/stores/file/*`, `lib/validators/file.ts` | Replace with `components/admin/ImageUploader` + the upload flow in §6a (the old ones post files to an external API) |
| `Tiptap`, `TiptapField`, `JsonViewer`, `FileSelectField`, `CreatableMultiSelect`, `AdditionalInfoField`, `DynamicFormGroup`, `CurrencySelect`, `NavigationBar`, `ListSection`, `ListCard`, `Card`, breadcrumbs, `PhoneInput`, `SelectLocationFields`, `DateInput` | Delete; recreate only what the shop needs (`PhoneField`, `StateSelect` for addresses) |
| `create_module.sh` | **Rewrite** to scaffold the new layered module (schema → repo → service → actions → validator → types) |
| Deps `axios`, `dompurify`, `react-icons`, `react-hot-toast`, `tiptap`, `react-select`, `tailwindcss-animate` | Remove |
| `countrycitystatejson` | Keep (Nigerian states list for addresses) |

\*PasswordInput is not needed (Google-only auth) — delete.

---

## 2. Architecture and separation of concerns

Three zones, with imports flowing one way only.

```
┌───────────────────────── app/  (routing + composition only) ─────────────────────────┐
│  page.tsx / layout.tsx: await params, call server/services for reads, render components │
└───────────────┬─────────────────────────────────────────────────┬───────────────────┘
                │ props (plain DTOs)                              │ reads
                ▼                                                 ▼
┌──── components/  (UI only) ────┐   RPC   ┌──────────── server/  (backend, server-only) ────────────┐
│ presentational + client islands │ ──────► │ actions/ ─► services/ ─► repositories/ ─► db/          │
│ imports: lib/*, server/actions  │         │                    └──► email/  (Mailgun + templates) │
└──────────────┬──────────────────┘         │ auth/ (Better Auth config, session guards)  config/env │
               ▼                             └─────────────────────────────────────────────────────────┘
┌──── lib/  (client-safe, shared by both sides) ────┐
│ validators (zod), types (DTOs), pure utils, config, pricing, zustand stores, hooks, auth client │
└───────────────────────────────────────────────────┘
```

### Import rules (enforced by ESLint `no-restricted-imports` + the `server-only` package)

| From ↓ may import → | `lib/*` | `components/*` | `server/actions/*` | `server/services/*` | `server/repositories/*`, `server/db/*`, `server/email/*`, `server/storage/*` |
|---|---|---|---|---|---|
| `components/**` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `lib/**` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `app/**` (pages, layouts) | ✅ | ✅ | ✅ | ✅ (reads + guards) | ❌ |
| `server/actions/**` | ✅ | ❌ | — | ✅ | ❌ |
| `server/services/**` | ✅ | ❌ | ❌ | ✅ | ✅ |
| `server/repositories/**` | ✅ (types) | ❌ | ❌ | ❌ | ✅ (db only) |

Every file under `server/` except `server/actions/` starts with `import "server-only"`, so an accidental client import fails the build. Every file in `server/actions/` starts with `"use server"`.

**Responsibilities per layer**
- **`server/db/`** — Drizzle client and table definitions. Nothing else.
- **`server/repositories/`** — one file per aggregate. Only SQL/Drizzle queries; returns rows or DTOs. No business rules, no email, no auth.
- **`server/services/`** — business rules: pricing, stock checks, order placement, status transitions. Calls repositories, triggers email. Framework-agnostic (no `headers()`, no `redirect()`), so it's unit-testable.
- **`server/email/`** — `mailgun.ts` (transport), `email.service.ts` (one function per email), `templates/*.tsx` (React Email). Logs every send to `email_logs`.
- **`server/storage/`** — `object-storage.ts`: the S3 client pointed at Neon Object Storage and four primitives (`createPresignedPut`, `putObject`, `headObject`, `deleteObject`). Knows nothing about products; `media.service.ts` holds the rules.
- **`server/actions/`** — the only door from the browser. Each action: `requireUser()`/`requireAdmin()` → `schema.safeParse()` → call one service → `revalidateTag`/`updateTag` → return `ActionResult<T>`. No SQL here.
- **`server/auth/`** — Better Auth instance and `getSession()`, `requireUser()`, `requireAdmin()`.
- **`server/config/env.ts`** — zod-validated server env; crashes early with a readable message if a variable is missing.

### Target folder structure

```
app/
  layout.tsx                 # fonts, theme script, <Toaster/>, providers
  globals.css                # tokens + base styles (see §8)
  not-found.tsx  error.tsx  global-error.tsx
  sitemap.ts  robots.ts
  (shop)/                    # header + footer + cart drawer
    layout.tsx
    page.tsx                                 # Home
    shop/page.tsx                            # All products (filters, sort, search)
    shop/[category]/page.tsx                 # Category listing
    products/[slug]/page.tsx                 # Product detail
    cart/page.tsx
    about/page.tsx  contact/page.tsx  faq/page.tsx
    shipping-returns/page.tsx  privacy/page.tsx  terms/page.tsx
  (checkout)/                # distraction-free header, no footer
    layout.tsx
    checkout/page.tsx
    checkout/success/[orderNumber]/page.tsx
  (auth)/
    login/page.tsx
  (account)/
    account/layout.tsx       # requireUser + account nav
    account/page.tsx  account/orders/page.tsx  account/orders/[orderNumber]/page.tsx
    account/addresses/page.tsx  account/wishlist/page.tsx
  admin/
    layout.tsx               # requireAdmin + sidebar
    page.tsx                 # dashboard
    products/page.tsx  products/new/page.tsx  products/[id]/page.tsx
    categories/page.tsx  orders/page.tsx  orders/[orderNumber]/page.tsx
    customers/page.tsx  messages/page.tsx
  api/auth/[...all]/route.ts # Better Auth handler (only API route we need)

components/
  ui/        Button IconButton Input Textarea Select Checkbox RadioCard Switch Badge Skeleton
             Dialog Sheet DropdownMenu Tabs Accordion Tooltip QuantityStepper Price Kbd
             EmptyState Pagination Breadcrumbs Avatar Separator Spinner Field(label/hint/error)
  brand/     Logo AdirePattern (signature SVG) SuccessSeal
  layout/    SiteHeader MobileNav SiteFooter CheckoutHeader AccountNav AdminSidebar ThemeToggle
  home/      Hero CategoryRail ProductShelf StoryBand ValueProps NewsletterBand
  product/   ProductCard ProductGrid ProductGallery AddToCartButton WishlistButton
             FilterSheet FilterChips SortMenu StockBadge ProductInfoTabs StickyBuyBar
  search/    CommandSearch (⌘K)
  cart/      CartDrawer CartLine CartSummary CartBadge EmptyCart CartSync (guest→account merge)
  checkout/  CheckoutFlow CheckoutStepper ContactStep AddressStep DeliveryStep ReviewStep
             OrderSummary MobileSummaryToggle PlaceOrderButton
  order/     OrderStatusTimeline OrderCard OrderItemsList
  account/   AddressCard AddressForm AccountOverview
  admin/     StatCard DataTable ProductForm OrderStatusSelect ImageUploader
  auth/      GoogleSignInButton UserMenu
  motion/    Reveal Stagger PressScale FlyToCart

lib/                          # client-safe
  config/    site.ts (name, tagline, nav, socials)  shop.ts (currency, shipping methods, free-shipping threshold)
             public-env.ts
  validators/ cart.ts checkout.ts address.ts product.ts category.ts contact.ts order.ts media.ts
  types/     product.ts category.ts cart.ts order.ts address.ts user.ts action-result.ts
  pricing/   calculate-totals.ts   # pure; used for display on client AND authoritatively on server
  stores/    cart.store.ts (guest cart, persisted) ui.store.ts (drawer/search open)
  hooks/     useCart useZodForm useMediaQuery useScrollDirection useReducedMotion useUpload (XHR PUT with progress)
  utils/     cn.ts money.ts date.ts slug.ts order-number.ts image.ts (getImageUrl: storage key or external URL)
  auth/      client.ts (Better Auth React client: signIn.social, signOut, useSession)

server/                       # server-only
  config/env.ts
  db/        client.ts  schema/{auth,catalog,cart,wishlist,address,order,email-log,contact,upload}.ts  schema/index.ts
             migrations/  seed/index.ts  seed/data/{categories,products}.ts
  auth/      auth.ts  session.ts
  repositories/ product.repo.ts category.repo.ts cart.repo.ts wishlist.repo.ts address.repo.ts
                order.repo.ts user.repo.ts contact.repo.ts email-log.repo.ts upload.repo.ts
  services/  catalog.service.ts cart.service.ts checkout.service.ts order.service.ts
             address.service.ts wishlist.service.ts admin.service.ts contact.service.ts media.service.ts
  storage/   object-storage.ts (S3 client → Neon Object Storage: presign, put, head, delete)
  email/     mailgun.ts email.service.ts
             templates/{OrderConfirmation,OrderStatusUpdate,Welcome,ContactNotification,NewOrderAlert}.tsx
             templates/components/EmailLayout.tsx
  actions/   cart.actions.ts checkout.actions.ts address.actions.ts wishlist.actions.ts contact.actions.ts
             admin/product.actions.ts admin/category.actions.ts admin/order.actions.ts admin/media.actions.ts

scripts/
  storage-cleanup.ts          # deletes abandoned uploads (see §6a)
proxy.ts                      # Next 16 replacement for middleware.ts — optimistic auth redirects
drizzle.config.ts
```

### Conventions
- **`ActionResult<T>`** = `{ ok: true; data: T } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }`. Actions never throw to the client for expected failures.
- **Next 16 specifics:** `params`/`searchParams` are Promises (`await` them); `proxy.ts` replaces `middleware.ts`; use `updateTag()` in actions for read-your-own-writes and `revalidateTag(tag, "max")` for background refresh. Cache tags: `products`, `product:{slug}`, `categories`, `cart:{userId}`, `orders:{userId}`.
- **Money:** always integer kobo in DB, services and DTOs. Only `formatMoney()` in the UI turns it into `₦12,500.00`.
- **Dates:** `timestamptz` in DB, ISO strings in DTOs.
- **IDs:** `uuid` primary keys; human-facing order numbers like `OJ-7K2F9Q`.

---

## 3. Data model (Drizzle, Postgres on Neon)

Better Auth tables (`user`, `session`, `account`, `verification`) are generated with `npx @better-auth/cli generate` into `server/db/schema/auth.ts`, then extended:

- **user** — Better Auth fields (`id`, `name`, `email`, `emailVerified`, `image`, timestamps) + `role` (`customer` | `admin`, default `customer`) + `phone` (nullable).

Shop tables:

| Table | Columns (abridged) | Notes |
|---|---|---|
| `categories` | `id`, `slug` (unique), `name`, `description`, `image_url`, `sort_order`, timestamps | |
| `products` | `id`, `slug` (unique), `name`, `short_description`, `description`, `price` (int kobo), `compare_at_price` (int, nullable), `stock` (int ≥ 0), `category_id` → categories, `is_active`, `is_featured`, `materials`, `care`, timestamps | index on `category_id`, `is_active`, `created_at`; `tsvector` or `ILIKE` search on name |
| `product_images` | `id`, `product_id` → products (cascade), `storage_key` (nullable), `external_url` (nullable), `alt`, `position`, `width`, `height` | exactly one of `storage_key` / `external_url` set; URL built at read time (keys survive branch/host changes); first image = cover, second = hover image |
| `uploads` | `id`, `storage_key` (unique), `content_type`, `size_bytes`, `purpose` (`product`/`category`), `status` (`pending`/`attached`), `uploaded_by` → user, `created_at`, `attached_at` | ledger of every file in the bucket; lets us clean up abandoned uploads |
| `carts` | `id`, `user_id` → user (unique), `updated_at` | one cart per signed-in user |
| `cart_items` | `cart_id` → carts (cascade), `product_id` → products, `quantity` (1–20), `added_at` | PK (`cart_id`, `product_id`) |
| `wishlist_items` | `user_id`, `product_id`, `created_at` | PK (`user_id`, `product_id`) |
| `addresses` | `id`, `user_id`, `full_name`, `phone`, `line1`, `line2`, `city`, `state`, `country` (default `NG`), `postal_code`, `is_default`, timestamps | |
| `orders` | `id`, `order_number` (unique), `user_id`, `email`, `status` enum, `payment_method` enum, `payment_status` enum, `subtotal`, `shipping_fee`, `discount`, `total`, `currency`, `shipping_method`, `shipping_address` (jsonb snapshot), `notes`, `idempotency_key` (unique), `confirmation_email_sent_at`, `placed_at`, timestamps | status: `pending → confirmed → processing → shipped → delivered`, or `cancelled` |
| `order_items` | `id`, `order_id` (cascade), `product_id` (nullable, set null), `product_name`, `product_slug`, `image_url`, `unit_price`, `quantity`, `line_total` | **snapshot** — order history never changes when a product is edited |
| `order_status_events` | `id`, `order_id`, `status`, `note`, `created_at`, `created_by` | powers the order timeline |
| `email_logs` | `id`, `to`, `template`, `subject`, `status` (`sent`/`failed`), `provider_message_id`, `error`, `order_id` (nullable), `created_at` | every Mailgun call recorded |
| `contact_messages` | `id`, `name`, `email`, `subject`, `message`, `status` (`new`/`read`), `created_at` | |
| `newsletter_subscribers` | `id`, `email` (unique), `created_at` | footer signup |

Scripts added to `package.json`: `db:generate` (drizzle-kit generate), `db:migrate` (drizzle-kit migrate), `db:studio`, `db:seed` (`tsx server/db/seed/index.ts`). Migrations use the **unpooled** Neon URL; the app uses the **pooled** URL.

Seed: 6 categories, ~24 products with real-feeling names, copy, prices and 2 images each (Unsplash URLs, allowed in `next.config.ts` `images.remotePatterns`).

---

## 4. Authentication (Google via Better Auth)

1. `server/auth/auth.ts` — `betterAuth({ database: drizzleAdapter(db, { provider: "pg", schema }), socialProviders: { google: { clientId, clientSecret } }, user: { additionalFields: { role, phone } }, databaseHooks: { user: { create: { after } } }, plugins: [nextCookies()] })`.
   - `after` hook: if the email is in `ADMIN_EMAILS`, set `role = "admin"`; send the **Welcome** email (non-blocking).
2. `app/api/auth/[...all]/route.ts` — `export const { GET, POST } = toNextJsHandler(auth)`.
3. `lib/auth/client.ts` — `createAuthClient()`; UI uses `signIn.social({ provider: "google", callbackURL })`, `signOut()`, `useSession()`.
4. `proxy.ts` — optimistic check with `getSessionCookie()` for `/checkout`, `/account/*`, `/admin/*` → redirect to `/login?next=…`. **Not** the security boundary.
5. `server/auth/session.ts` — the real guard: `requireUser()` / `requireAdmin()` read `auth.api.getSession({ headers: await headers() })`, used in protected layouts **and** at the top of every action.
6. On first authenticated load, `<CartSync>` calls `mergeGuestCartAction(localItems)`, then clears the local cart.

**Login page UX:** one large "Continue with Google" button, a line on why (track orders, saved addresses), return to `next` after sign-in, friendly error state if the user cancels consent.

---

## 5. Cart and checkout

### Cart
- **Signed out:** zustand store persisted to `localStorage` (`productId`, `quantity`). Prices are never stored client-side; the drawer fetches fresh product data.
- **Signed in:** `cart_items` in Neon via `cart.actions.ts` (`addToCart`, `updateQuantity`, `removeFromCart`, `mergeGuestCart`). UI uses `useOptimistic` so quantities update instantly and roll back with a toast on failure.
- Quantity clamps to available stock; out-of-stock lines are flagged in the drawer and blocked at checkout.

### Checkout page (`/checkout`) — one page, four steps, sticky summary
1. **Contact** — prefilled from the Google account (name, email, read-only), add phone.
2. **Shipping address** — pick a saved address (radio cards) or add a new one (optionally save to the address book). Nigerian states dropdown.
3. **Delivery** — radio cards: Standard (₦3,500, 3–5 days; Lagos 1–2), Express (₦7,500, next day in Lagos). Free Standard over ₦100,000. Values live in `lib/config/shop.ts`.
4. **Review & pay** — line items, address, delivery, payment method (Pay on delivery / Bank transfer), notes, **Place order**.

UX details: steps collapse into editable summaries once completed; inline validation on blur; step content slides in the direction of travel; order summary is a sticky right column on desktop and a collapsible "Show order summary · ₦48,500" bar on mobile; Place order shows a pending state and is disabled while submitting; a generated `idempotencyKey` makes double-submits harmless.

### `placeOrderAction` → `checkoutService.placeOrder()`
1. `requireUser()`; `checkoutSchema.safeParse(input)`.
2. Load the user's cart and the current product rows from the DB (**client prices are ignored**).
3. Validate: cart not empty, every product active, `quantity ≤ stock`.
4. `calculateTotals()` (shared pure function) with DB prices + shipping method.
5. **One transaction** (Neon WebSocket `Pool` driver — the HTTP driver cannot run interactive transactions):
   insert `orders` (status `confirmed`), insert `order_items` snapshots, `UPDATE products SET stock = stock - q WHERE id = ? AND stock >= q` (abort if 0 rows), insert first `order_status_events` row, clear `cart_items`.
6. `after(() => emailService.sendOrderConfirmation(orderId))` and `sendNewOrderAlert` to the shop inbox — runs after the response, so a Mailgun outage never fails the order.
7. `updateTag("cart:{userId}")`, `updateTag("orders:{userId}")`, `revalidateTag("products", "max")`; return `{ orderNumber }` → client navigates to `/checkout/success/[orderNumber]`.

### Success page
Adire "seal" stamp animation, order number in mono, "We've emailed a confirmation to you@…", items + totals + delivery estimate, buttons: **View order** and **Continue shopping**. Page verifies the order belongs to the current user.

---

## 6. Emails (Mailgun)

- **Transport** `server/email/mailgun.ts`: `POST {MAILGUN_API_BASE_URL}/v3/{MAILGUN_DOMAIN}/messages` with Basic auth `api:{MAILGUN_API_KEY}` and `FormData` (`from`, `to`, `subject`, `html`, `text`, `o:tag`). Returns `{ id }` or throws a typed error.
- **Templates** (React Email, rendered to HTML + plain text), sharing `EmailLayout` with the brand palette and a thin adire border:
  | Email | Trigger | Recipient |
  |---|---|---|
  | **Order confirmation** (required by brief) | order placed | customer |
  | New order alert | order placed | `SHOP_NOTIFICATIONS_EMAIL` |
  | Order status update | admin moves an order to shipped / delivered / cancelled | customer |
  | Welcome | first Google sign-in | customer |
  | Contact notification | contact form submitted | `SHOP_NOTIFICATIONS_EMAIL` |
- **`email.service.ts`**: one function per email; each renders, sends, writes an `email_logs` row (sent/failed + Mailgun id), and for confirmations sets `orders.confirmation_email_sent_at`. Failures are logged, never thrown to the user. Admin order page shows email status with a **Resend confirmation** button.
- **Sandbox note:** a Mailgun sandbox domain only delivers to *authorized recipients* — add your own address in Mailgun before testing, or verify a real sending domain.

---

## 6a. File uploads & storage (Neon Object Storage)

**What gets uploaded:** product images and category images, by admins only. Customers upload nothing (their avatar comes from Google).

**Where things live:** image files live in a **Neon Object Storage** bucket (S3-compatible, part of the same Neon project as the database); Postgres stores only metadata (`uploads`, `product_images`). One vendor, one dashboard, one set of credentials pulled by `neon env pull`.

**Status: beta.** Things to know up front (from Neon's docs):
- Available only in AWS regions `us-east-2`, `us-east-1`, `eu-central-1`, `ap-southeast-1` — **create the Neon project in one of these**, or storage won't be offered.
- Free plan: 5 GB per project; max object 5 GiB; heavy bursts can return `503 SlowDown` (the SDK retries).
- Buckets **branch with the database**: every Neon branch has its own isolated bucket namespace and its own public hostname. Great for preview/dev branches (test uploads never touch production), but it means **we never store full URLs** — only the object key — and build the URL at read time from `STORAGE_PUBLIC_URL`.
- Credential `expires_at` is not enforced yet — revoke unused credentials by hand.

**Bucket:** `oja-media`, access level **`public_read`** (anyone can read an image by URL, only our server can write). Public URLs look like `https://<branch-id>.storage.c-<N>.<region>.aws.neon.tech/oja-media/<key>`. That host is added to `images.remotePatterns` in `next.config.ts`; every image renders through `next/image`, which resizes and serves WebP/AVIF.

### Upload flow — direct to bucket (primary)
The browser `PUT`s the file straight to the bucket with a short-lived presigned URL. Our server signs and records but never handles the bytes, so Server Action body limits (1 MB default) and serverless payload limits (~4.5 MB on Vercel) don't apply.

```
Admin drops files in <ImageUploader>
  │ 1. client checks type (jpeg/png/webp/avif) + size (≤ 10 MB), then resizes in the browser
  │    to max 2400px and re-encodes as WebP (~300–900 KB) — faster uploads, smaller bucket
  ▼
createUploadUrlAction({ contentType, size, purpose })                  server/actions/admin/media.actions.ts
  │ 2. requireAdmin() → mediaUploadSchema.safeParse()
  │ 3. mediaService.createUpload(): key = products/<uuid>.webp  (server-generated, never the user's filename)
  │    objectStorage.createPresignedPut(key, contentType) → expires in 120 s
  │    uploadRepo.insert({ key, status: "pending", uploadedBy })
  ▼ returns { uploadId, url, method, headers }
Browser sends the file to url with method + headers (XHR → real progress bar, cancel, retry)   lib/hooks/useUpload.ts
  ▼
Admin saves the product → saveProductAction({ ..., images: [{ uploadId, alt, position }] })
  │ 4. mediaService.attach(): objectStorage.headObject(key) confirms the file exists, type is an image, size ≤ 10 MB
  │    (reject + delete the object otherwise — the signature can't cap size, so this check is the real gate)
  │ 5. one transaction: write product_images rows (storage_key), mark uploads "attached"
  ▼ updateTag("product:{slug}"), revalidateTag("products", "max")
```

### Fallback — upload through our server
Neon's docs don't yet document CORS settings for browser uploads. **Phase 9 starts with a 30-minute spike** that presigns a URL and `PUT`s from `localhost:3000`. If the browser blocks it with a CORS error, switch to: `POST /api/admin/uploads` (a route handler, admin-only) that receives the file and streams it to the bucket with `PutObjectCommand`. Because step 1 already shrinks images to well under 1 MB, this stays inside serverless body limits. Only `useUpload` and one route handler change; the service, repository, schema and UI stay the same.

### Deleting and cleanup
- Removing an image or deleting a product deletes its `product_images` row, then deletes the object in `after()`. **Exception:** if the image is still referenced by an `order_items` snapshot, the object is kept so order history keeps its pictures.
- Abandoned uploads (admin uploaded, then closed the form) stay `pending`. `npm run storage:cleanup` (`scripts/storage-cleanup.ts`) deletes `pending` uploads older than 24 h from the bucket and the DB. Run it by hand, or on a schedule with Vercel Cron / a GitHub Action.

### `ImageUploader` UX
Drag-and-drop zone plus "Browse" button (keyboard accessible) and paste-from-clipboard; several files at once; thumbnail per file with progress ring, cancel, retry on failure; drag to reorder (first = cover, second = hover image, labelled); alt-text field per image (required before save); remove with Undo toast. Clear errors: "This file is 14.2 MB — the limit is 10 MB."

### Security
Admin-only actions; content-type allowlist; random server-generated keys; 120-second URL expiry; `headObject` size/type check before attaching; a **write-scoped credential** (`storage:write`) used only on the server via `server/config/env.ts` — never sent to the browser; bucket is `public_read`, so reads need no credential.

### Seed data
Seed products use external Unsplash URLs (`external_url` set, `storage_key` null), so seeding needs no bucket. Admin uploads go to Neon storage. Both render the same way through `getImageUrl(image)` in `lib/utils/image.ts`.

### Swapping providers
Only `server/storage/object-storage.ts` knows the provider. Any S3-compatible store (AWS S3, Backblaze B2, MinIO) is an env change. Vercel Blob would mean rewriting that one file plus `useUpload`.

---

## 7. Pages

Every page gets: loading skeleton (`loading.tsx` matching the final layout, no layout shift), empty state with a clear next action, error boundary with retry, correct `<title>`/meta, and works from 360px to 1440px+.

### Storefront `(shop)`
| Route | Content | Key interactions |
|---|---|---|
| `/` Home | Hero (signature adire panel + headline + two CTAs), category rail, "New in" shelf, "Best sellers" shelf, story band (the makers), value props (delivery, returns, secure checkout), newsletter band | Scroll-reveal stagger on shelves; horizontal snap-scroll shelves on mobile; hover image swap on cards |
| `/shop` | All products; filter by category, price range, in-stock; sort (newest, price ↑↓, popular); search `?q=`; result count; pagination ("Load more" with URL page param) | Filters sync to URL (shareable, back button works); desktop sidebar filters, mobile bottom-sheet filters; active filter chips removable with layout animation; results fade while pending (`useTransition`) |
| `/shop/[category]` | Category header (name, description, image) + same grid/filters scoped | Same as above |
| `/products/[slug]` | Gallery (thumbs + zoom on desktop, swipe carousel on mobile), name, price (+ compare-at strike), stock badge, quantity stepper, Add to bag, wishlist, tabs (Details / Materials & care / Delivery & returns), "You may also like" | Add to bag → button morphs to ✓ "Added", cart badge bumps, drawer opens; sticky buy bar on mobile once the main button scrolls out; JSON-LD `Product` schema |
| `/cart` | Full cart: lines, quantity steppers, remove (with Undo toast), subtotal, shipping estimate, free-shipping progress bar, Checkout CTA | Optimistic updates; empty state links to shop |
| `/about` | Brand story, makers, values | Editorial layout |
| `/contact` | Form (name, email, subject, message) → DB + email to shop; shop details | Inline validation, success state replaces the form |
| `/faq` | Accordion by topic | Animated accordion, deep-linkable questions |
| `/shipping-returns`, `/privacy`, `/terms` | Static content | Readable prose layout |

**Global storefront chrome:** translucent sticky header (hides on scroll down, returns on scroll up) with logo, category nav, ⌘K search, wishlist, account menu (avatar from Google), cart badge; mobile hamburger → full-height sheet; **cart drawer** (right sheet on desktop, draggable bottom sheet on mobile); footer with adire band, link columns, newsletter, socials.

### Checkout `(checkout)`
| Route | Content |
|---|---|
| `/checkout` | Four-step flow + order summary (see §5). Minimal header (logo + "Secure checkout" + back to bag) |
| `/checkout/success/[orderNumber]` | Confirmation (see §5) |

### Auth
| Route | Content |
|---|---|
| `/login` | Google sign-in card, reasons to sign in, redirect back to `next` |

### Account `(account)` — requires sign-in
| Route | Content |
|---|---|
| `/account` | Greeting, recent orders (3), default address, quick links |
| `/account/orders` | Order list: number, date, status pill, total, thumbnails |
| `/account/orders/[orderNumber]` | Status timeline, items, address, totals, payment method |
| `/account/addresses` | Address cards; add / edit (dialog) / delete / set default |
| `/account/wishlist` | Saved products grid, move to bag |

### Admin `admin/` — requires `role = admin`
| Route | Content |
|---|---|
| `/admin` | Stat cards (revenue today / 30 days, orders, avg order value, low-stock count), recent orders, top products |
| `/admin/products` | Table: image, name, category, price, stock, active; search; filter; toggle active inline |
| `/admin/products/new`, `/admin/products/[id]` | Product form: name, slug (auto), category, description, price, compare-at, stock, featured, active, `ImageUploader` (drag-drop upload, reorder, alt text — §6a) |
| `/admin/categories` | CRUD in dialogs, single-image `ImageUploader` per category |
| `/admin/orders` | Table with status filter tabs and search by order number/email |
| `/admin/orders/[orderNumber]` | Order detail, status select (writes a status event + emails the customer), email log with Resend |
| `/admin/customers` | Users with order count and lifetime spend |
| `/admin/messages` | Contact messages, mark read |

### System
`not-found.tsx` (branded, search + popular categories), `error.tsx` / `global-error.tsx` (retry), `sitemap.ts`, `robots.ts`, Open Graph image.

---

## 8. Design direction

**Subject:** a Lagos shop of hand-made goods. **Audience:** design-minded shoppers, mostly on phones. **Every page's one job:** make it effortless to find something beautiful and buy it.

The generator in `ui-ux-pro-max` proposed an emerald/orange "vibrant block" system with Rubik + Nunito Sans. That is a stock e-commerce template, so it was rejected in favour of a direction taken from the subject itself: **adire, the Yoruba indigo resist-dyed cloth**.

### Palette — "Indigo vat" (all text pairs checked, WCAG AA or better)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F5F6FA` chalk | `#0C0E26` night indigo | page |
| `--surface` | `#FFFFFF` | `#151838` | cards, sheets |
| `--surface-2` | `#ECEEF6` | `#1D2148` | inputs, muted panels |
| `--fg` | `#14163A` ink | `#EEF0FA` | text (16.1:1 / 16.7:1) |
| `--fg-muted` | `#585C7E` | `#A3A7C7` | secondary text (6.0:1 / 8.1:1) |
| `--border` | `#DADDEB` | `#2A2F5C` | hairlines |
| `--primary` | `#2E36A0` adire indigo | `#8C95FF` | buttons, links, focus ring |
| `--on-primary` | `#FFFFFF` | `#0C0E26` | (9.8:1 / 7.1:1) |
| `--accent` | `#F0B429` turmeric | `#F5C24C` | sale tags, badges, highlights — never body text |
| `--on-accent` | `#14163A` | `#0C0E26` | (9.3:1 / 11.5:1) |
| `--success` | `#1F7A55` leaf | `#4CC38A` | in stock, delivered |
| `--danger` | `#C8324B` hibiscus | `#FF6B81` | errors, remove |

Replaces the current lime `#97da00` / blue `#0085fe` / navy palette entirely. Tokens are mapped in `@theme inline` so Tailwind classes read `bg-surface text-fg border-border bg-primary`. Dark mode follows the system by default with a manual toggle (no flash: inline theme script in `<head>`).

### Typography
| Role | Face | Treatment |
|---|---|---|
| Display | **Bricolage Grotesque** (variable, optical sizing) | Headlines only; tight tracking (`-0.03em` at hero sizes, `-0.01em` at h3), line-height 1.0–1.1 |
| Body / UI | **Instrument Sans** | 16px base, line-height 1.55, tracking 0 |
| Utility | **Geist Mono** (already a dep) | Prices, order numbers, SKUs, step counters — tabular numerals |

Fluid scale with `clamp()`: hero `clamp(2.75rem, 7vw, 6rem)`, h1 `clamp(2rem, 4vw, 3.25rem)`, h2 `clamp(1.5rem, 3vw, 2.25rem)`. Loaded via `next/font/google` as CSS variables.

### Signature element — the adire pattern
One hand-built SVG pattern (`components/brand/AdirePattern.tsx`) inspired by *adire eleko* motifs: concentric circles, dot grids and stripes in tone-on-tone indigo. It appears in exactly four places: the **hero panel** (where product photos sit in round "resist" cut-outs), the **footer band**, the **empty-cart illustration**, and the **order-success seal** (which stamps in). Everything else stays quiet: generous whitespace, hairline borders, restrained colour.

### Layout & shape
- Container max 1280px, gutters 16px (mobile) → 24px → 40px (desktop). Tailwind default breakpoints restored (`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`), mobile-first.
- Radius: 10px controls, 16px cards, 24px sheets/hero panels, full for pills. Product images 4:5.
- Elevation: flat by default; soft indigo-tinted shadow only on hover/lifted and overlays.
- Spacing scale: 4-pt base; sections 64px mobile / 112px desktop.

### Motion (from `apple-design`, `emil-design-eng`, `animate`)
- Tokens: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--dur-fast 120ms`, `--dur-base 200ms`, `--dur-slow 320ms`. Default spring: `{ type: "spring", bounce: 0, duration: 0.35 }`; bounce `0.15` only for drag-released sheets.
- **Remove the global `* { transition }`**; transition only specific properties on specific components. Animate only `transform` and `opacity`.
- Press feedback on pointer-down: `scale(0.97)` on every button and card.
- Add to bag: label → ✓ morph, cart badge bump, drawer slides in from the right (and leaves to the right).
- Cart/filter sheets on mobile: Vaul bottom sheets with drag-to-dismiss, velocity-aware.
- Product card hover (pointer devices only): second image cross-fades in, card lifts 2px.
- Scroll reveals: shelves fade-up 12px with 60ms stagger, once only.
- Checkout steps: content slides in the direction of travel; completed steps collapse with height animation.
- Header: translucent `backdrop-filter` blur, hides on scroll down.
- Skeletons: subtle shimmer, same dimensions as final content.
- `prefers-reduced-motion`: all slides/springs become 150ms opacity fades; no parallax, no stamp.

### Accessibility & quality floor
Visible 2px focus ring (`--primary`, 2px offset) on everything; 44×44px min touch targets; all icon buttons have `aria-label`; Radix dialogs trap focus and close on Esc; form errors sit under their field and are announced (`aria-describedby`, `aria-live` for summary); images have `alt`; `next/image` with `sizes` everywhere; no horizontal scroll at 360px; Lighthouse ≥ 90 on Performance/Accessibility/Best Practices/SEO for home, PDP and checkout.

### Copy voice
Plain, warm, specific. Buttons say what happens ("Add to bag", "Place order", "Save address"). Errors say what went wrong and how to fix it ("Only 2 left — we've updated your bag"). Empty states invite action ("Your bag is empty. Start with our new adire throws →").

---

## 9. Component redesign plan

All primitives move to `components/ui/`, use tokens only (no raw hex, no `bg-white`), accept `className`, forward refs, and ship with focus/hover/active/disabled/loading states.

| Component | Changes |
|---|---|
| **Button** | Variants `primary` · `secondary` (surface-2) · `outline` · `ghost` · `danger` · `link`; sizes `sm 36px` · `md 44px` · `lg 52px` · `icon`; `loading` keeps width (spinner replaces label, no layout jump); pointer-down scale; `asChild` so `LinkButton` becomes `<Button asChild><Link/></Button>` |
| **Field / Input / Textarea / Select** | Single `Field` wrapper with label, hint, error, required marker; 44px height; error border + message with `aria-describedby`; `FormInput` bug with overridden `register` handlers fixed |
| **Checkbox / Switch / RadioCard** | Radix-based; `RadioCard` for addresses, delivery and payment choices |
| **Badge** | Tones: neutral, primary, accent (sale), success, danger; sizes |
| **Skeleton** | Shimmer, plus `ProductCardSkeleton`, `ProductGridSkeleton`, `OrderRowSkeleton` |
| **Dialog / Sheet** | Radix Dialog (focus trap, Esc, scroll lock), Vaul for mobile bottom sheets; replaces Modal, FormModal, ConfirmationModal, SlidePanel |
| **DropdownMenu, Tabs, Accordion, Tooltip** | Radix; Tabs with sliding indicator (`layoutId`); Accordion with height animation |
| **QuantityStepper** | −/＋ 44px targets, direct input, clamps to stock, announces value |
| **Price** | Mono tabular numerals, compare-at strike-through, sale badge |
| **Pagination** | Windowed (1 … 4 5 6 … 20), links not buttons (URL-driven) |
| **EmptyState, Breadcrumbs, Avatar, Kbd, Separator, Spinner** | New/rewritten on tokens |
| **Toasts** | Sonner, themed to tokens, bottom-center on mobile / bottom-right on desktop, Undo action support |
| **SiteHeader / MobileNav / SiteFooter / AdminSidebar** | Rewritten per §7 |

---

## 10. Environment & third-party setup

`.env.example` (committed) and `.env.local` (git-ignored) are already created with every variable. Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally; production URL when deployed |
| `DATABASE_URL` | Neon → project → **Connect** → *Pooled connection* string (host contains `-pooler`), `?sslmode=require` |
| `DATABASE_URL_UNPOOLED` | Same dialog with *Connection pooling* off (direct host) — used by migrations |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Same as `NEXT_PUBLIC_APP_URL` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud Console (steps below) |
| `ADMIN_EMAILS` | Comma-separated Google emails that become admins on first sign-in |
| `MAILGUN_API_KEY` | Mailgun → Account → API keys (a **Sending** or private API key) |
| `MAILGUN_DOMAIN` | Your verified sending domain, or the sandbox domain (`sandboxXXXX.mailgun.org`) |
| `MAILGUN_API_BASE_URL` | `https://api.mailgun.net` (US) or `https://api.eu.mailgun.net` (EU region) |
| `MAIL_FROM` | e.g. `Ọjà <orders@your-domain.com>` — must be on `MAILGUN_DOMAIN` |
| `SHOP_NOTIFICATIONS_EMAIL` | Inbox that receives new-order and contact alerts |
| `AWS_ENDPOINT_URL_S3`, `AWS_REGION` | Neon Object Storage endpoint and region for the branch — `neon env pull`, or Console → **Connect → Storage** |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Neon storage credential with `storage:read` + `storage:write` (`token_id` → key ID, `s3_secret_access_key` → secret) |
| `STORAGE_BUCKET` | `oja-media` |
| `STORAGE_PUBLIC_URL` | Public base URL of the bucket, e.g. `https://<branch-id>.storage.c-<N>.us-east-2.aws.neon.tech/oja-media` |

**Google Cloud Console**
1. Create/select a project → **APIs & Services → OAuth consent screen**: External, app name, support email, scopes `openid`, `email`, `profile`; add yourself as a test user while in Testing mode.
2. **Credentials → Create credentials → OAuth client ID → Web application.**
3. Authorized JavaScript origins: `http://localhost:3000` (+ production URL).
4. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (+ `https://<prod>/api/auth/callback/google`).
5. Copy client ID and secret into `.env.local`.

**Neon:** create a project (region close to your users/host), copy both connection strings, then `npm run db:migrate && npm run db:seed`.

**Mailgun:** add and verify a domain (DNS: SPF, DKIM, MX, tracking CNAME), or use the sandbox domain and add your email under **Authorized recipients**. Match `MAILGUN_API_BASE_URL` to the domain's region.

**Neon Object Storage:**
1. Make sure the Neon project is in `aws-us-east-2`, `aws-us-east-1`, `aws-eu-central-1` or `aws-ap-southeast-1` (storage is only offered there).
2. Neon Console → project → branch `main` → **Object storage** tab → **New bucket** → name `oja-media`, access level **Public read** → Create. (CLI: `neon buckets create oja-media`.)
3. Credentials: Console → **Connect** → **Storage** tab → **Reveal credential**, or CLI `neon credentials create --scope storage:read --scope storage:write --name oja-server`. Copy the key ID and secret immediately — shown once. Or run `neon env pull` to write all four `AWS_*` values into `.env.local`.
4. Upload one test file in the console, open it, and copy the URL up to and including `/oja-media` into `STORAGE_PUBLIC_URL`.
5. Repeat 2–4 on any other branch you deploy from (each branch has its own bucket namespace and hostname).

## 11. Dependencies

**Add:** `drizzle-orm`, `@neondatabase/serverless`, `better-auth`, `motion`, `sonner`, `vaul`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-tooltip`, `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-switch`, `@radix-ui/react-slot`, `@react-email/components`, `server-only`, `tailwind-merge`, `cmdk` (⌘K search), `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` (Neon Object Storage), `browser-image-compression` (client-side resize to WebP), `@dnd-kit/sortable` (image reordering).
**Add (dev):** `drizzle-kit`, `tsx`, `dotenv`, `vitest`, `@playwright/test` (optional).
**Remove:** `axios`, `dompurify`, `react-icons`, `react-hot-toast`, `tiptap`, `react-select`, `tailwindcss-animate`.

---

## 12. Implementation phases

Each phase ends in a working, lint-clean, type-clean app (`npm run lint && npx tsc --noEmit && npm run build`).

| # | Phase | Done when |
|---|---|---|
| 1 | **Foundation cleanup** — rename package, remove dead code/deps, new folder skeleton, ESLint import boundaries, `server-only`, env validation, rewrite `create_module.sh` | App builds; importing `server/db` from a component fails lint |
| 2 | **Design system** — tokens in `globals.css`, fonts, theme toggle, all `components/ui/*` primitives, `AdirePattern`, Sonner | A `/dev/ui` page (removed before launch) shows every primitive in light + dark, keyboard-navigable |
| 3 | **Database** — Drizzle schema, migrations on Neon, seed script | `npm run db:seed` fills 6 categories + ~24 products; Drizzle Studio shows them |
| 4 | **Auth** — Better Auth + Google, `/login`, `UserMenu`, `proxy.ts`, `requireUser/requireAdmin`, admin bootstrap, welcome email stub | Google sign-in works locally; `/account` redirects when signed out; admin email gets `role=admin` |
| 5 | **Catalogue** — home, `/shop`, category, PDP, ⌘K search, header/footer, skeletons | Filters/sort/search via URL; Lighthouse ≥ 90 on home + PDP mobile |
| 6 | **Cart** — guest store, DB cart actions, drawer, `/cart`, merge on sign-in, wishlist | Cart survives refresh (guest) and devices (signed-in); merge verified |
| 7 | **Checkout + orders** — address book, checkout flow, `placeOrder` transaction, success page, account orders | Order row + items + stock decrement committed atomically; double-click creates one order; overselling impossible |
| 8 | **Email** — Mailgun transport, templates, email log, status-update + contact + admin alerts | Placing an order delivers a confirmation to your inbox and logs `sent` |
| 9 | **Admin + uploads** — CORS spike (§6a), storage layer, `ImageUploader`, dashboard, products, categories, orders (status → email), customers, messages, `storage:cleanup` script | Admin can run the shop without touching the DB; an uploaded image shows on the storefront through `next/image`; an 11 MB or non-image upload is rejected server-side |
| 10 | **Content & polish** — static pages, motion pass (`review-animations`), a11y pass, SEO (metadata, sitemap, JSON-LD, OG image), 404/error pages | Checklist in §13 all green |

---

## 13. Testing & QA

- **Unit (Vitest):** `calculateTotals` (free-shipping threshold, rounding, empty cart), cart merge (sum + clamp to stock), order status transition rules, `formatMoney`, zod schemas.
- **Integration:** `checkoutService.placeOrder` against a Neon **branch** database: happy path, out-of-stock, inactive product, duplicate idempotency key, concurrent orders for the last unit.
- **E2E (Playwright, optional):** browse → add to bag → sign in (test session) → checkout → success page.
- **Manual QA checklist:** 360 / 390 / 768 / 1024 / 1440 widths; light + dark; keyboard-only run of the full purchase; screen reader on checkout; reduced-motion on; slow 3G throttling for skeletons; Google consent cancel; Mailgun failure (bad key) still completes the order and logs `failed`.

---

## 14. Risks & gotchas

- **Neon HTTP driver has no interactive transactions** → use the WebSocket `Pool` driver for `placeOrder` (Node 22+ has a global `WebSocket`; otherwise set `neonConfig.webSocketConstructor = ws`).
- **Mailgun sandbox** only sends to authorized recipients; EU-region domains need the EU base URL.
- **Google OAuth in Testing mode** only allows listed test users; publish the consent screen before a public demo.
- **Next 16** renamed `middleware.ts` → `proxy.ts` and made `params`/`searchParams` async.
- **Never trust client prices or quantities** — the server recomputes everything from the DB.
- **Neon Object Storage is beta.** Region-limited (4 AWS regions), CORS for browser uploads is undocumented (fallback in §6a), and bucket hostnames differ per branch — store keys, never full URLs. Create the S3 client with `forcePathStyle: true` and `requestChecksumCalculation: "WHEN_REQUIRED"`; without the second, AWS SDK v3 adds checksum headers that break presigned uploads to non-AWS S3 services.
- **Keep `.env.local` out of git** — `.gitignore` ignores `.env*` except `.env.example`.
