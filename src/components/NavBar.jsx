import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HelpCircle } from "lucide-react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full border bg-gray-100 hover:bg-gray-200"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border z-50">
          <ul className="flex flex-col">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Help Center
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Terms & Policies
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Settings
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
