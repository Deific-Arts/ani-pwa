import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { user_id } = params;
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
      .eq('user_id', user_id);

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
