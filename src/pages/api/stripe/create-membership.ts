import type { APIRoute } from "astro";
import 'dotenv/config'
import { getStripe } from "../../../shared/utilities";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const origin = url.origin;

  try {
    const body = await request.json();
    const { session_id, profile_id } = body;

    const checkoutSession = await getStripe().checkout.sessions.retrieve(session_id);
    const memberId = checkoutSession.customer;

    await fetch(`${origin}/api/users/details/${profile_id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member_id: memberId }),
    });

    return new Response(
      JSON.stringify({ success: true, message: 'OK' }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
