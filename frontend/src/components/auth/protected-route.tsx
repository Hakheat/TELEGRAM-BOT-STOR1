import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute: React.FC = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const hasCookie = typeof document !== "undefined" && document.cookie.includes("access_token=");

  if (!token && !hasCookie) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
