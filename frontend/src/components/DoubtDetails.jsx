import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DoubtDetail = () => {
  const { doubtId } = useParams();
  const { user } = useAuth();

  const [doubt, setDoubt] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch doubt + comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doubtRes = await API.get(`/doubts/${doubtId}`);
        const commentRes = await API.get(`/comments/${doubtId}`);
        setDoubt(doubtRes.data);
        setComments(commentRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [doubtId]);

  const handleSubmit = async () => {
    try {
      if (!newComment) return;

      const res = await API.post(`/comments/${doubtId}`, { message: newComment });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      alert("Only mentors can comment.");
    }
  };

  const handleReopen = async () => {
    try {
      const res = await API.patch(`/doubts/reopen/${doubt._id}`);
      setDoubt(res.data);
    } catch (err) {
      alert("Could not reopen doubt");
    }
  };

  const handleResolve = async () => {
    try {
      const res = await API.patch(`/doubts/resolve/${doubt._id}`);
      setDoubt(res.data);
    } catch (err) {
      alert("Failed to mark as resolved");
    }
  };

  if (!doubt) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">{doubt.title}</h1>
      <p className="text-gray-300 mb-4">{doubt.description}</p>

      <div className="mb-6">
        <span
          className={`px-3 py-1 rounded text-sm ${
            doubt.status === "open" ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          {doubt.status}
        </span>
      </div>

      {/* Screenshot (if available) */}
      {doubt.screenshotUrl && (
        <div className="mb-6">
          <img
            src={doubt.screenshotUrl}
            alt="Uploaded Screenshot"
            className="rounded max-w-full h-auto border border-gray-600"
          />
        </div>
      )}

      {/* Comments */}
      <h2 className="text-2xl font-semibold mb-4">Replies</h2>
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-400">No replies yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="bg-gray-800 p-4 rounded shadow">
              <p className="text-gray-200">{c.message}</p>
              <p className="text-sm text-gray-400 mt-1">
                – {c.mentorId?.name || "Mentor"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Re-open button (student only) */}
      {user?.role === "student" &&
        doubt.status === "resolved" &&
        doubt.studentId?._id === user.id && (
          <button
            onClick={handleReopen}
            className="mt-4 bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
          >
            Re-open Doubt
          </button>
        )}

      {/* Reply + resolve (mentor only) */}
      {user?.role === "mentor" && (
        <div className="space-y-2 mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="3"
            className="w-full bg-gray-700 text-white p-2 rounded"
            placeholder="Type your reply here..."
          ></textarea>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Reply
          </button>

          {doubt.status === "open" && (
            <button
              onClick={handleResolve}
              className="ml-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              Mark as Resolved
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DoubtDetail;
