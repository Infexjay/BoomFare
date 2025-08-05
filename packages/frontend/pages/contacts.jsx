import React, { useState, useEffect } from "react";
import { User, Contact } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Users, Crown, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ContactCard from "../components/contacts/ContactCard";
import AddContactDialog from "../components/contacts/AddContactDialog";

const verificationIcons = {
  celebrity: Crown,
  lifetime: Star,
  monthly: Zap
};

export default function ContactsPage() {
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
    loadContacts();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("User not logged in");
    }
  };

  const loadUsers = async () => {
    const userList = await User.list();
    setUsers(userList);
  };

  const loadContacts = async () => {
    if (!currentUser) return;
    const contactList = await Contact.filter({ user_id: currentUser.id });
    setContacts(contactList);
  };

  const addContact = async (userId) => {
    if (!currentUser) return;
    
    await Contact.create({
      user_id: currentUser.id,
      contact_user_id: userId,
      status: "pending"
    });
    
    loadContacts();
  };

  const getFilteredUsers = () => {
    let filteredUsers = users.filter(user => 
      user.id !== currentUser?.id &&
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedTab === "verified") {
      filteredUsers = filteredUsers.filter(user => 
        user.verification_type && user.verification_type !== 'none'
      );
    }

    return filteredUsers;
  };

  const isContact = (userId) => {
    return contacts.some(contact => contact.contact_user_id === userId);
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <Users className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Contacts</h2>
          <p className="text-zinc-400">Please log in to manage contacts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen gradient-bg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Contacts</h1>
            <p className="text-zinc-400 mt-1">Discover and connect with people</p>
          </div>
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white glow-effect"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 focus:border-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedTab === "all" ? "default" : "outline"}
              onClick={() => setSelectedTab("all")}
              className={selectedTab === "all" ? "bg-emerald-500 hover:bg-emerald-600" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}
            >
              All Users
            </Button>
            <Button
              variant={selectedTab === "verified" ? "default" : "outline"}
              onClick={() => setSelectedTab("verified")}
              className={selectedTab === "verified" ? "bg-emerald-500 hover:bg-emerald-600" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}
            >
              <Crown className="w-4 h-4 mr-2" />
              Verified
            </Button>
          </div>
        </div>

        {/* User Grid */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {getFilteredUsers().map((user) => (
                <ContactCard
                  key={user.id}
                  user={user}
                  isContact={isContact(user.id)}
                  onAddContact={() => addContact(user.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {getFilteredUsers().length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
              <p className="text-zinc-400">Try adjusting your search or filters</p>
            </div>
          )}
        </ScrollArea>

        <AddContactDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          users={users.filter(u => u.id !== currentUser?.id)}
          onAddContact={addContact}
        />
      </div>
    </div>
  );
}