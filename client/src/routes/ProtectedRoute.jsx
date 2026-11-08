import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait until authentication check finishes
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
