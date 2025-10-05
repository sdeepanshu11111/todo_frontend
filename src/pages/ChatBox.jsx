import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

export default function ChatBox({ socket, currentUser, selectedUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      console.log("ChatBox received message:", msg);
      console.log("Current user ID:", currentUser.id);
      console.log("Selected user ID:", selectedUser._id);
      
      // Check if this message is part of the current conversation
      const isFromSelectedUser = msg.senderId === selectedUser._id && msg.receiverId === currentUser.id;
      const isToSelectedUser = msg.senderId === currentUser.id && msg.receiverId === selectedUser._id;
      
      if (isFromSelectedUser || isToSelectedUser) {
        console.log("Adding message to chat");
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, selectedUser._id, currentUser.id]);

  // Clear messages when switching users
  useEffect(() => {
    console.log("Clearing messages for new user:", selectedUser._id);
    setMessages([]);
  }, [selectedUser._id]);

  const sendMessage = () => {
    if (text.trim() === "" || !socket) return;

    const msg = {
      senderId: currentUser.id,
      receiverId: selectedUser._id,
      text: text.trim(),
      createdAt: new Date(),
    };

    console.log("Sending message:", msg);
    socket.emit("sendMessage", msg);

    // Add message to local state immediately (optimistic update)
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-300 flex items-center justify-between bg-purple-600 text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="font-medium">{selectedUser.name || selectedUser.email}</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-8">
            💬 Start a conversation!
          </div>
        ) : (
          messages.map((m, i) => {
            const isOwn = m.senderId === currentUser.id;
            return (
              <div
                key={i}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-2 rounded-lg text-sm ${
                    isOwn
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  }`}
                >
                  <div>{m.text}</div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    isOwn ? "text-purple-200" : "text-gray-500"
                  }`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-300 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
