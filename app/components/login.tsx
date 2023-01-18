import React from "react";
import supabase from "utils/supabase.server";

function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
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
        onClick={handleLogin}
      >
        Login
      </button>
      <button className="bg-emerald-300 px-2 rounded-md" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}

export default Login;
