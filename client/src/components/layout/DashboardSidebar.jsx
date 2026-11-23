
import { NavLink } from "react-router-dom";
import { X, Pizza } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { dashboardNavigation, roleLabels } from "./dashboardNavigation";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const role = user?.role;
  const navigation = dashboardNavigation[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#18181b] text-white transition-transform duration-300 lg:fixed lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
              <Pizza size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-wide">
                Pizza Mahal
              </h1>
              <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                Management System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        

        {/* Navigation */}
        <nav className="hide-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {/* <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
            Navigation
          </p> */}

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        {/* <div className="border-t border-white/10 px-6 py-5">
          <p className="text-xs font-semibold text-gray-300">
            Pizza Mahal
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Restaurant Management System
          </p>
        </div> */}
      </aside>
    </>
  );
};

export default DashboardSidebar;
