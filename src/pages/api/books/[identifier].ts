import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const identifier = params.identifier;

    const { data: book, error: bookError } = await supabase
      .from('Books')
      .select('*')
      .eq('identifier', identifier)
      .single();

    if (bookError) {
      return new Response(
        JSON.stringify({ success: false, message: "The book does not exist and must be created.", error: bookError }),
        { status: 202 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Book retrieved successfully.", data: book }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

