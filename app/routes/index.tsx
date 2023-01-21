import { Form, useLoaderData, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { json, Response } from "@remix-run/node";
import Login from "~/components/login";
import createServerSupabase from "utils/supabase.server";
import type { SupabaseOutletContext } from "~/root";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  console.log("submit al form");
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);

  const { message } = Object.fromEntries(formData);

  //Validación
  if (message.toString().trim() === "") {
    return { error: "Introduce a valid message" };
  }

  const { error } = await supabase
    .from("messages")
    .insert({ content: String(message) });

  return json(null, { headers: response.headers });
}

// eslint-disable-next-line no-empty-pattern
export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const { data } = await supabase.from("messages").select();
  return json({ messages: data ?? [] }, { headers: response.headers });
}

export default function Index() {
  const [domLoaded, setDomLoaded] = useState(false);
  const { session } = useOutletContext<SupabaseOutletContext>();
  console.log({ session: session?.user.id });
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const { messages } = useLoaderData<typeof loader>();

  //console.log(messages);
  return (
    <div className="container flex flex-col content-center h-screen justify-center items-center">
      {domLoaded && (
        <>
          <Login />
          {messages.length > 0 ? (
            <>
              <div className=" bg-gray-100 lg:w-1/2 h-[35rem] flex flex-col border shadow-md  lg:max-h-[35rem]  overflow-y-auto items-center px-5 ">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={` my-2 lg:w-1/2 mb-4 p-2  ${
                      session?.user.id === msg.user_id
                        ? "bg-blue-200 self-end rounded-tl-xl text-right"
                        : "self-start bg-blue-100 rounded-tr-xl text-left"
                    } `}
                  >
                    <p>{msg.id}</p>
                    <p>{msg.content}</p>
                    <p>{new Date(msg.created_at).toUTCString()}</p>
                    <p className="font-semibold">{msg?.user_id}</p>
                  </div>
                ))}
              </div>
              <Form method="post" noValidate className="mt-2">
                <input
                  type="text"
                  name="message"
                  required={true}
                  placeholder="Enter a message..."
                  className="rounded-l-xl px-4"
                />
                <button
                  type="submit"
                  className="bg-green-400 px-4 rounded-r-xl"
                >
                  send
                </button>
              </Form>
            </>
          ) : (
            <p className="bg-slate-500 p-3 rounded-md m-2 text-slate-100 text-center">
              You have to be logged in to see the messages!
            </p>
          )}
        </>
      )}
    </div>
  );
}
