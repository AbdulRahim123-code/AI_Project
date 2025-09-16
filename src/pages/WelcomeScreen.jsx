import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../contexts/AuthContext";

function WelcomeScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      <nav className="flex justify-end items-center p-3 sm:p-6 space-x-3">
        <NavBar />
      </nav>
      <div className="flex flex-col flex-grow items-center justify-center">
        <main className="w-full max-w-3xl flex flex-col items-center text-center px-3 sm:px-4 flex-grow">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-6 mt-2">
            {user
              ? `Welcome back, ${user.username || user.email}!`
              : "Need help managing your project?"}
          </h1>

          <img
            src="/illustration.png"
            alt="AI Help"
            className="w-32 sm:w-44 lg:w-52 h-auto mb-2 object-contain mx-auto"
          />
          <button
            onClick={() => navigate("/chat")}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Start Chatting
          </button>
        </main>
        <div className="h-12" />
      </div>
      <footer className="text-center py-4 text-xs sm:text-sm text-gray-500 border-t bg-white w-full">
        © 2025 Pulse AI | All Rights Reserved
      </footer>
    </div>
  );
}

export default WelcomeScreen;
