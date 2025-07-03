import React, { useState,useEffect } from "react";
import API from "../api/axios";


const Doubts = () => {
  // State for doubts and form data
  const [doubts, setDoubts] = useState([]);

  const [formData, setFormData] = useState({ title: "", description: "", screenshot: null, screenshotUrl:"" });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });//after the destructuring when the 
    // setFormData will merge both the spread data and the computed data then it will overwrite the data which is conflicting
  };
  //fetching the doubts from the database.
  const fetchDoubts = async(req,res)=>{
    try{
        const res = await API.get("/doubts");
        setDoubts(res.data);
    }catch(error){
        console.error("Error fetching doubts:",error)
    }
  }

  //fetching all the doubts initially fromt thed atabase.
  useEffect(()=>{
    fetchDoubts();
  },[])

  // Add a new doubt
  const handleAddDoubt = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in all fields.");
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
      setFormData({ title: "", description: "", screenshot: null });
    } catch (error) {
      console.error("Error posting doubt:", error);
    }
  };
  

  // Delete a doubt
  const handleDeleteDoubt = async (id) => {
    try{
        const res = await API.delete(`/doubts/${id}`);
        setDoubts(doubts.filter((doubt) => doubt._id !== id));
    }catch(error){
        console.error("error while deleting the route.",error);
    }
  };

  return (
    <div className="min-h-screen w-screen  text-white p-6 font-sans">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center mb-6">Manage Your Doubts</h1>

      {/* Add Doubt Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Post a Doubt</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          rows="4"
        ></textarea>
        {formData.screenshot && (
          <img
            src={URL.createObjectURL(formData.screenshot)}
            alt="Preview"
            className="mt-4 rounded w-64"
          />
        )}
        {formData.screenshot && (
          <p className="text-sm text-gray-400 mb-2">
            Selected file: {formData.screenshot.name}
          </p>
        )}
        <input
          type="file"
          name="screenshot"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, screenshot: e.target.files[0] })}
          className="text-gray-300 mb-4"
        />
        <button
          onClick={handleAddDoubt}
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
        >
          Add Doubt
        </button>
      </div>

      {/* Doubts List */}
      <div className="max-w-4xl mx-auto">
        {doubts.length > 0 ? (
          doubts.map((doubt) => (
            <div
              key={doubt._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex justify-between items-start"
            >
              <div>
                <h3 className="text-xl font-bold">{doubt.title}</h3>
                <p className="text-gray-400">{doubt.description}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-sm rounded ${
                    doubt.status === "open"
                      ? "bg-green-500 text-white"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {doubt.status}
                </span>
                {doubt.screenshotUrl && (
                  <img src={doubt.screenshotUrl} alt="Screenshot" className="mt-4 rounded w-64" />
                )}
              </div>
              <div className="flex space-x-4">
                {doubt.status === "open" && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteDoubt(doubt._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No doubts found. Add one!</p>
        )}
      </div>
    </div>
  );
};

export default Doubts;
