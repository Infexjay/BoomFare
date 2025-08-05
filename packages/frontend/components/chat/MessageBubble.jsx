import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ message, isOwn, user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {!isOwn && (
        <Avatar className="w-8 h-8 border border-zinc-700">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs">
            {user.username?.[0]?.toUpperCase() || user.full_name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOwn
              ? 'message-gradient text-white ml-auto'
              : 'bg-zinc-800 text-white'
          }`}
        >
          <p className="break-words">{message.content}</p>
        </div>
        
        <div className={`flex items-center gap-1 mt-1 text-xs text-zinc-500 ${
          isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span>{format(new Date(message.created_date), 'HH:mm')}</span>
          {isOwn && (
            <div className="flex">
              {message.is_read ? (
                <CheckCheck className="w-3 h-3 text-blue-400" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}