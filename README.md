# OfficeFlow ERP

Modern ERP and office management starter built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, Supabase Auth, Supabase database schema, Zustand, Recharts, React Hook Form, Zod, Framer Motion, and lucide-react.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Supabase project URL and anon key to `.env.local`.

4. Run `supabase/schema.sql` in the Supabase SQL editor, then optionally run `supabase/seed.sql`.

5. Start the app:

```bash
npm run dev
```

## Routes

- `/login`
- `/register`
- `/forgot-password`
- `/dashboard`
- `/employees`
- `/attendance`
- `/finance`
- `/tasks`
- `/documents`
- `/settings`
