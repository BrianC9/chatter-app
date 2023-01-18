import { createClient } from "@supabase/supabase-js";

import type { Database } from "db_types";

export default createClient<Database>(process.env.URL!, process.env.ANON_KEY!);
