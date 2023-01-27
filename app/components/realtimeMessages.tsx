import { useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { Database } from "types/db_types";
import type { SupabaseOutletContext } from "~/root";
import SingleMessage from "./singleMessage";
export type MessageRaw = Database["public"]["Tables"]["messages"]["Row"];
export interface Message extends MessageRaw {
  user_info: {
    raw_user_meta_data: {
      iss: string;
      sub: string;
      name: string;
      email: string;
      full_name: string;
      user_name: string;
      avatar_url: string;
      provider_id: string;
      email_verified: boolean;
      preferred_username: string;
    };
  };
}
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
      id="Messages-container"
      className="  bg-white/20 flex flex-col  overflow-y-auto  px-5 py-2 scrollbar scroll-smooth  h-96"
      ref={messageEl}
    >
      {messages.length === 0 ? (
        <p>There are no messages</p>
      ) : (
        messages.map((msg) => (
          <SingleMessage key={msg.id} msg={msg} session={session} />
        ))
      )}
    </div>
  );
}
