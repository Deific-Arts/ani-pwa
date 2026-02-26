import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const origin = url.origin;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${origin}/callbacks/facebook`,
      }
    });

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: error.status || 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: data.url
      }),
      { status: 200 }
    );
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
