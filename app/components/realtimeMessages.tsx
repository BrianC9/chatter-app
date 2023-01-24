import { useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { Database } from "types/db_types";
import type { SupabaseOutletContext } from "~/root";
type Message = Database["public"]["Tables"]["messages"]["Row"];
export default function RealtimeMessages({
  serverMessages,
}: {
  serverMessages: Message[];
}) {
  const [messages, setMessages] = useState(serverMessages);
  const { session, supabase } = useOutletContext<SupabaseOutletContext>();
  const messageEl = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (messageEl.current != null) {
      messageEl.current.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target?.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);
  useEffect(() => {
    setMessages(serverMessages);
  }, [serverMessages]);
  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, messages, setMessages]);

  return (
    <div
      className=" bg-white bg-opacity-20  shadow-xl  border-none lg:w-1/2 h-[35rem] flex flex-col  lg:max-h-[35rem]  overflow-y-auto items-center px-5 py-2 scrollbar scroll-smooth	"
      ref={messageEl}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={` my-2 lg:w-1/2 mb-4 p-2  ${
            session?.user.id === msg.user_id
              ? "bg-sky-200 self-end rounded-tl-xl text-right"
              : "self-start bg-sky-50 rounded-tr-xl text-left"
          } `}
        >
          <p>{msg.id}</p>
          <p>{msg.content}</p>
          <p>{new Date(msg.created_at).toUTCString()}</p>
          <p className="font-semibold">{msg?.user_id}</p>
        </div>
      ))}
    </div>
  );
}
