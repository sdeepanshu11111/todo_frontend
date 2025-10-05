import { useEffect, useState } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "./ChatBox";

export default function UsersList() {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessages, setNewMessages] = useState(new Map());

  console.log(user, "user");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const newSocket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      withCredentials: true,
    });
    setSocket(newSocket);

    console.log("Socket connecting for user:", user.id);
    newSocket.emit("join", user.id);

    newSocket.on("updateUsers", (online) => {
      console.log("Online users updated:", online);
      setOnlineUsers(online);
    });

    // Listen for incoming messages for notifications only
    newSocket.on("receiveMessage", (msg) => {
      console.log("Users component - New message received:", msg);
      console.log("Current selected user:", selectedUser?._id);
      console.log("Message sender:", msg.senderId);
      
      // Only show notification if message is TO current user and chat is not open with sender
      if (msg.receiverId === user.id && (!selectedUser || selectedUser._id !== msg.senderId)) {
        console.log("Adding notification for user:", msg.senderId);
        setNewMessages(prev => {
          const updated = new Map(prev);
          updated.set(msg.senderId, (updated.get(msg.senderId) || 0) + 1);
          return updated;
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">👥 Users List</h1>

        <div className="glass rounded-2xl p-4 space-y-3">
          {users.map((u) => {
            const isOnline = onlineUsers.includes(u._id);
            const unreadCount = newMessages.get(u._id) || 0;
            return (
              <motion.div
                key={u._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition relative"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isOnline ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></div>
                    {isOnline && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-white">{u.name || u.email}</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    // Clear unread messages for this user
                    setNewMessages(prev => {
                      const updated = new Map(prev);
                      updated.delete(u._id);
                      return updated;
                    });
                  }}
                  className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
                >
                  💬 Chat
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-xs px-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ChatBox
              socket={socket}
              currentUser={user}
              selectedUser={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
