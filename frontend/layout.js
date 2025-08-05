import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
    url: createPageUrl("Chats"),
    icon: MessageCircle,
  },
  {
    title: "Contacts",
    url: createPageUrl("Contacts"),
    icon: Users,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --background: #0a0a0a;
            --foreground: #ffffff;
            --card: #1a1a1a;
            --card-foreground: #ffffff;
            --popover: #1a1a1a;
            --popover-foreground: #ffffff;
            --primary: #10B981;
            --primary-foreground: #000000;
            --secondary: #262626;
            --secondary-foreground: #ffffff;
            --muted: #262626;
            --muted-foreground: #a3a3a3;
            --accent: #3B82F6;
            --accent-foreground: #ffffff;
            --destructive: #ef4444;
            --destructive-foreground: #ffffff;
            --border: #333333;
            --input: #1a1a1a;
            --ring: #10B981;
          }
          
          body {
            background: #0a0a0a;
            color: #ffffff;
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          }
          
          .message-gradient {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          }
          
          .glow-effect {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }
        `}
      </style>
      
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
                          location.pathname === item.url 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
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