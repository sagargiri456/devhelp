import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Assuming you use toast for notifications

const MentorDashboard = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const fetchDoubts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/doubts");
      setDoubts(res.data);
    } catch (err) {
      console.error("Failed to fetch doubts:", err);
      setError("Failed to load doubts. Please try again later.");
      toast.error("Failed to load doubts."); // Inform user via toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch doubts if the user is logged in and is a mentor
    if (user?.role === "mentor") {
      fetchDoubts();
    } else if (user && user.role !== "mentor") {
      // If logged in but not a mentor, maybe redirect or show a message
      toast.warn("You do not have access to the mentor dashboard.");
      // history.push('/unauthorized'); // Example: redirect
    }
  }, [user]); // Depend on user to re-fetch if user status changes

  const filteredDoubts = doubts.filter((d) =>
    filter === "all" ? true : d.status === filter
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#1A0C38] via-[#2A0F5B] to-[#3A127E] text-white font-sans">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide text-white drop-shadow-lg">
          Mentor Dashboard
        </h1>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap justify-center gap-4 p-4 rounded-xl bg-gray-800 bg-opacity-50 shadow-inner">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out
              ${filter === "all" ? "bg-purple-600 text-white shadow-md" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}
            `}
          >
            All Doubts
          </button>
          <button
            onClick={() => setFilter("open")}
            className={`px-6 py-2 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out
              ${filter === "open" ? "bg-green-600 text-white shadow-md" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}
            `}
          >
            Open Doubts
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-6 py-2 rounded-lg text-lg font-medium transition-all duration-300 ease-in-out
              ${filter === "resolved" ? "bg-blue-600 text-white shadow-md" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}
            `}
          >
            Resolved Doubts
          </button>
        </div>

        {loading && (
          <p className="text-center text-xl text-gray-400 mt-10">Loading doubts...</p>
        )}
        {error && (
          <p className="text-center text-xl text-red-500 mt-10">{error}</p>
        )}

        {!loading && !error && filteredDoubts.length === 0 ? (
          <p className="text-center text-xl text-gray-400 mt-10">
            No {filter === "all" ? "" : filter} doubts found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoubts.map((doubt) => (
              <div
                key={doubt._id} // Make sure _id is consistent
                className="bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col"
              >
                {/* Optional: Doubt title as link to detail page */}
                <Link to={`/doubts/${doubt._id}`} className="block p-5 pb-3">
                  <h2 className="text-2xl font-bold text-white mb-2 leading-tight hover:text-blue-400 transition-colors duration-200">
                    {doubt.title}
                  </h2>
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    {doubt.description}
                  </p>
                </Link>

                {/* Screenshot preview (if available) */}
                {doubt.screenshotUrl && (
                  <div className="flex-shrink-0 w-full"> {/* Ensure image scales */}
                    <img
                      src={doubt.screenshotUrl}
                      alt="Screenshot"
                      className="w-full h-48 object-cover border-t border-gray-700" // object-cover to prevent distortion
                    />
                  </div>
                )}

                <div className="p-5 pt-3 mt-auto flex justify-between items-end border-t border-gray-700">
                  {/* Status Badge */}
                  <span
                    className={`inline-block px-4 py-1 text-sm font-semibold rounded-full
                      ${doubt.status === "open" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}
                    `}
                  >
                    {doubt.status.charAt(0).toUpperCase() + doubt.status.slice(1)} {/* Capitalize status */}
                  </span>
                  <Link
                    to={`/doubts/${doubt._id}`}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;