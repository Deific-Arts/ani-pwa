import type { APIRoute } from "astro";
import 'dotenv/config'
import { getStripe } from "../../../shared/utilities";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const origin = url.origin;

  try {
    const body = await request.json();
    const { member_id } = body;

    const session = await getStripe().billingPortal.sessions.create({
      customer: member_id,
      return_url: `${origin}/profile`,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'OK', url: session.url }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
