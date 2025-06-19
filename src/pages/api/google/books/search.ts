import type { APIRoute } from "astro";
import 'dotenv/config'

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const books = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&key=${process.env.BOOKS_API_KEY}`).then(response => response.json());

    if (!books) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get books." }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify(books),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
