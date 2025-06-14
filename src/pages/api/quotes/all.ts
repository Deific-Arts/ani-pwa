import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";
import { notEqual } from "lit";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const { data: Quotes, error } = await supabase
      .from('Quotes')
      .select(`
        id,
        createdAt:created_at,
        quote,
        requote,
        page,
        note,
        private,
        likes,
        requotes,
        book:Books (id, title, identifier),
        user:Profiles (id, username, email)
      `);

    if (Quotes) {
      return new Response(
        JSON.stringify(Quotes),
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
