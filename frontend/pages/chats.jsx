
import React, { useState, useEffect, useRef } from "react";
import { Message, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import ChatList from "../components/chat/ChatList";
import MessageBubble from "../components/chat/MessageBubble";
import ChatHeader from "../components/chat/ChatHeader";
import MessageInput from "../components/chat/MessageInput";

export default function ChatsPage() {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const loadMessages = async () => {
    if (!selectedChat || !currentUser) return;
    
    const chatMessages = await Message.filter({
      $or: [
        { sender_id: currentUser.id, recipient_id: selectedChat.id },
        { sender_id: selectedChat.id, recipient_id: currentUser.id }
      ]
    }, 'created_date');
    
    setMessages(chatMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    const messageData = {
      content: newMessage,
      sender_id: currentUser.id,
      recipient_id: selectedChat.id,
      message_type: "text"
    };

    await Message.create(messageData);
    setNewMessage("");
    loadMessages();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getOtherUsers = () => {
    return users.filter(user => user.id !== currentUser?.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 glow-effect">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to BoomFare</h2>
          <p className="text-zinc-400">Please log in to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex gradient-bg">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r border-zinc-800 bg-zinc-900/30 backdrop-blur-xl">
        <ChatList 
          users={getOtherUsers()}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          currentUser={currentUser}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader user={selectedChat} />
            
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.sender_id === currentUser.id}
                      user={message.sender_id === currentUser.id ? currentUser : selectedChat}
                    />
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <MessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSend={sendMessage}
              onKeyPress={handleKeyPress}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-zinc-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Select a chat</h3>
              <p className="text-zinc-400">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
