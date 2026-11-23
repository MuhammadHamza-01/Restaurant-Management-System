
import { useState } from "react";
import { Outlet } from "react-router-dom";

import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DashboardSidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
        <DashboardNavbar setIsOpen={setIsOpen} />

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
