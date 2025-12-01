# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DankDeals is a production-ready cannabis e-commerce platform for same-day delivery in the Minneapolis-St. Paul area. Built with Next.js 15 (App Router), TypeScript, Supabase, and Zustand.

## Development Commands

### Core Development
```bash
pnpm dev              # Start Next.js dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server
pnpm type-check       # Run TypeScript compiler without emitting files
```

### Code Quality
```bash
pnpm lint             # Run ESLint + Biome on src/
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Prettier
```

### Testing
```bash
pnpm test             # Run Vitest unit tests
pnpm test:coverage    # Run tests with coverage report
pnpm test:e2e         # Run Playwright e2e tests
```

### Database
```bash
pnpm db:migrate       # Push Supabase migrations
pnpm db:types         # Generate TypeScript types from Supabase schema
pnpm seed:admin       # Create admin user (requires env vars)
```

### Deployment
```bash
pnpm deploy           # Deploy to Vercel production
```

## Architecture

### State Management

- **Zustand stores** located in `src/stores/`:
  - `cart-store.ts` - Client-side cart with persistence (localStorage via Zustand persist middleware)
  - `auth-store.ts` - Authentication state
- Cart state includes checkout data (address, delivery slot, fees, tip, promo codes)
- All stores use `devtools` middleware for debugging

### Authentication & Database

**Supabase Client Patterns:**
- `src/lib/supabase/client.ts` - Browser client for Client Components (`createClient()`)
- `src/lib/supabase/server.ts` - Server client for Server Components/Actions (`createServerSupabaseClient()`, `createAdminSupabaseClient()`)
- `src/lib/supabase/middleware.ts` - Auth session refresh in Next.js middleware
- **Always use the correct client based on component type** (Server vs Client)

**Database Schema:**
- PostgreSQL via Supabase with Row Level Security (RLS) enabled on all tables
- Key tables: `profiles`, `products`, `orders`, `order_items`, `carts`, `promo_codes`, `delivery_zones`
- Enums: `product_category`, `strain_type`, `order_status`, `user_role`
- Auto-generated types in `src/types/database.ts` (regenerate with `pnpm db:types`)
- Profile creation automatically triggered via `handle_new_user()` function on auth signup

**Auth Flow:**
- User authentication handled by Supabase Auth
- Callback route at `src/app/auth/callback/route.ts` handles OAuth redirects
- `src/components/providers/auth-provider.tsx` wraps app for auth state
- Middleware at `src/middleware.ts` refreshes sessions on all routes (except static assets)
- Helper functions: `getSession()`, `getUser()`, `getUserProfile()`, `isAdmin()`

### Routing & Pages

**App Router structure (`src/app/`):**
- `/` - Homepage with featured products, hero
- `/products` - All products with filters
- `/products/[category]` - Category-specific products
- `/products/[category]/[id]` - Product detail page
- `/checkout` - Multi-step checkout flow
- `/admin/*` - Admin dashboard (products, orders management)
- `/account/*` - User account pages (profile, orders)
- `/login`, `/signup` - Authentication pages
- API routes in `/api/*` (products, orders, waitlist, auth signout)

### Component Organization

```
src/components/
├── cart/           # CartDrawer component
├── layout/         # Header, Footer (shared layout components)
├── products/       # ProductCard, ProductGrid, ProductFilters, FeaturedProductCard
├── providers/      # AuthProvider (wraps app for Supabase auth context)
└── ui/             # Shadcn/ui base components (Button, Card, Dialog, etc.)
```

**Component Patterns:**
- Server Components by default (Next.js 15 App Router)
- Use `"use client"` directive only when needed (interactivity, hooks, browser APIs)
- Product detail uses split pattern: `page.tsx` (Server) + `product-detail-client.tsx` (Client)

### Styling & Design System

**Tailwind Configuration:**
- Custom color palette: `navy-{50-950}`, `gold-{50-900}` (brand colors)
- CSS variables for shadcn/ui components (background, foreground, card, primary, etc.)
- Fonts: Inter (sans), Bebas Neue (display headings)
- Custom animations: `fade-in`, `slide-up` (used for page transitions)

**Design Principles:**
- Dark navy + gold color scheme (navy-900 background, gold accents)
- Mobile-first responsive design
- Glass morphism effects for cards/overlays
- Framer Motion for page/component animations

### Business Logic

**Pricing & Tax Calculation:**
- Sales tax: Configured via `NEXT_PUBLIC_MN_SALES_TAX` env var (default 6.875%)
- Cannabis excise tax: `NEXT_PUBLIC_CANNABIS_EXCISE_TAX` env var (default 10%)
- Tax calculated on subtotal minus discounts
- Total = (subtotal - discount) + tax + delivery_fee + tip

**Delivery Zones:**
- Zone-based delivery fees stored in `delivery_zones` table
- Suburbs mapped to zones (e.g., "Minneapolis Core" = $0 fee, "Outer Suburbs" = $5.99)
- Each zone has min_order, delivery_fee, estimated_minutes

**Order Flow:**
1. Add products to cart (Zustand store, persisted to localStorage)
2. Checkout: verify address/delivery zone, select time slot, add tip/promo
3. Create order record + order_items in Supabase
4. Admin/driver can update order status via admin dashboard

### Security & Headers

**Next.js Config (`next.config.js`):**
- Security headers enabled: HSTS, X-Content-Type-Options, X-Frame-Options, CSP-like Permissions-Policy
- Image optimization with remote patterns for Supabase storage, Unsplash
- `poweredByHeader: false` to hide Next.js signature

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (admin operations)
- `NEXT_PUBLIC_MN_SALES_TAX` (optional, default: 0.06875)
- `NEXT_PUBLIC_CANNABIS_EXCISE_TAX` (optional, default: 0.10)

## Important Patterns

### Adding New Products
1. Insert via admin dashboard (`/admin/products`) or directly in Supabase
2. Ensure `is_active: true` for public visibility
3. Images stored in Supabase Storage, URLs in `images` array field
4. Must specify category (enum) and optionally strain_type for flower

### Admin Access
- Users with `role: 'admin'` in profiles table can access `/admin/*`
- RLS policies allow admins full CRUD on products, orders, promo_codes
- Create admin user with `pnpm seed:admin` script

### Type Safety
- All database types auto-generated from Supabase schema
- Use `Database['public']['Tables']['table_name']['Row']` for query results
- Regenerate types after schema changes: `pnpm db:types`
- Path alias `@/*` maps to `src/*` (configured in tsconfig.json)

### Real-time Features
- Orders table has Realtime enabled via `ALTER PUBLICATION supabase_realtime`
- Can subscribe to order status changes for live updates (driver/admin dashboards)

## Package Manager

This project uses **pnpm** (v9.12.2). Do not use npm or yarn. The lockfile is `pnpm-lock.yaml`.
