import { useOutletContext } from "@remix-run/react";
import type { Provider } from "@supabase/supabase-js";
import React from "react";
import type { SupabaseOutletContext } from "~/root";

function Login() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();

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

  return (
    <>
      <button
        className="bg-emerald-300 px-2 rounded-md m-2
    "
        onClick={() => {
          handleLogin("github");
        }}
      >
        Login Github
      </button>
      <button
        className="bg-emerald-300 px-2 rounded-md m-2
    "
        onClick={() => {
          handleLogin("google");
        }}
      >
        Login Google
      </button>
      <button className="bg-emerald-300 px-2 rounded-md" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}

export default Login;
