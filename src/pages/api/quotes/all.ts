import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) ?? 1;
  const pageSize = Number(url.searchParams.get('pageSize')) ?? 4;
  const search = url.searchParams.get('search') ?? '';

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const { count } = await supabase
      .from('Quotes')
      .select('*', { count: 'exact', head: true });

    // total pages
    const pageCount = Math.ceil((count ?? 0) / pageSize);

    const { data: quotes, error } = await supabase
      .from('Quotes')
      .select(`
        *,
        book:Books(id, title, identifier),
        user:Profiles(id, username, email, avatar)
      `)
      .limit(pageSize)
      .range(from, to)
      .order('created_at', { ascending: false })
      .or(`quote.ilike.%${search}%`);

    if (quotes) {
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl('');

      const quotesData = quotes.map((quote: any) => {
        return {
          ...quote,
          user: {
            ...quote.user,
            avatar: !!quote.user.avatar ? `${publicUrl}/${quote.user.avatar}` : null
          }
        }
      });

      return new Response(
        JSON.stringify({
          quotes: quotesData,
          meta: {
            pagination: { page, pageCount, pageSize }
          }
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Failed to get quotes.", error }),
      { status: 400 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
