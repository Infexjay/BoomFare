import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Crown, Star, Zap, Shield, LogOut, Save } from "lucide-react";
import { motion } from "framer-motion";

import ProfileEditor from "../components/profile/ProfileEditor";
import VerificationCard from "../components/profile/VerificationCard";

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setEditData({
        username: user.username || '',
        bio: user.bio || '',
        phone_number: user.phone_number || ''
      });
    } catch (error) {
      console.error("User not logged in");
    }
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    
    setIsSaving(true);
    try {
      await User.updateMyUserData(editData);
      setCurrentUser({ ...currentUser, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await User.logout();
  };

  const getVerificationIcon = (verificationType) => {
    const icons = {
      celebrity: Crown,
      lifetime: Star,
      monthly: Zap
    };
    
    const colors = {
      celebrity: "text-yellow-400",
      lifetime: "text-purple-400",
      monthly: "text-blue-400"
    };

    if (!verificationType || verificationType === 'none') return null;
    
    const Icon = icons[verificationType];
    const colorClass = colors[verificationType];
    
    return <Icon className={`w-5 h-5 ${colorClass}`} />;
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
          <p className="text-zinc-400">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 border-4 border-emerald-500 glow-effect">
              <AvatarImage src={currentUser.avatar_url} />
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-2xl font-bold">
                {currentUser.username?.[0]?.toUpperCase() || currentUser.full_name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">
              {currentUser.username || currentUser.full_name}
            </h1>
            {getVerificationIcon(currentUser.verification_type)}
          </div>
          
          <p className="text-zinc-400">
            {currentUser.bio || "No bio set"}
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Profile Information</CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <ProfileEditor
                  data={editData}
                  onChange={setEditData}
                  onSave={saveProfile}
                  isSaving={isSaving}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-zinc-400">Username</Label>
                    <p className="text-white font-medium">
                      {currentUser.username || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Email</Label>
                    <p className="text-white font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Bio</Label>
                    <p className="text-white font-medium">
                      {currentUser.bio || 'No bio set'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Phone Number</Label>
                    <p className="text-white font-medium">
                      {currentUser.phone_number || 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Status */}
          <VerificationCard
            verificationType={currentUser.verification_type}
            userRole={currentUser.role}
          />

          {/* Account Actions */}
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-zinc-600 text-zinc-300 hover:bg-zinc-700"
              >
                <Shield className="w-4 h-4 mr-3" />
                Privacy Settings
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}