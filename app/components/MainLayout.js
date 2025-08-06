'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: 'Chats', href: '/chats' },
  { name: 'Contacts', href: '/contacts' },
  { name: 'Profile', href: '/profile' },
]

export default function MainLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">BoomFare</h1>
          </div>
          <nav className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-300 hover:bg-muted hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
