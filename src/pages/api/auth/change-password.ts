import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { error } = await supabase.auth.updateUser({
      password: body.newPassword,
    });

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message, error }),
        { status: error.status || 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Success!' }),
      { status: 200 }
    );
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify(false),
      { status: 500 }
    );
  }
}
