import { useOutletContext } from "@remix-run/react";
import type { Provider } from "@supabase/supabase-js";
import type { SupabaseOutletContext } from "~/root";
import type { LoaderArgs } from "@remix-run/node";

function Login() {
  const { supabase, session } = useOutletContext<SupabaseOutletContext>();
  console.log({ session: session });
  const handleLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
    if (error) {
      console.error(error);
    }
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  };

  return (
    <>
      {session === null && (
        <>
          <button
            className="bg-slate-500 px-2 rounded-md m-2 text-slate-100
    "
            onClick={() => {
              handleLogin("github");
            }}
          >
            Login Github
          </button>
          <button
            className="bg-slate-500 px-2 rounded-md m-2 text-slate-100
    "
            onClick={() => {
              handleLogin("google");
            }}
          >
            Login Google
          </button>
        </>
      )}
      {session !== null && (
        <button
          className="bg-slate-500 px-2 rounded-md m-2 text-slate-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </>
  );
}

export default Login;
