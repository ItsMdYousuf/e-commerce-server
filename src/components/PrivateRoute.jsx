// components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return null; // Already handled in App

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
