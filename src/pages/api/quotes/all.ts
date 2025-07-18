import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";
import type { IQuote } from "../../../shared/interfaces";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
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
        user:Profiles (id, username, email, avatar)
      `);

    if (quotes) {
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl('');

      const response = quotes.map((quote: any) => {
        return {
          ...quote,
          user: {
            ...quote.user,
            avatar: `${publicUrl}/${quote.user.avatar}`
          }
        }
      });

      return new Response(
        JSON.stringify(response),
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
