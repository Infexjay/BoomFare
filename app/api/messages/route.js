import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import Pusher from "pusher"
import { rateLimiter } from "@/app/lib/rate-limiter"
import { headers } from "next/headers"

const prisma = new PrismaClient()

// These should be in a .env file, but it's not working in this environment
const pusher = new Pusher({
  appId: "your-pusher-app-id",
  key: "your-pusher-key",
  secret: "your-pusher-secret",
  cluster: "your-pusher-cluster",
  useTLS: true
});

export async function POST(req) {
  const ip = headers().get("x-forwarded-for")
  const limit = 5 // 5 requests
  const windowMs = 60 * 1000 // 1 minute

  if (!rateLimiter(ip, limit, windowMs)) {
    return new Response("Too many requests", { status: 429 })
  }

  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { content, recipientId, fileUrl, messageType } = await req.json()

  const message = await prisma.message.create({
    data: {
      content,
      senderId: session.user.id,
      recipientId,
      fileUrl,
      messageType,
    },
    include: {
      sender: true,
      recipient: true,
    },
  })

  // Trigger Pusher event
  await pusher.trigger(`private-chat-${recipientId}`, "new-message", message)
  await pusher.trigger(`private-chat-${session.user.id}`, "new-message", message)

  return new Response(JSON.stringify(message), { status: 201 })
}

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const otherUserId = searchParams.get('otherUserId')

  if (!otherUserId) {
    return new Response("Missing otherUserId", { status: 400 })
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: session.user.id,
          recipientId: otherUserId,
        },
        {
          senderId: otherUserId,
          recipientId: session.user.id,
        },
      ],
    },
    include: {
      sender: true,
      recipient: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return new Response(JSON.stringify(messages))
}
