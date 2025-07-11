import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const body = await request.formData();
    const userId = params.user_id;
    const file = body.get('files') as File;

    if (file) {
      const filePath = `${Date.now()}_${file.name}`;

      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('avatars') // 👈 your bucket name
        .upload(filePath, file);

      if (storageData) {
        const { error: profileError } = await supabase
          .from('Profiles')
          .update({
            avatar: storageData.path
          })
          .eq('id', userId);

        if (profileError) {
          return new Response(
            JSON.stringify({ success: false, message: "Failed to update profile.", error: profileError }),
            { status: 400 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: "Uploaded successfully", data: storageData }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({ success: false, message: "Failed to upload.", error: storageError }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "No file exists." }),
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ params , request }) => {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const me = await fetch(`${origin}/api/users/me`).then(response => response.json());

    console.log(me.avatar);

    const { error: storageError } = await supabase
      .storage
      .from('avatars')
      .remove([me.avatar]);

    const { error: profileError } = await supabase
      .from('Profiles')
      .update({
        avatar: null
      })
      .eq('id', params.user_id);

    if (storageError || profileError) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to delete avatar.", error: { storageError, profileError } }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Avatar deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
