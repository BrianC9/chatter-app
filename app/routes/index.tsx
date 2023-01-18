import { useLoaderData } from "@remix-run/react";
import supabase from "utils/supabase";
export async function loader() {
  const { data } = await supabase.from("messages").select();
  return { data };
}
export default function Index() {
  const { data } = useLoaderData();
  console.log(data, null, 2);
  return <pre>{JSON.stringify(data)}</pre>;
}
