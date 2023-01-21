import { Form, useLoaderData } from "@remix-run/react";
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
    <div className="container flex flex-col content-center items-center">
      {domLoaded && (
        <>
          <Login />
          {messages.length > 0 ? (
            <div className="bg-slate-500 w-1/2 flex flex-col content-center justify-center items-center ">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-white my-2 w-1/2">
                  <p>{msg.id}</p>
                  <p>{msg.content}</p>
                  <p>{new Date(msg.created_at).toUTCString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="bg-slate-500">
              You have to login to see the messages!
            </p>
          )}
          <Form method="post" className="">
            <input type="text" name="message" id="" />
            <button type="submit">send</button>
          </Form>
        </>
      )}
    </div>
  );
}
