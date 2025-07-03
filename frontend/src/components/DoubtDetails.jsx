// src/components/DoubtDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify"; // Make sure you have react-toastify installed and configured in App.jsx

const DoubtDetail = () => {
  const { doubtId } = useParams();
  const { user } = useAuth();

  const [doubt, setDoubt] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true); // <--- NEW STATE
  const [error, setError] = useState(null);   // <--- NEW STATE

  // Fetch doubt + comments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // <--- SET LOADING TRUE
      setError(null);   // <--- CLEAR PREVIOUS ERRORS
      try {
        if (!doubtId) { // Basic check for doubtId
          setError("Doubt ID is missing in URL.");
          setLoading(false);
          toast.error("Doubt ID is missing.");
          return;
        }

        const doubtRes = await API.get(`/doubts/${doubtId}`);
        // This line is crucial - ensure it matches your backend's GET /comments/:doubtId route
        const commentRes = await API.get(`/comments/${doubtId}`); // <--- CONFIRMED CORRECT BASED ON YOUR BACKEND CONTROLLER

        setDoubt(doubtRes.data);
        setComments(commentRes.data);
        toast.success("Doubt details loaded successfully!"); // <--- FEEDBACK
      } catch (err) {
        console.error("Failed to fetch doubt details or comments:", err);
        // <--- ADD DETAILED ERROR LOGGING HERE (FROM PREVIOUS RESPONSE)
        if (err.response) {
            console.error("Error Response Data:", err.response.data);
            console.error("Error Response Status:", err.response.status);
            setError(err.response.data.message || `Error: ${err.response.status} - Could not load doubt details.`);
            toast.error(err.response.data.message || "Failed to load doubt details.");
        } else if (err.request) {
            setError("No response from server. Check your network connection.");
            toast.error("Network error. Could not connect to server.");
        } else {
            setError(`An unexpected error occurred: ${err.message}`);
            toast.error("An unexpected error occurred.");
        }
        setDoubt(null); // <--- IMPORTANT: Clear doubt data on error
        setComments([]);
      } finally {
        setLoading(false); // <--- ALWAYS SET LOADING TO FALSE
      }
    };

    fetchData();
  }, [doubtId]);

  // --- Handlers (keep as they are, but consider adding toast for user feedback) ---
  const handleSubmit = async () => {
    if (!newComment.trim()) { // Added .trim() check
        toast.warn("Comment cannot be empty."); // Feedback
        return;
    }
    try {
        const res = await API.post(`/comments/${doubtId}`, { message: newComment });
        setComments([...comments, res.data]);
        setNewComment("");
        toast.success("Comment added successfully!"); // Feedback
    } catch (err) {
        console.error("Error posting comment:", err);
        if (err.response && err.response.status === 403) {
            toast.error("You are not authorized to comment.");
        } else {
            toast.error("Failed to add comment.");
        }
    }
  };

  const handleReopen = async () => {
    if (!doubt || !doubt._id) return;
    try {
        const res = await API.patch(`/doubts/reopen/${doubt._id}`);
        setDoubt(res.data);
        toast.info("Doubt re-opened!"); // Feedback
    } catch (err) {
        console.error("Error reopening doubt:", err);
        toast.error("Could not reopen doubt. Check permissions.");
    }
  };

  const handleResolve = async () => {
    if (!doubt || !doubt._id) return;
    try {
        const res = await API.patch(`/doubts/resolve/${doubt._id}`);
        setDoubt(res.data);
        toast.success("Doubt marked as resolved!"); // Feedback
    } catch (err) {
        console.error("Error resolving doubt:", err);
        toast.error("Failed to mark as resolved. Check permissions.");
    }
  };


  // --- Conditional Rendering for Loading, Error, and Content ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] text-white text-xl animate-pulse">
        Loading Doubt Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 mt-10 p-4 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
        <p className="text-xl font-semibold mb-2">Error Loading Doubt</p>
        <p>{error}</p>
        <p className="text-sm mt-4 text-gray-400">Please try refreshing the page or check your network connection.</p>
      </div>
    );
  }

  // If not loading and no error, but doubt is still null (e.g., 404 Not Found from API)
  if (!doubt) {
    return (
      <div className="text-white text-center mt-10 p-4 bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
        <p className="text-xl font-semibold mb-2">Doubt Not Found</p>
        <p className="text-gray-400">The doubt you are looking for does not exist or you do not have permission to view it.</p>
      </div>
    );
  }

  // --- Actual Render if data is loaded and no errors ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0C38] via-[#2A0F5B] to-[#3A127E] text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto py-8">
        {/* Doubt Details Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-gray-700">
          <h1 className="text-3xl font-bold mb-3 text-white">{doubt.title}</h1>
          <p className="text-gray-300 text-lg mb-4">{doubt.description}</p>

          <div className="mb-6 flex items-center gap-4">
            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold
                ${doubt.status === "open" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}
              `}
            >
              {doubt.status.charAt(0).toUpperCase() + doubt.status.slice(1)}
            </span>
            {doubt.studentId?.name && (
                <span className="text-gray-400 text-sm">
                    Posted by: {doubt.studentId.name}
                </span>
            )}
          </div>

          {doubt.screenshotUrl && (
            <div className="mb-6 border border-gray-700 rounded-lg overflow-hidden">
              <img
                src={doubt.screenshotUrl}
                alt="Uploaded Screenshot"
                className="max-w-full h-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Replies</h2>
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No replies yet. Be the first to comment!</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-600">
                  <p className="text-gray-200 text-base">{c.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    – {c.mentorId?.name || "Anonymous Mentor"}
                    {c.createdAt && <span className="ml-2">({new Date(c.createdAt).toLocaleString()})</span>}
                  </p>
                </div>
              ))
            )}
          </div>

          {user?.role === "student" &&
            doubt.status === "resolved" &&
            doubt.studentId?._id === user.id && (
              <button
                onClick={handleReopen}
                className="mt-4 bg-yellow-600 px-6 py-2 rounded-lg text-white font-semibold hover:bg-yellow-700 transition-colors duration-200 shadow-md"
              >
                Re-open Doubt
              </button>
            )}

          {user?.role === "mentor" && (
            <div className="space-y-4 mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="4"
                className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Type your reply here..."
              ></textarea>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 px-6 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md flex-grow"
                >
                  Post Reply
                </button>

                {doubt.status === "open" && (
                  <button
                    onClick={handleResolve}
                    className="bg-green-600 px-6 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md flex-grow"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtDetail;