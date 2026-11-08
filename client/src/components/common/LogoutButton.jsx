import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const LogoutButton = ({ className = "" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
     const data = await logout();
     console.log(data)
    } finally {
      navigate("/login", { replace: true });
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 ${className}`}
    >
      <LogOut size={18} />
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
