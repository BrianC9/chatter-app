import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import Login from "~/components/login";
import createServerSupabase from "utils/supabase.server";

// eslint-disable-next-line no-empty-pattern
export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const { data } = await supabase.from("messages").select();
  return json({ messages: data ?? [] }, { headers: response.headers });
}

export default function Index() {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    console.log("render");
    setDomLoaded(true);
  }, []);
  const { messages } = useLoaderData<typeof loader>();
  //console.log(messages);
  return (
    <>
      {domLoaded && (
        <>
          <Login />
          {messages.length > 0 ? (
            <pre>{JSON.stringify(messages, null, 2)}</pre>
          ) : (
            <p className="text-amber-500">
              You have to login to see the messages!
            </p>
          )}
        </>
      )}
    </>
  );
}
