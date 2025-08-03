import type { APIRoute } from "astro";
import 'dotenv/config'
import { getStripe } from "../../../shared/utilities";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const origin = url.origin;

  try {
    const body = await request.json();

    const prices = await getStripe().prices.list({
      lookup_keys: [body.lookup_key],
      expand: ['data.product',]
    });

    const session = await getStripe().checkout.sessions.create({
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      customer_email: body.email,
      mode: 'subscription',
      ui_mode: "embedded",
      return_url: `${origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
