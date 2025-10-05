import { useEffect, useState } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import ChatBox from "./ChatBox";

export default function UsersList() {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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
            return (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isOnline ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-white">{u.name || u.email}</span>
                </div>
                <button
                  onClick={() => setSelectedUser(u)}
                  className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition"
                >
                  💬 Chat
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedUser && (
        <ChatBox
          socket={socket}
          currentUser={user}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
}
