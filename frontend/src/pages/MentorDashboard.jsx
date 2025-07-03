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
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-5xl font-extrabold mb-12 text-center tracking-tight text-white drop-shadow-lg animate-fade-in-down">
          Mentor Dashboard
        </h1>

        {/* Filter Buttons */}
        <section className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 p-5 rounded-2xl bg-gray-900 bg-opacity-60 shadow-2xl backdrop-blur-sm border border-gray-700">
            <button
              onClick={() => setFilter("all")}
              className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105
                ${filter === "all" ? "bg-purple-700 text-white shadow-lg border border-purple-500" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600"}
              `}
            >
              All Doubts
            </button>
            <button
              onClick={() => setFilter("open")}
              className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105
                ${filter === "open" ? "bg-green-600 text-white shadow-lg border border-green-500" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600"}
              `}
            >
              Open Doubts
            </button>
            <button
              onClick={() => setFilter("resolved")}
              className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105
                ${filter === "resolved" ? "bg-blue-600 text-white shadow-lg border border-blue-500" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600"}
              `}
            >
              Resolved Doubts
            </button>
          </div>
        </section>



        {/* Loading, Error, and No Doubts State */}
        {loading && (
          <p className="text-center text-2xl text-purple-300 mt-16 animate-pulse">
            Loading doubts...
          </p>
        )}
        {error && (
          <p className="text-center text-2xl text-red-400 mt-16">
            Error: {error}
          </p>
        )}

        {!loading && !error && filteredDoubts.length === 0 ? (
          <p className="text-center text-2xl text-gray-400 mt-16">
            No {filter === "all" ? "" : filter} doubts found at the moment.
          </p>
        ) : (
          <section>
            <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide drop-shadow-md">
              Browse Student Doubts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoubts.map((doubt) => (
                <div
                  key={doubt._id}
                  className="bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col transform hover:-translate-y-2 border border-gray-700"
                >
                  {/* Optional: Doubt title as link to detail page */}
                  <Link to={`/doubts/${doubt._id}`} className="block p-6 pb-4 flex-grow">
                    <h2 className="text-3xl font-bold text-white mb-3 leading-tight hover:text-blue-400 transition-colors duration-200">
                      {doubt.title}
                    </h2>
                    <p className="text-gray-300 text-base line-clamp-3 mb-4">
                      {doubt.description}
                    </p>
                  </Link>

                  {/* Screenshot preview (if available) */}
                  {doubt.screenshotUrl && (
                    <div className="flex-shrink-0 w-full overflow-hidden">
                      <img
                        src={doubt.screenshotUrl}
                        alt="Screenshot"
                        className="w-full h-52 object-cover object-center border-t border-gray-700 transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 pt-4 mt-auto flex justify-between items-center border-t border-gray-700">
                    {/* Status Badge */}
                    <span
                      className={`inline-block px-5 py-2 text-md font-semibold rounded-full shadow-md
                        ${doubt.status === "open" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}
                      `}
                    >
                      {doubt.status.charAt(0).toUpperCase() + doubt.status.slice(1)}
                    </span>
                    <Link
                      to={`/doubts/${doubt._id}`}
                      className="text-blue-400 hover:text-blue-300 font-bold text-lg transition-colors duration-200 flex items-center"
                    >
                      View Details
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;