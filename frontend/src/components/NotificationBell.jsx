import React, { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Bell } from 'lucide-react'; // Import the Bell icon from lucide-react


const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [lastSeenCount, setLastSeenCount] = useState(0); // This state needs to persist across renders to compare properly

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      const notifs = res.data;
      setNotifications(notifs);

      const currentUnreadCount = notifs.filter((n) => !n.isRead).length;

      // Only show toast if the number of unread notifications has actually increased
      // and it's not the initial load where lastSeenCount is 0
      if (currentUnreadCount > lastSeenCount && lastSeenCount !== 0) {
        // Find the newly added notification (assuming they are returned in order, newest first)
        const newNotifications = notifs.filter(n => !n.isRead && !notifications.some(oldN => oldN._id === n._id));
        if (newNotifications.length > 0) {
            toast.success(`🔔 New Notification: ${newNotifications[0].message}`); // Show toast for the newest
        }
      }
      setLastSeenCount(currentUnreadCount); // Update lastSeenCount for the next comparison
    } catch (err) {
      console.error("Failed to load notifications", err);
      toast.error("Failed to load notifications."); // Provide user feedback
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      fetchNotifications(); // Re-fetch to update status
    } catch (err) {
      console.error("Failed to mark as read", err);
      toast.error("Failed to mark notification as read."); // Provide user feedback
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications on component mount and periodically (if user is student)
  useEffect(() => {
    if (user?.role === "student") {
      fetchNotifications();
      // Set up polling for new notifications (e.g., every 30 seconds)
      const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(intervalId); // Clean up interval on unmount
    }
  }, [user]); // Depend on user to re-fetch if user status changes

  // Don't render anything if the user is not a student
  if (user?.role !== "student") return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} className="text-white" /> {/* Lucide Bell Icon, size 20px */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center flex items-center justify-center border-2 border-gray-700">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 z-50 origin-top-right transform scale-95 opacity-0 animate-fadeInUp">
          <div className="p-4 font-semibold border-b border-gray-700 text-lg">Notifications</div>
          {notifications.length === 0 ? (
            <p className="text-sm text-center text-gray-400 p-4">No notifications to display.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`cursor-pointer p-4 text-sm border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200 ${
                  !n.isRead ? "font-semibold text-white" : "text-gray-400"
                }`}
                onClick={() => handleMarkAsRead(n._id)}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;