import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const dashboards = {
    admin: "/admin/dashboard",
    chef: "/kitchen",
    staff: "/pos",
    delivery: "/delivery",
    customer: "/menu",
  };

  return <Navigate to={dashboards[user.role] || "/login"} replace />;
};

export default DashboardRedirect;
