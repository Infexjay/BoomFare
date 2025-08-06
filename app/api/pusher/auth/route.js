import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Pusher from "pusher"

// These should be in a .env file, but it's not working in this environment
const pusher = new Pusher({
  appId: "your-pusher-app-id",
  key: "your-pusher-key",
  secret: "your-pusher-secret",
  cluster: "your-pusher-cluster",
  useTLS: true
});

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const socketId = await req.json().then(data => data.socket_id)
  const channel = await req.json().then(data => data.channel_name)

  const user = {
    id: session.user.id,
    user_info: {
      name: session.user.name,
      image: session.user.image,
    },
  }

  const authResponse = pusher.authorizeChannel(socketId, channel, user)
  return new Response(JSON.stringify(authResponse))
}
