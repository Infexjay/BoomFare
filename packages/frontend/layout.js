import "./globals.css";
import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Users, User, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Chats",
    url: "/chats",
    icon: MessageCircle,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Users,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full gradient-bg">
        <Sidebar className="border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <SidebarHeader className="border-b border-zinc-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center glow-effect">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">BoomFare</h2>
                <p className="text-xs text-zinc-400">Messenger</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`rounded-xl transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-400 ${
                          pathname === item.url
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-zinc-900/30 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-zinc-800 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-white">BoomFare Messenger</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
