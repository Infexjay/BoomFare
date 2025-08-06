import { PrismaClient } from "@prisma/client"
import Stripe from "stripe"
import { headers } from "next/headers"

const prisma = new PrismaClient()

// These should be in a .env file
const stripe = new Stripe("your-stripe-secret-key")
const webhookSecret = "your-stripe-webhook-secret"

export async function POST(req) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const userId = session.metadata.userId

    // For simplicity, we'll just set the user as verified.
    // In a real app, you would create a Verification record with the subscription details.
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    })
  }

  return new Response(null, { status: 200 })
}
