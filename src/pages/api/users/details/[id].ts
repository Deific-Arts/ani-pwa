import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const userId = params.id;

    const { data: profile, error: profileError } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: books, error: booksError } = await supabase
      .from('Books')
      .select('*')
      .in('id', profile.book_ids);

    const { data: quotes, error: quotesError, count: quotesCount } = await supabase
      .from('Quotes')
      .select('*', { count: 'exact'})
      .eq('user_id', userId);

    const { data: followers, error: followersError } = await supabase
      .from('Profiles')
      .select('*')
      .filter('following', 'cs', parseInt(userId as string));

    const followerCount = followers?.length ?? 0;

    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(profile.avatar);

    if (profileError || booksError || quotesError || followersError) {
      console.log({ errors: { profileError, booksError, quotesError, followersError } });
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get profile.", errors: { profileError, booksError, quotesError, followersError } }),
      { status: 500 }
      );
    }

    const data = {
      ...profile,
      books,
      counts: { quotes: quotesCount, followers: followerCount, following: profile.following?.length || 0 },
      avatar: publicUrl
    };

    return new Response(
      JSON.stringify(data),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const userId = Number(params.id);
    const body = await request.json();

    delete body.filepond;

    const { error } = await supabase
      .from('Profiles')
      .update(body)
      .eq('id', userId)

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to update profile.", error }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Profile updated successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred."}),
      { status: 500 })
  }
}

