'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session } = useSession()

  if (!session) {
    return <div>Please sign in to view your profile.</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-4">
        <div>
          <p className="font-bold">Name:</p>
          <p>{session.user.name}</p>
        </div>
        <div>
          <p className="font-bold">Email:</p>
          <p>{session.user.email}</p>
        </div>
        <div>
          <p className="font-bold">Verification Status:</p>
          <p>{session.user.isVerified ? "Verified" : "Not Verified"}</p>
        </div>
        {!session.user.isVerified && (
          <Link href="/verification">
            <a className="text-accent underline">Get Verified</a>
          </Link>
        )}
      </div>
    </div>
  )
}
