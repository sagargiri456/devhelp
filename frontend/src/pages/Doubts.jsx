import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify"; // Assuming you use toast for notifications

const Doubts = () => {
  // State for doubts and form data
  const [doubts, setDoubts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    screenshot: null,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, screenshot: e.target.files[0] });
  };

  // Fetching the doubts from the database.
  const fetchDoubts = async () => {
    try {
      const res = await API.get("/doubts");
      setDoubts(res.data);
    } catch (error) {
      console.error("Error fetching doubts:", error);
      toast.error("Failed to load your doubts.");
    }
  };

  // Fetching all the doubts initially from the database.
  useEffect(() => {
    fetchDoubts();
  }, []);

  // Add a new doubt
  const handleAddDoubt = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (formData.screenshot) {
        data.append("screenshot", formData.screenshot);
      }

      const res = await API.post("/doubts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDoubts([...doubts, res.data]);
      setFormData({ title: "", description: "", screenshot: null }); // Clear form
      toast.success("Doubt posted successfully!");
    } catch (error) {
      console.error("Error posting doubt:", error);
      toast.error("Failed to post doubt. Please try again.");
    }
  };

  // Delete a doubt
  const handleDeleteDoubt = async (id) => {
    try {
      await API.delete(`/doubts/${id}`);
      setDoubts(doubts.filter((doubt) => doubt._id !== id));
      toast.success("Doubt deleted successfully!");
    } catch (error) {
      console.error("Error while deleting the doubt.", error);
      toast.error("Failed to delete doubt.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0C38] via-[#2A0F5B] to-[#3A127E] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight text-white drop-shadow-lg animate-fade-in-down">
          Manage Your Doubts
        </h1>

        {/* Add Doubt Form Section */}
        <section className="mb-16">
          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700 transform transition-transform duration-300 hover:scale-[1.01]">
            <h2 className="text-3xl font-bold text-center text-purple-300 mb-6">
              Post a New Doubt
            </h2>
            <div className="space-y-5">
              <input
                type="text"
                name="title"
                placeholder="Brief Title of Your Doubt (e.g., 'React Hook Issue')"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <textarea
                name="description"
                placeholder="Detailed description of your problem, what you've tried, etc."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows="6"
              ></textarea>

              {/* Screenshot Upload */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors duration-200">
                <label htmlFor="screenshot-upload" className="cursor-pointer">
                  <span className="text-blue-400 text-lg font-semibold hover:underline">
                    {formData.screenshot ? "Change Screenshot" : "Upload Screenshot (Optional)"}
                  </span>
                  <input
                    id="screenshot-upload"
                    type="file"
                    name="screenshot"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {formData.screenshot && (
                  <>
                    <p className="text-sm text-gray-400 mt-2">
                      Selected file: {formData.screenshot.name}
                    </p>
                    <img
                      src={URL.createObjectURL(formData.screenshot)}
                      alt="Preview"
                      className="mt-4 rounded-lg shadow-md max-w-full h-48 object-contain border border-gray-700"
                    />
                  </>
                )}
              </div>

              <button
                onClick={handleAddDoubt}
                className="w-full bg-blue-600 px-6 py-3 rounded-lg text-white text-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Submit Doubt
              </button>
            </div>
          </div>
        </section>

        {/* Doubts List Section */}
        <section>
          <h2 className="text-4xl font-extrabold text-white text-center mb-10 tracking-wide drop-shadow-md">
            Your Posted Doubts
          </h2>

          {doubts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doubts.map((doubt) => (
                <div
                  key={doubt._id}
                  className="bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden flex flex-col border border-gray-700"
                >
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                      {doubt.title}
                    </h3>
                    <p className="text-gray-300 text-base line-clamp-3 mb-4">
                      {doubt.description}
                    </p>
                    <span
                      className={`inline-block mt-2 px-4 py-1 text-sm font-semibold rounded-full
                        ${doubt.status === "open" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}
                      `}
                    >
                      {doubt.status.charAt(0).toUpperCase() + doubt.status.slice(1)}
                    </span>
                  </div>

                  {doubt.screenshotUrl && (
                    <div className="flex-shrink-0 w-full">
                      <img
                        src={doubt.screenshotUrl}
                        alt="Screenshot"
                        className="w-full h-48 object-cover object-center border-t border-gray-700"
                      />
                    </div>
                  )}

                  <div className="p-4 pt-3 border-t border-gray-700 flex justify-end">
                    {doubt.status === "open" && (
                      <button
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center gap-1 text-md"
                        onClick={() => handleDeleteDoubt(doubt._id)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl text-gray-400 mt-10 p-4 bg-gray-900 bg-opacity-50 rounded-lg shadow-inner">
              You haven't posted any doubts yet. Use the form above to get started!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Doubts;