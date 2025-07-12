import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  const { username, email, password } = data;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    });

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: error.message, error }),
        { status: error.status || 500 }
      );
    }

    // const newProfile = {
    //   uuid: data.user?.id,
    //   username,
    //   email,
    //   // book_ids: [],
    //   // following: [],
    //   // avatar: null,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    //   email_confirmed_at: new Date(),
    //   confirmed_at: new Date(),
    // };

    // const { data: profile, error: profileError } = await supabase
    //   .from('Profiles')
    //   .insert(newProfile)
    //   .select('*')
    //   .single();

    // if (profileError) {
    //   return new Response(
    //     JSON.stringify({ success: false, message: profileError.message, profileError }),
    //     { status: 400 }
    //   );
    // }

    return new Response(
      JSON.stringify({ success: true, message: 'Success!', user: data.user }),
      { status: 200 }
    );
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
