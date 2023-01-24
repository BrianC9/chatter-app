import {
  Form,
  useLoaderData,
  useOutletContext,
  useTransition,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { json, Response } from "@remix-run/node";
import Login from "~/components/login";
import createServerSupabase from "utils/supabase.server";
import type { SupabaseOutletContext } from "~/root";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import RealtimeMessages from "~/components/realtimeMessages";

export async function action({ request }: ActionArgs) {
  console.log("submit al form");
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const formData = await request.formData();

  const { message } = Object.fromEntries(formData);

  //Validación
  if (message.toString().trim() === "") {
    return { error: "Introduce a valid message" };
  }

  const { error } = await supabase
    .from("messages")
    .insert({ content: String(message) });
  if (error) {
    return error;
  }
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
  let transition = useTransition();
  let isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "create";
  let formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);
  console.log({ session: session?.user.id });
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const { messages } = useLoaderData<typeof loader>();

  //console.log(messages);
  return (
    <div className="container flex flex-col content-center h-screen justify-center items-center w-full h-screen">
      {domLoaded && (
        <>
          <Login />
          {messages.length > 0 ? (
            <>
              <RealtimeMessages serverMessages={messages} />

              <Form method="post" ref={formRef} noValidate className="mt-2">
                <input
                  type="text"
                  name="message"
                  required={true}
                  autoFocus={true}
                  placeholder="Enter a message..."
                  className="rounded-l-xl px-4"
                />

                <button
                  className="bg-green-400 px-4 rounded-r-xl"
                  type="submit"
                  name="_action"
                  value="create"
                  disabled={isAdding}
                >
                  {isAdding ? "Sending" : "send"}
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
