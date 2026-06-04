import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("YOUR_SUPABASE_PROJECT_URL") &&
  !supabaseAnonKey.includes("YOUR_SUPABASE_ANON_KEY")
);

if (!isSupabaseConfigured) {
  if (typeof window === "undefined") {
    console.warn(
      "[Supabase] Environment variables are missing or set to placeholder values. " +
      "Fallbacks will be used. Please configure NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file."
    );
  }
}

const finalUrl = isSupabaseConfigured ? supabaseUrl : "https://placeholder-project.supabase.co";
const finalKey = isSupabaseConfigured ? supabaseAnonKey : "placeholder-key";

export const supabase = createClient(finalUrl, finalKey);

