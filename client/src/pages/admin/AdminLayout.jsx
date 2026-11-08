
import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from  "../../components/layout/AdminSidebar.jsx";
import AdminNavbar from "../../components/layout/AdminNavbar.jsx";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Navbar */}
        <AdminNavbar setIsOpen={setIsOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
