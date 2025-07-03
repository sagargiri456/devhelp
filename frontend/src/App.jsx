// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doubts from "./pages/Doubts";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Unauthorized from "./pages/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import MentorDashboard from "./pages/MentorDashboard";
import { AuthProvider } from "./context/AuthContext"; 
import DoubtDetail from "./components/doubtDetails";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <AuthProvider> 
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            {/* PrivateRoute components will use useAuth() here */}
            <Route
              path="/doubts"
              element={
                <PrivateRoute allowedRoles={["student"]}>
                  <Doubts />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentor"
              element={
                <PrivateRoute allowedRoles={["mentor"]}>
                  <MentorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doubts/:doubtId"
              element={
                <PrivateRoute allowedRoles={["mentor", "student"]}>
                  <DoubtDetail />
                </PrivateRoute>
              }
            />
           
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </div>
      </AuthProvider> 
    </Router>
  );
};

export default App;