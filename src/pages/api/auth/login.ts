import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { identifier, password } = data;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email:identifier,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message, error }),
        { status: error.status || 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Success!', user: data.user, session: data.session }),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
