import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { json, Response } from "@remix-run/node";
import Login from "~/components/login";
import createServerSupabase from "utils/supabase.server";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import RealtimeMessages from "~/components/realtimeMessages";
import githubIcon from "../../public/github.webp";
import googleIcon from "../../public/google.webp";

export async function action({ request }: ActionArgs) {
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
    console.log(error);
    return error;
  }
  return json(null, { headers: response.headers });
}

// eslint-disable-next-line no-empty-pattern
export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const { data, error } = await supabase
    .from("messages")
    .select("*, user_info:profiles(raw_user_meta_data)");

  if (error) {
    console.log(error);
  }
  return json({ messages: data ?? [] }, { headers: response.headers });
}

export default function Index() {
  let transition = useTransition();

  let isSubmitting =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "create";

  let formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  const { messages } = useLoaderData<any>();

  return (
    <div
      id="index"
      className="px-4 py-10 sm:p-20 mx-auto flex-col content-center justify-center items-center max-w-xl "
    >
      <Login githubIcon={githubIcon} googleIcon={googleIcon} />
      {messages.length > 0 ? (
        <>
          <RealtimeMessages serverMessages={messages} />
          <Form method="post" ref={formRef} noValidate>
            <input
              type="text"
              name="message"
              required={true}
              autoFocus={true}
              placeholder="Enter a message..."
              className="rounded-bl-xl px-4 py-1 outline-none w-4/5 "
            />

            <button
              className="bg-green-200 px-6 py-1 rounded-br-xl w-1/5 hover:bg-green-500 "
              type="submit"
              name="_action"
              value="create"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending" : "Send"}
            </button>
          </Form>
        </>
      ) : (
        <p className="bg-slate-500 p-3 rounded-md m-2 text-slate-100 text-center">
          You have to be logged in to see the messages!
        </p>
      )}
    </div>
  );
}
