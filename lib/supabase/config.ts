export function getSupabaseConfig() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return {
    url: url ?? "",
    anonKey: key ?? "",
    isConfigured: Boolean(url && key)
  };
}

export const SUPABASE_CONFIG_ERROR =
  "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di environment Vercel.";
