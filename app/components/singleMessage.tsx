import type { Session } from "@supabase/supabase-js";
import type { Message } from "./realtimeMessages";
type PropsMessage = {
  msg: Message;
  session: Session;
};
export default function SingleMessage({ msg, session }: PropsMessage) {
  return (
    <div
      id="Single-Message"
      className={` ${
        session?.user.id === msg.user_id ? " self-end " : "self-start "
      } `}
    >
      <div
        className={` my-2 mb-4 p-2  ${
          session?.user.id === msg.user_id
            ? "bg-sky-200 self-end rounded-l-xl rounded-br-xl text-right"
            : "self-start bg-sky-50 rounded-r-xl rounded-bl-xl text-left"
        } `}
      >
        <div>
          <div>
            <p className="text-lg">{msg.content} </p>
            <p className="text-xs text-gray-600">
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
          <p className="font-semibold text-sm">
            From{" "}
            {session?.user.id === msg.user_id
              ? "You"
              : msg?.user_info.raw_user_meta_data.email.split("@")[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
