import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Stripe from "stripe"

// These should be in a .env file
const stripe = new Stripe("your-stripe-secret-key")

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { priceId } = await req.json()

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/profile?payment_success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/profile?payment_canceled=true`,
    metadata: {
      userId: session.user.id,
    },
  })

  return new Response(JSON.stringify({ sessionId: checkoutSession.id }))
}
