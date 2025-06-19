import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const me = await fetch(`${origin}/api/users/me`).then(response => response.json());

    if (!me) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in." }),
        { status: 401 }
      );
    }

    const { data: quotes, error } = await supabase
      .from('Quotes')
      .select(`
        id,
        created_at,
        quote,
        requote,
        page,
        note,
        private,
        likes,
        requotes,
        book:Books (id, title, identifier),
        user:Profiles (id, username, email)
      `)
      .in('likes', me.id)

    if (quotes) {
      return new Response(
        JSON.stringify(quotes),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Failed to get quotes.", error }),
      { status: 400 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
