import { createClient } from "@supabase/supabase-js";
export default createClient(process.env.URL!, process.env.ANON_KEY!);
