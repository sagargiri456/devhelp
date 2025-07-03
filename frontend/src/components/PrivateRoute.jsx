// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // 1. Not logged in: Always redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Normalize user role for robust comparison
  const normalizedUserRole = user.role ? user.role.trim().toLowerCase() : null;
  const normalizedAllowedRoles = allowedRoles ? allowedRoles.map(role => role.trim().toLowerCase()) : [];

  // 2. If allowedRoles are specified and user's role is not included:
  if (allowedRoles && !normalizedAllowedRoles.includes(normalizedUserRole)) {
    // Custom redirection based on the user's actual role
    if (normalizedUserRole === "mentor") {
      // If a mentor tries to access a non-mentor route, redirect to mentor dashboard
      return <Navigate to="/mentor" replace />;
    }
    if (normalizedUserRole === "student") {
      // If a student tries to access a non-student route (e.g., /mentor), redirect to student dashboard
      return <Navigate to="/doubts" replace />;
    }

    // Fallback: If no specific redirect rule applies, go to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. User is logged in and their role is allowed for this route: Grant access
  return children;
};

export default PrivateRoute;