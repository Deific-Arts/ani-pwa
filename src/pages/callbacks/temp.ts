import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ url, request }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/';

  if (!code) {
    return new Response(
      JSON.stringify({ success: false, message: "No authorization code provided." }),
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: error.status || 500 }
      );
    }

    // Redirect to frontend with session
    return Response.redirect(`${url.origin}${next}?session=${encodeURIComponent(JSON.stringify(data.session))}`);
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
