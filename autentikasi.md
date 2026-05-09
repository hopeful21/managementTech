Konfigurasi Authentication Supabase:

Gunakan Supabase Auth Email & Password
Admin utama aplikasi:
Email: fitrahmm09@gmail.com
Role: super_admin
Setelah login berhasil, arahkan ke /dashboard
Simpan session menggunakan Supabase Auth Helpers
Implementasikan middleware proteksi route untuk semua halaman dashboard
Jika belum login, redirect otomatis ke /login
Tambahkan fitur:
Remember me
Show/hide password
Forgot password via email
Logout
Session persistence
Refresh token otomatis

Buat tabel profile/user tambahan di Supabase:
Desain halaman login:

Split screen modern
Kiri: branding ERP dengan ilustrasi kantor modern
Kanan: form login premium
Glassmorphism effect
Gradient background
Smooth animation
Dark mode support
Tombol login modern dengan loading animation

Tambahkan validasi:

Email harus valid
Password minimal 8 karakter
Error message elegant
Toast notification sukses/gagal login
Buat arsitektur auth production-ready:

lib/supabase/client.ts
lib/supabase/server.ts
middleware.ts
hooks/useAuth.ts
providers/auth-provider.tsx

Pastikan seluruh sistem auth modern, aman, scalable, dan terasa seperti aplikasi SaaS enterprise premium.
npm install @supabase/supabase-js @supabase/ssr
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react framer-motion recharts zustand
npm install clsx tailwind-merge
npm install sonner
npm install next-themes
npm install @dnd-kit/core @dnd-kit/sortable