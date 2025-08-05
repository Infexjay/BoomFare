import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Check, Crown, Star, Zap, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const verificationIcons = {
  celebrity: Crown,
  lifetime: Star,
  monthly: Zap
};

const verificationColors = {
  celebrity: "text-yellow-400 bg-yellow-400/20",
  lifetime: "text-purple-400 bg-purple-400/20",
  monthly: "text-blue-400 bg-blue-400/20"
};

export default function ContactCard({ user, isContact, onAddContact }) {
  const getVerificationBadge = (verificationType) => {
    if (!verificationType || verificationType === 'none') return null;
    
    const Icon = verificationIcons[verificationType];
    const colorClass = verificationColors[verificationType];
    
    return (
      <Badge className={`${colorClass} border-0 text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {verificationType}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="relative mx-auto mb-4">
              <Avatar className="w-16 h-16 border-2 border-zinc-600 mx-auto">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-bold">
                  {user.username?.[0]?.toUpperCase() || user.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {user.is_online && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-zinc-800 rounded-full"></div>
              )}
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-white text-lg mb-1">
                {user.username || user.full_name}
              </h3>
              {getVerificationBadge(user.verification_type)}
            </div>

            {user.bio && (
              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                {user.bio}
              </p>
            )}

            <div className="flex gap-2">
              {isContact ? (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                    disabled
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Added
                  </Button>
                  <Link to={createPageUrl("Chats")} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={onAddContact}
                  size="sm"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white glow-effect"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}