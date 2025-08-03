import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase, supabaseAdmin } from "../../../shared/database";
import { getStripe } from "../../../shared/utilities";

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
  // const url = new URL(request.url);
  // const origin = url.origin;

  try {
    const body = await request.json();
    const { member_id } = body;

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

    // Delete user's avatar files
    // Step 1: List all files in the user's folder
    const { data: files, error: listError } = await supabase
      .storage
      .from('avatars')
      .list(`${session.user.id}`, { limit: 100 });

    if (listError) {
      return new Response(JSON.stringify({ success: false, message: "Failed to list files.", error: listError }), {
        status: 500,
      });
    }

    // Step 2: Construct file paths for deletion
    const filePaths = files.map(file => `${session.user.id.toString()}/${file.name}`);

    // Step 3: Delete files
    if (filePaths.length > 0) {
      const { error: storageError } = await supabase
        .storage
        .from('avatars')
        .remove(filePaths);

      if (storageError) {
        console.log(storageError);
        return new Response(
          JSON.stringify({ success: false, message: "Failed to delete avatar.", error: storageError }),
          { status: 400 }
        );
      }
    }

    // Delete user's membership
    try {
      if (member_id) {
        const subscriptions = await getStripe().subscriptions.list({
          customer: member_id
        });

        const subscriptionIds = subscriptions.data.map(subscription => subscription.id);

        await Promise.all(
          subscriptionIds.map(id => getStripe().subscriptions.cancel(id))
        );
      }
    } catch(error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to delete membership.", error }),
        { status: 500 }
      );
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
