import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;

    case "staff":
      return <Navigate to="/staff/dashboard" replace />;

    case "customer":
      return <Navigate to="/customer/dashboard" replace />;

    case "delivery":
      return <Navigate to="/delivery/dashboard" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;
