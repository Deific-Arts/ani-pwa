import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { quote_id } = params;
    const body = await request.json();

    const { data: existingQuote } = await supabase
      .from('Quotes')
      .select('likes')
      .eq('id', quote_id)
      .single();

    if (!existingQuote) {
      return new Response(
        JSON.stringify({ success: false, message: "Quote not found" }),
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('Quotes')
      .update({
        likes: body.liked
          ? [...existingQuote.likes, body.likedBy]
          : existingQuote.likes.filter((like: number) => like !== body.likedBy),
      })
      .eq('id', quote_id)
      .single();

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to update quote.", error }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Updated successfully." }),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
