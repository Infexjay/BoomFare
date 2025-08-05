import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function AddContactDialog({ open, onOpenChange, users, onAddContact }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContact = (userId) => {
    onAddContact(userId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            Add New Contact
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 focus:border-emerald-500"
            />
          </div>

          <ScrollArea className="h-80">
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
                >
                  <Avatar className="w-10 h-10 border border-zinc-700">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                      {user.username?.[0]?.toUpperCase() || user.full_name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">
                      {user.username || user.full_name}
                    </h4>
                    <p className="text-sm text-zinc-400 truncate">
                      {user.bio || "No bio"}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAddContact(user.id)}
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Add
                  </Button>
                </motion.div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-zinc-400">No users found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}