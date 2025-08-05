import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Crown, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const verificationIcons = {
  celebrity: Crown,
  lifetime: Star,
  monthly: Zap
};

const verificationColors = {
  celebrity: "text-yellow-400",
  lifetime: "text-purple-400", 
  monthly: "text-blue-400"
};

export default function ChatList({ users, selectedChat, onSelectChat, currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerificationIcon = (verificationType) => {
    if (!verificationType || verificationType === 'none') return null;
    const Icon = verificationIcons[verificationType];
    const colorClass = verificationColors[verificationType];
    return <Icon className={`w-4 h-4 ${colorClass}`} />;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 focus:border-emerald-500"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectChat(user)}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 ${
                selectedChat?.id === user.id 
                  ? 'bg-emerald-500/20 border border-emerald-500/30' 
                  : 'hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-zinc-700">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold">
                      {user.username?.[0]?.toUpperCase() || user.full_name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {user.is_online && (
                    <div className="absolute -bottom-0 -right-0 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate">
                      {user.username || user.full_name}
                    </h3>
                    {getVerificationIcon(user.verification_type)}
                  </div>
                  <p className="text-sm text-zinc-400 truncate">
                    {user.bio || (user.is_online ? "Online" : "Last seen recently")}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-zinc-500" />
              </div>
              <p className="text-zinc-400">No users found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}