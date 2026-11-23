
import { Menu, Bell, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dashboardNavigation, roleLabels } from "./dashboardNavigation";

const DashboardNavbar = ({ setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = dashboardNavigation[user?.role] || [];

  const pageTitles = {
   [`/${user.role}/dashboard`]: "Dashboard",
   [`/${user.role}/staff`]: "Staff",
   [`/${user.role}/categories`]: "Categories",
   [`/${user.role}/menu-items`]: "Menu",
   [`/${user.role}/tables`]: "Table ",
   [`/${user.role}/pos`]: "Point of Sale",
   [`/${user.role}/billing`]: "Billing & Payments",
   [`/${user.role}/kitchen`]: "Kitchen Display",
   [`/${user.role}/orders`]: "Ready Orders",
   [`/${user.role}/settings`]: "Settings",
  };

  const pageDesc = {
    [`/${user.role}/dashboard`]: "Welcome to Pizza Mahal Management",
    [`/${user.role}/staff`]: "Manage your restaurant employees and their accounts.",
    [`/${user.role}/categories`]: "Manage your restaurant categories and subcategories.",
    [`/${user.role}/menu-items`]: "Manage your restaurant food items and prices.",
    [`/${user.role}/tables`]: "Manage your restaurant tables and their availability.",
    [`/${user.role}/pos`]: "Select a table, add menu items, and create a dine-in order.",
    [`/${user.role}/billing`]: "Manage customer bills and receive payments",
    [`/${user.role}/kitchen`]: "Manage incoming restaurant orders",
    [`/${user.role}/orders`]: "View and manage ready orders",
    [`/${user.role}/settings`]: "Settings",
  };

  
   


  const currentPage = pageTitles[location.pathname] || "Admin Panel";
  const currentPageDesc = pageDesc[location.pathname] || "Manage your restaurant.";

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate md:text-lg font-bold text-gray-900">
            {currentPage}
          </h2>
          <p className="hidden text-xs text-gray-500 md:block">
            {currentPageDesc}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-orange-500"
        >
          <Bell size={20} />
        </button> */}

        <div className="flex items-center gap-3  pl-3 sm:pl-4">
          <div className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
            {initials}
          </div>

          <div className="hidden sm:block">
            <p className="max-w-36 truncate text-sm font-semibold text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {roleLabels[user?.role] || "User"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="rounded-xl cursor-pointer px-4 py-2.5 text-white transition bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
         <LogOut class="inline" size={19} /> <span class="text-sm md:text-md">Logout</span> 
        </button>
      </div>
    </header>
  );
};

export default DashboardNavbar;
