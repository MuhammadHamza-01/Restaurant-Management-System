import { Menu, Bell, UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const AdminNavbar = ({ setIsOpen }) => {
  const location = useLocation();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/staff": "Staff Management",
    "/admin/menu": "Menu Management",
    "/admin/tables": "Table Management",
    "/admin/settings": "Settings",
  };

  const currentPage = pageTitles[location.pathname] || "Admin Panel";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-800">
            {currentPage}
          </h1>

          <p className="hidden text-xs text-gray-500 sm:block">
            Welcome to Pizza Mahal Management
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <UserCircle size={34} className="text-gray-500" />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Administrator
            </p>

            <p className="text-xs text-gray-500">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
