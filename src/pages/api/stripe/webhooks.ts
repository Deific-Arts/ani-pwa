import type { APIRoute } from "astro";
import 'dotenv/config';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let event = await request.json();

    let subscription;
    let status;

    switch (event.type) {
      case 'customer.subscription.deleted':
        subscription = event.data.object;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        break;
      case 'checkout.session.completed':
        subscription = event.data.object;
        status = subscription.status;

        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        async function sendMailCheckoutCompleted() {
          const customerDetails = event.data.object.customer_details
          const info = await transporter.sendMail({
            from: '"Deific Arts LLC" <donotreply@deificarts.com>',
            to: customerDetails.email,
            subject: `${customerDetails.name}, you are now a member of Ani.`,
            text: "Thanks for purchasing a membership. You now have access to the full capabilities of Ani Book Quotes.", // plain text body
            html: "<p>Thanks for purchasing a membership. You now have access to the full capabilities of Ani Book Quotes.</p>", // html body
          });

          console.log("Message sent: %s", info.messageId);
        }

        sendMailCheckoutCompleted().catch(console.error);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}.`);
    }

    return new Response(
      JSON.stringify({ message: 'Successfully fired webhook' }),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
