import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { motion } from "framer-motion";

export default function MessageInput({ value, onChange, onSend, onKeyPress }) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/30 backdrop-blur-xl">
      <div className="flex items-end gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 resize-none bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 focus:border-emerald-500 rounded-xl pr-12"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-zinc-700 text-zinc-400 hover:text-yellow-400"
          >
            <Smile className="w-5 h-5" />
          </Button>
        </div>

        {value.trim() ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Button
              onClick={onSend}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl glow-effect"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'text-red-500' : ''}`} />
          </Button>
        )}
      </div>
    </div>
  );
}