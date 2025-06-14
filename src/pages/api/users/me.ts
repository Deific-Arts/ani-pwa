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
      const { data, error } = await supabase
        .from('Profiles')
        .select('*')
        .eq('uuid', session.user.id)
        .single();

      if (data) {
        const userData = { user: session.user.user_metadata, profile: data };
        return new Response(
          JSON.stringify(userData),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({ success: false, message: "Failed to get profile.", error }),
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
