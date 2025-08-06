'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Pusher from 'pusher-js'
import { storage } from '../lib/firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { generateKey, encryptFile, decryptFile } from '../lib/crypto'
import DOMPurify from 'dompurify'

export default function ChatsPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const messagesEndRef = useRef(null)

  // This is a simplified key management. In a real app, you'd use a more secure key exchange mechanism.
  const [encryptionKey, setEncryptionKey] = useState(null)

  useEffect(() => {
    const generateAndSetKey = async () => {
      const key = await generateKey()
      setEncryptionKey(key)
    }
    generateAndSetKey()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const res = await fetch(`/api/messages?otherUserId=${selectedUser.id}`)
        const data = await res.json()
        setMessages(data)
      }
      fetchMessages()
    }
  }, [selectedUser])

  useEffect(() => {
    if (!selectedUser || !session) return

    const pusher = new Pusher("your-pusher-key", {
      cluster: "your-pusher-cluster",
      authEndpoint: "/api/pusher/auth",
      auth: {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          userId: session.user.id,
        }
      }
    });

    const channel = pusher.subscribe(`private-chat-${session.user.id}`)

    channel.bind('new-message', (data) => {
      if (data.senderId === selectedUser.id || data.senderId === session.user.id) {
        setMessages((prevMessages) => [...prevMessages, data])
      }
    })

    return () => {
      pusher.unsubscribe(`private-chat-${session.user.id}`)
    }
  }, [selectedUser, session])

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedFile) || !selectedUser) return

    let fileUrl = null;
    let messageType = 'text';

    if (selectedFile) {
      if (!encryptionKey) {
        alert("Encryption key not generated yet. Please wait.")
        return
      }

      messageType = 'file';
      const { encryptedFile } = await encryptFile(selectedFile, encryptionKey)
      const storageRef = ref(storage, `files/${selectedFile.name}-${Date.now()}`);
      await uploadBytes(storageRef, encryptedFile)
      fileUrl = await getDownloadURL(storageRef)
    }

    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newMessage,
        recipientId: selectedUser.id,
        fileUrl: fileUrl,
        messageType: messageType,
      }),
    })
    setNewMessage('')
    setSelectedFile(null)
  }

  const handleDownloadAndDecrypt = async (fileUrl) => {
    if (!encryptionKey) {
        alert("Encryption key not generated yet. Please wait.")
        return
    }

    const res = await fetch(fileUrl)
    const encryptedBlob = await res.blob()
    const iv = await encryptedBlob.slice(0, 12).arrayBuffer()
    const encryptedData = await encryptedBlob.slice(12).arrayBuffer()

    const decryptedBlob = await decryptFile(encryptedData, encryptionKey, iv)
    const url = URL.createObjectURL(decryptedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = "decrypted-file" // You might want to store the original filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!session) {
    return <div>Please sign in to view chats.</div>
  }

  return (
    <div className="flex h-full">
      {/* User List */}
      <div className="w-1/3 border-r border-secondary">
        <div className="p-4 border-b border-secondary">
          <h2 className="text-xl font-bold">Users</h2>
        </div>
        <ul className="overflow-y-auto">
          {users.map((user) => (
            user.id !== session.user.id && (
              <li
                key={user.id}
                className={`p-4 border-b border-secondary hover:bg-muted cursor-pointer ${
                  selectedUser?.id === user.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="font-bold">{user.name}</h3>
                  </div>
                </div>
              </li>
            )
          ))}
        </ul>
      </div>

      {/* Message View */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-secondary">
              <h2 className="text-xl font-bold">{selectedUser.name}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 mb-4 ${
                    message.senderId === session.user.id ? 'justify-end' : ''
                  }`}
                >
                  {message.senderId !== session.user.id && (
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.senderId === session.user.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {message.messageType === 'file' ? (
                      <button onClick={() => handleDownloadAndDecrypt(message.fileUrl)} className="text-accent underline">
                        Download encrypted file
                      </button>
                    ) : (
                      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }}></p>
                    )}
                  </div>
                  {message.senderId === session.user.id && (
                    <div className="w-8 h-8 bg-secondary rounded-full"></div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-secondary flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full bg-muted text-foreground p-2 rounded-lg"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="ml-2"
              />
              <button type="submit" className="ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
