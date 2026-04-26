# Portfolio CMS (Next.js + Prisma)

Production-ready portfolio CMS built with Next.js App Router, Prisma, and PostgreSQL.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript + React 19
- Tailwind CSS 4
- Prisma ORM + PostgreSQL
- NextAuth (credentials auth)
- Zod + React Hook Form
- Cloudinary signed uploads

## Features

- Public portfolio pages: home, projects, experience, certifications, contact
- Admin authentication and protected dashboard
- Full CRUD for projects, skills/categories, experience, certifications
- Contact form submission + admin inbox workflow
- Media upload helper using signed Cloudinary API requests
- Public query caching + admin-triggered cache revalidation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```bash
cp .env.example .env
```

3. Fill required variables in `.env`:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

4. Generate Prisma client and sync schema:

```bash
npm run db:generate
npm run db:push
```

5. Seed admin/content data:

```bash
npm run db:seed
```

6. Start app:

```bash
npm run dev
```

7. Open:
- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## Admin Login

- Email: value from `ADMIN_EMAIL`
- Password: value from `ADMIN_PASSWORD`

## Deploy (Vercel + Managed Postgres)

1. Push code to GitHub.
2. Import repository in Vercel.
3. Add production env vars in Vercel project settings:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production domain)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PRISMA_QUERY_LOGS=false`
- `UPSTASH_REDIS_REST_URL` (recommended)
- `UPSTASH_REDIS_REST_TOKEN` (recommended)

4. After first deploy, sync production DB from a terminal using production `DATABASE_URL`:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Verify these pages in production:
- `/`
- `/projects`
- `/admin/login`
- `/contact`

## Performance Notes

- Public data reads are cached and revalidated on admin mutations.
- Prisma query logging is disabled by default unless `PRISMA_QUERY_LOGS=true`.
- Database indexes are configured for common public/admin queries.
- Contact API rate limiting supports distributed Redis mode (Upstash) with in-memory fallback.

## Monitoring

- Health endpoint: `/api/health`
- Recommended uptime monitor target: every 30-60s

For higher traffic tiers, keep DB connection pooling enabled on your managed PostgreSQL provider.