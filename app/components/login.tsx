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
      console.log(error);
    }
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
  };
  console.log(session);
  return (
    <>
      {session === null ? (
        <div
          id="Sign-up"
          className="w-full max-w-96 flex flex-col justify-center items-center content-center"
        >
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
        </div>
      ) : (
        <div
          id="Login-Succesfull"
          className="flex gap-2 items-center justify-between bg-white/20 md:p-4 p-2 rounded-t-xl border-b-white border-b-2 spacing-x-28 min-w-xl "
        >
          <button
            className="bg-red-400 px-4 py-1  m-2 text-slate-100 rounded-lg font-bold self-end "
            onClick={handleLogout}
          >
            Logout
          </button>
          <div className="flex items-center gap-2 text-white  font-semibold ">
            <p className="invisible sm:visible">
              {session.user.email?.split("@")[0]}
            </p>
            <img
              src={
                session.user.app_metadata.provider === "github"
                  ? session.user.user_metadata?.avatar_url
                  : "https://picsum.photos/200"
              }
              alt="avatar"
              className="max-w-[2.5rem] rounded-full block"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
