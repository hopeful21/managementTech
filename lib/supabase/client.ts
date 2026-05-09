"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig, SUPABASE_CONFIG_ERROR } from "@/lib/supabase/config";

export function createClient() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    throw new Error(SUPABASE_CONFIG_ERROR);
  }

  return createBrowserClient(url, anonKey);
}

export function createOptionalClient() {
  const { url, anonKey, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  return createBrowserClient(url, anonKey);
}
