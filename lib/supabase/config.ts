const FALLBACK_SUPABASE_URL = "https://placeholder.supabase.co";
const FALLBACK_SUPABASE_KEY = "placeholder-publishable-key";

export function getSupabaseConfig() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL,
    anonKey: key ?? FALLBACK_SUPABASE_KEY,
    isConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && key)
  };
}
