import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase, supabaseAdmin } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (!session) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in." }),
        { status: 400 }
      );
    }

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
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ request }) => {
  try {
    // const authHeader = request.headers.get('authorization');

    // if (!authHeader || Array.isArray(authHeader)) {
    //   return new Response(
    //     JSON.stringify({ success: false, message: "Invalid authorization header" }),
    //     { status: 401 }
    //   )
    // }

    // console.log('authHeader', authHeader);

    // const token = authHeader.split(' ')[1];

    // console.log(token);

    // if (!token) {
    //   return new Response(
    //     JSON.stringify({ success: false, message: "No token provided" }),
    //     { status: 401 }
    //   )
    // }

    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase.auth.getUser(token);

    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (!session) {
      console.log(sessionError);
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in.", error: sessionError }),
        { status: 401 }
      )
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(session.user.id);

    if (deleteError) {
      console.log(deleteError);
      return new Response(
        JSON.stringify({ success: false, message: deleteError.message, error: deleteError }),
        { status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
