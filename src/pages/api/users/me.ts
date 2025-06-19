import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('Profiles')
        .select('*')
        .eq('uuid', session.user.id)
        .single();

      const { data: books, error: booksError } = await supabase
        .from('Books')
        .select('*')
        .in('id', profile.book_ids);

      if (profile && books) {
        const data = { ...profile, books };
        return new Response(
          JSON.stringify(data),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({ success: false, message: "Failed to get profile.", errors: { profileError, booksError } }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Failed to get user.", error }),
      { status: 400 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
