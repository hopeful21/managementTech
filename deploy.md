https://github.com/hopeful21/managementTech upload ke github username : fitrahmaulanamalik
email: fitrahmm09@gmail.com

## Environment Vercel

Tambahkan variable berikut di Vercel Project Settings > Environment Variables untuk Production, Preview, dan Development:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vdvntafdlhbvsllqzuwc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_zvtAXX-z3IPKr6Ul4DGE-Q_Uuu6-Lgs
```

Setelah disimpan, redeploy project di Vercel supaya nilai `NEXT_PUBLIC_*` masuk ke build Next.js.
