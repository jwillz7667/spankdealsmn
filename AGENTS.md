# Repository Guidelines

## Project Structure & Module Organization
- Next.js 15 App Router lives in `src/app`; default to server components unless interactivity is needed.
- Reusable pieces in `src/components` (`ui` primitives, `layout` chrome, feature folders like `cart`/`products`, context providers).
- Shared hooks in `src/hooks`, Zustand stores in `src/stores`, utilities in `src/lib`, and shared types in `src/types`.
- Assets sit in `public/`. DB changes belong in `supabase/migrations`; env values go in `.env.local`.

## Build, Test, and Development Commands
- `pnpm install` (Node >=22) then copy `.env.example` to `.env.local`.
- `pnpm dev` for local dev; `pnpm build` + `pnpm start` for production.
- `pnpm lint` / `pnpm lint:fix` (Next ESLint + Biome) and `pnpm type-check` (`tsc --noEmit`).
- `pnpm test` or `pnpm test:coverage` for Vitest + React Testing Library (jsdom); keep specs beside code as `*.test.ts(x)`.
- `pnpm test:e2e` runs Playwright; start the app locally or point `BASE_URL` to a deployment.
- Supabase: `pnpm db:migrate` pushes migrations; `pnpm db:types` regenerates `src/types/database.ts`.
- `pnpm deploy` triggers `vercel --prod`; confirm env vars and DB schema first.

## Coding Style & Naming Conventions
- TypeScript strict; prefer `@/*` imports. Components in `PascalCase`, hooks/state in `camelCase`, files/routes in lowercase or kebab-case.
- Two-space indentation (Biome). Prettier with Tailwind plugin keeps class order stable.
- Keep UI state in Zustand or React Hook Form; validate inputs with Zod in `lib/validators.ts`.
- Reuse Tailwind tokens from `tailwind.config.ts` (navy/gold palette, CSS variable theme).

## Testing Guidelines
- Prefer RTL queries (`getByRole`, `getByText`) and assert on user-facing outcomes, not implementation details.
- For new features, add a happy-path and a guard-rail test; mock Supabase/network calls. E2E specs belong under `tests/e2e` (create if missing) with a short scenario note.

## Commit & Pull Request Guidelines
- Use concise, imperative commits; conventional prefixes (`feat:`, `fix:`, `chore:`) help scanning.
- PRs should list scope and test evidence (`pnpm lint`, `pnpm test`, `pnpm test:e2e` when relevant) plus UI screenshots/gifs.
- Call out Supabase migrations and confirm regenerated `src/types/database.ts` in the PR body; keep PRs focused and prefer follow-ups for refactors.

## Security & Configuration Tips
- Never commit secrets; `.env.local` is local-only. Configure production env vars in Vercel/Supabase.
- Do not expose Supabase service-role keys to the client; run privileged logic in server components or route handlers.
- Sentry via `@sentry/nextjs` is available; set DSN and sampling in env when enabling.
