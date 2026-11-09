
import { Menu, Bell, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

const pageTitles = {
  "/staff/dashboard": "Dashboard",
  "/staff/pos": "Point of Sale",
  "/staff/orders": "Ready Orders",
};

const StaffNavbar = ({ setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const pageTitle =
    pageTitles[location.pathname] || "Staff Workspace";

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "S";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {pageTitle}
          </h2>

          <p className="hidden text-xs text-gray-500 sm:block">
            Manage your restaurant operations
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-orange-500"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* User Information */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-3 sm:pl-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
            {initials}
          </div>

          <div className="hidden sm:block">
            <p className="max-w-32 truncate text-sm font-semibold text-gray-900">
              {user?.name || "Staff Member"}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {user?.role || "Staff"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          type="button"
          title="Logout"
          aria-label="Logout"
          className="rounded-xl p-2.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
};

export default StaffNavbar;
