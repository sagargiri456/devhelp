// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell"; // Ensure this path is correct (e.g., ./NotificationBell.jsx)
// No direct icon import here, NotificationBell handles it internally

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    // Removed max-w-7xl and rounded-2xl to make it full width and square corners.
    // Adjusted padding (p-3 vs p-4/5/6) for less height.
    // Removed md:mt-6 as it will now stick to the top.
    <nav className="w-full border-b border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl shadow-lg relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
          <Link
            to="/"
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 transition-all duration-300 ease-in-out"
          >
            DevHelp
          </Link>
        </div>
        <img src="https://ik.imagekit.io/sheryians/Sheryians_logo_EzwgcppnD" className="w- h-10"  alt="" />

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8"> {/* Reduced space-x for compactness */}
          <Link
            to={user?.role === "mentor" ? "/mentor" : "/doubts"}
            className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200" // Reduced font size
          >
            Doubts
          </Link>

          {/* Notification Bell is now a separate component handling its own icon */}
          <NotificationBell />

          {!user ? (
            <Link
              to="/signin"
              // Uses the global button styles from index.css
              className="button text-sm px-4 py-2" // Smaller button padding for compactness
            >
              Sign In
            </Link>
          ) : (
            <button
              onClick={logout}
              // Custom class for logout button to override global button gradient for a red one
              className="button bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 border-red-700 hover:border-red-500 text-sm px-4 py-2" // Smaller button padding
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Icon (Placeholder - you'd implement this with state/sidebar) */}
        <div className="md:hidden">
          {/* Example: Hamburger icon */}
          <button className="text-white text-xl">☰</button> {/* Smaller hamburger icon */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;