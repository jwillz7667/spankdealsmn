# DankDeals - Twin Cities Premium Cannabis Delivery

A production-ready cannabis e-commerce platform for same-day delivery in Minneapolis-St. Paul.

## Features

- 🌿 Full product catalog with categories, strain types, and potency info
- 🛒 Persistent cart with real-time updates
- 📍 Delivery zone management with suburb-specific fees
- ⏰ 1-hour delivery window selection
- 👤 User authentication (email + OAuth)
- 🔐 Admin dashboard for product/order management
- 🎨 Dark navy + gold brand design
- 📱 Mobile-first responsive design

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL + Auth)
- **State:** Zustand
- **Animations:** Framer Motion

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── cart/           # Cart drawer
│   ├── layout/         # Header, Footer
│   ├── products/       # Product cards, grid
│   ├── providers/      # Auth provider
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, Supabase clients
├── stores/             # Zustand stores
└── types/              # TypeScript types
```

## Supabase Setup

1. Create a new Supabase project
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Add your credentials to `.env.local`

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

## License

Proprietary - DankDeals MN
