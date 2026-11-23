import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;

    case "waiter":
      return <Navigate to="/waiter/dashboard" replace />;

    case "chef":
      return <Navigate to="/chef/dashboard" replace />;

    case "cashier":
      return <Navigate to="/cashier/billing" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;