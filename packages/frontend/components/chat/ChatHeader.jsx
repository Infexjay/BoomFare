import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { Phone, Video, MoreVertical, Crown, Star, Zap } from "lucide-react";

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

export default function ChatHeader({ user }) {
  const getVerificationIcon = (verificationType) => {
    if (!verificationType || verificationType === 'none') return null;
    const Icon = verificationIcons[verificationType];
    const colorClass = verificationColors[verificationType];
    return <Icon className={`w-4 h-4 ${colorClass}`} />;
  };

  return (
    <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-10 h-10 border border-zinc-700">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                {user.username?.[0]?.toUpperCase() || user.full_name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {user.is_online && (
              <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-emerald-500 border border-zinc-900 rounded-full"></div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-white">
                {user.username || user.full_name}
              </h2>
              {getVerificationIcon(user.verification_type)}
            </div>
            <p className="text-sm text-zinc-400">
              {user.is_online ? "Online" : "Last seen recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}