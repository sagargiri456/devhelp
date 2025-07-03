import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      if (res.data.role === "student") {
        navigate("/mentor");
      } else {
        navigate("/doubts");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="mb-2 w-full p-2 bg-gray-700" />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="mb-4 w-full p-2 bg-gray-700" />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Login</button>

        {/* --- CORRECTED LINE BELOW --- */}
        <h2>
          Not Registered! Create an account.{" "}
          <Link to="/signup"> {/* Use Link component here */}
            <span>SignUp</span>
          </Link>
        </h2>
      </form>
    </div>
  );
};

export default SignIn;