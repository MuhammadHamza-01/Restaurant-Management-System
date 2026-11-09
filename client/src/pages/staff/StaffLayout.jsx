
import { useState } from "react";
import { Outlet } from "react-router-dom";

import StaffSidebar from "../../components/layout/staff/StaffSidebar";
import StaffNavbar from "../../components/layout/staff/StaffNavbar";

const StaffLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <StaffSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Navbar */}
        <StaffNavbar setIsOpen={setIsOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StaffLayout;
