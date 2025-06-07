import type { APIRoute } from "astro";
import 'dotenv/config'
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(`https://ywdityiebxhhjfmspwwk.supabase.co`, process.env.SUPABASE_ANON_KEY as string)

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  // const data = await request.json();
  // const { message, email, phone, user } = data;

  try {
    const { data, error } = await supabase
      .from('Temp')
      .select();

    if (data) {
      return new Response(
        JSON.stringify({ success: true, message: 'Success!', data }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Failed to send email.", error }),
      { status: 400 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
