import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";

export default function ProfileEditor({ data, onChange, onSave, isSaving }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="username" className="text-zinc-400">Username</Label>
        <Input
          id="username"
          value={data.username}
          onChange={(e) => handleChange('username', e.target.value)}
          placeholder="Enter username"
          className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-emerald-500"
        />
      </div>

      <div>
        <Label htmlFor="bio" className="text-zinc-400">Bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Tell people about yourself..."
          className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-emerald-500 h-24"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-zinc-400">Phone Number</Label>
        <Input
          id="phone"
          value={data.phone_number}
          onChange={(e) => handleChange('phone_number', e.target.value)}
          placeholder="+234 xxx xxx xxxx"
          className="bg-zinc-700 border-zinc-600 text-white placeholder-zinc-400 focus:border-emerald-500"
        />
      </div>

      <Button
        onClick={onSave}
        disabled={isSaving}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white glow-effect"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}