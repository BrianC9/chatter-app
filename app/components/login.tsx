import { useOutletContext } from "@remix-run/react";
import type { Provider } from "@supabase/supabase-js";
import type { SupabaseOutletContext } from "~/root";
type LoginProps = {
  githubIcon: string;
  googleIcon: string;
};
function Login({ githubIcon, googleIcon }: LoginProps) {
  const { supabase, session } = useOutletContext<SupabaseOutletContext>();
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
    <div>
      {session === null && (
        <>
          <div
            className="bg-slate-500 px-4 py-2 rounded-md m-2 text-slate-100 hover:bg-slate-600 hover:cursor-pointer"
            onClick={() => {
              handleLogin("github");
            }}
          >
            <img
              src={githubIcon}
              alt="github icon"
              className="max-w-[2rem] inline-block mr-5"
            />
            <span className="font-bold">Login with Github</span>
          </div>
          <div
            className="bg-slate-500 px-4 py-2 rounded-md m-2 text-slate-100 hover:bg-slate-600 hover:cursor-pointer"
            onClick={() => {
              handleLogin("google");
            }}
          >
            <img
              src={googleIcon}
              alt="Google icon"
              className="max-w-[2rem] inline-block mr-5"
            />
            <span className="font-bold">Login with Google</span>
          </div>
        </>
      )}
      {session !== null && (
        <button
          className="bg-red-400 px-4 py-1  m-2 text-slate-100 rounded-lg font-bold"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Login;
