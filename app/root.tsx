import { json } from "@remix-run/node";
import styles from "./styles/app.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import createServerSupabase from "utils/supabase.server";
import { createBrowserClient } from "@supabase/auth-helpers-remix";

import type { MetaFunction } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import type { Database } from "types/db_types";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

type TypedSupabaseClient = SupabaseClient<Database>;
export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient;
  session: Session;
};

export const loader = async ({ request }: LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  // console.log({ supabaseOnLoader: supabase });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json({ env, session }, { headers: response.headers });
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chatter",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );
  const revalidator = useRevalidator();
  // console.log({ server: session }, { supabaseOnComponent: supabase });

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log({ eventOnAuthStateChange: event });
      if (session?.access_token !== serverAccessToken) {
        revalidator.revalidate();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, serverAccessToken, revalidator]);

  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
      </head>
      <body className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black w-full flex items-center justify-center content-center h-screen">
        <Outlet context={{ supabase, session }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

/**
 * bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-500 via-cyan-700 to-rose-300
 */
