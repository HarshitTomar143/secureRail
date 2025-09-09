import { createClient } from "@supabase/supabase-js";

// Use env vars (put these in .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for the whole project
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
