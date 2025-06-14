import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const quoteId = url.searchParams.get('quoteId');

  try {
    const { data, error } = await supabase
    .from('Comments')
    .select('*')
    .eq('id', quoteId);

    if (data) {
      return new Response(
        JSON.stringify(data),
        { status: 200 }
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
