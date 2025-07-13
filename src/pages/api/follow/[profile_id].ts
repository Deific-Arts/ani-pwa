import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

// export const GET: APIRoute = async ({ params }) => {
//   try {
//     const { profile_id } = params;
//     const { data: followers, error: followersError } = await supabase
//       .from('Profiles')
//       .select('*')
//       .filter('following', 'cs', parseInt(profile_id as string));

//     const { data: profile, error: profileError } = await supabase
//       .from('Profiles')
//       .select('following')
//       .eq('id', parseInt(profile_id as string))
//       .single();

//     if (followersError || profileError) {
//       return new Response(
//         JSON.stringify({ success: false, message: "There was an error reading the profiles", errors: { followersError, profileError } }),
//         { status: 500 }
//       );
//     }

//     return new Response(
//       JSON.stringify({ success: true, followers: followers.length ?? 0, following: profile?.following?.length ?? 0 }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, message: "An internal server error occurred." }),
//       { status: 500 }
//     );
//   }
// };

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { profile_id } = params;
    const body = await request.json();

    const { data: existingUser } = await supabase
      .from('Profiles')
      .select('following')
      .eq('id', profile_id)
      .single();

    if (!existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from('Profiles')
      .update({
        following: body.follow
          ? [...existingUser.following, body.follower]
          : existingUser.following.filter((user: number) => user !== body.follower),
      })
      .eq('id', profile_id);

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User followed successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 }
    );
  }
};
