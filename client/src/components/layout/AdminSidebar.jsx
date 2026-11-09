import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Table2,
  Settings,
  ChefHat,
  FolderOpen,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Staff Management",
    path: "/admin/staff",
    icon: Users,
  },
  {
  name: "Categories",
  path: "/admin/categories",
  icon: FolderOpen,
  },
  {
    name: "Menu Management",
    path: "/admin/menu-items",
    icon: UtensilsCrossed,
  },
  {
    name: "Table Management",
    path: "/admin/tables",
    icon: Table2,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
        bg-[#18181b] text-white transition-transform duration-300
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
              <ChefHat size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold">Pizza Mahal</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-5">
          <p className="text-xs text-gray-500">Pizza Mahal Management System</p>
          <p className="mt-1 text-xs text-gray-600">Admin Dashboard</p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
