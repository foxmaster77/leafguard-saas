import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Check your .env.local file or Vercel Environment Variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY).');
}

export const supabase = createClient(
  supabaseUrl || 'https://xyz.supabase.co', 
  supabaseKey || 'dummy'
);

