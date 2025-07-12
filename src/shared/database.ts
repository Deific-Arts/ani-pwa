import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(`https://ywdityiebxhhjfmspwwk.supabase.co`, process.env.SUPABASE_ANON_KEY as string);
export const supabaseAdmin = createClient(`https://ywdityiebxhhjfmspwwk.supabase.co`, process.env.SUPABASE_SERVICE_ROLE_KEY as string);
