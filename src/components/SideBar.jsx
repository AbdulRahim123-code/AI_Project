import { useEffect, useState } from "react";
import api from "../utlis/api";

export default function Sidebar({
  user,
  onSelectThread,
  onNewThread,
  selectedThreadId,
}) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    if (user) {
      api
        .get("/threads")
        .then((res) => setThreads(res.data))
        .catch(() => setThreads([]));
    }
  }, [user, onNewThread]); // ✅ refresh threads when new chat created

  // Delete thread handler
  const handleDeleteThread = async (threadId) => {
    if (!window.confirm("Delete this chat?")) return;
    try {
      await api.delete(`/thread/${threadId}`);
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
    } catch {
      alert("Failed to delete chat.");
    }
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col h-screen">
      <div className="p-4 border-b font-bold text-lg">Your Chats</div>
      <button
        className="m-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={onNewThread}
      >
        + New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 && (
          <div className="p-4 text-gray-400">No chats yet.</div>
        )}
        {threads.map((thread) => (
          <div key={thread.id} className="flex items-center border-b">
            <button
              className={`flex-1 text-left px-4 py-3 hover:bg-gray-100 ${
                selectedThreadId === thread.id
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => onSelectThread(thread.id)}
            >
              {thread.title || `Chat ${thread.id}`}
            </button>
            <button
              className="px-2 text-red-500 hover:text-red-700"
              title="Delete chat"
              onClick={() => handleDeleteThread(thread.id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
