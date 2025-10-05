import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ChatBox({ socket, currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    if (text.trim() === "") return;

    const msg = {
      senderId: currentUser.id,
      receiverId: selectedUser._id,
      text,
    };

    socket.emit("sendMessage", msg);

    setMessages((prev) => [...prev, { ...msg, createdAt: new Date() }]);
    setText("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
      <div className="p-3 border-b border-gray-700 text-white font-bold">
        Chat with {selectedUser.name || selectedUser.email}
      </div>
      <div className="p-3 h-60 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[75%] ${
              m.senderId === currentUser.id
                ? "bg-purple-600 text-white ml-auto"
                : "bg-gray-700 text-white mr-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg px-3 py-2 text-black"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
