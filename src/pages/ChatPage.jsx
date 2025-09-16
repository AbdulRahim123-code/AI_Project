import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import api from "../utlis/api";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const chatContainerRef = useRef(null);
  const THREAD_LIMIT = 10;

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Save chat to backend
  const saveChat = async () => {
    try {
      await api.post("/end");
      console.log("✅ Chat saved successfully");
    } catch (err) {
      console.error("❌ Error saving chat:", err);
    }
  };

  // Handle refresh/close
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      saveChat();
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Send message
  const handleSend = async (input) => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await api.post("/ask", {
        message: input,
        threadId: selectedThreadId,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: res.data.reply || "⚠ No reply from AI",
        },
      ]);

      if (messages.length + 2 >= THREAD_LIMIT) {
        await saveChat();
        console.log("💾 Chat saved (thread limit reached)");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "⚠ Server error. Please try again.",
        },
      ]);
    }
  };

  // Load messages for selected thread
  const handleSelectThread = async (threadId) => {
    setSelectedThreadId(threadId);
    try {
      const res = await api.get(`/thread/${threadId}`);
      setMessages(
        res.data.map((msg, idx) => ({
          id: idx,
          sender: msg.role === "assistant" ? "ai" : "user",
          text: msg.content,
        }))
      );
    } catch {
      setMessages([]);
    }
  };

  // Clear chat (start new)
  // Start a completely new thread
  const handleNewThread = async () => {
    try {
      const res = await api.post("/thread/new");
      const newThreadId = res.data.threadId;

      setSelectedThreadId(newThreadId); // ✅ use this new thread
      setMessages([]); // clear chat

      console.log("✅ New thread created:", newThreadId);
    } catch (error) {
      console.error("❌ Failed to create a new thread:", error);
      // fallback: still clear chat UI
      setSelectedThreadId(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen">
      {user && (
        <Sidebar
          user={user}
          onSelectThread={handleSelectThread}
          onNewThread={handleNewThread}
          selectedThreadId={selectedThreadId}
        />
      )}
      <main className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA]">
        <div className="w-full max-w-2xl mx-auto p-6 flex flex-col h-full">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="text-gray-400 text-center">Start a new chat</div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-lg text-left ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Chat input/search bar */}
          <SearchBar onSend={handleSend} />
        </div>
      </main>
    </div>
  );
}
