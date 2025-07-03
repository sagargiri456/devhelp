import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/signin");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="mb-2 w-full p-2 bg-gray-700" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="mb-2 w-full p-2 bg-gray-700" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="mb-2 w-full p-2 bg-gray-700" />
      <select name="role" value={form.role} onChange={handleChange} className="mb-4 w-full p-2 bg-gray-700">
        <option value="student">Student</option>
        <option value="mentor">Mentor</option>
      </select>
      <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Register</button>
    </form>
  );
};

export default SignUp;
