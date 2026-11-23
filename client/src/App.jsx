import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import StaffManagement from "./pages/admin/StaffManagement.jsx";
import CategoryManagement from "./pages/admin/CategoryManagement.jsx";
import MenuItemManagement from "./pages/admin/MenuItemManagement.jsx";
import TableManagement from "./pages/admin/TableManagement.jsx";
import POS from "./pages/admin/POS.jsx";
import KitchenDisplay from "./pages/admin/KitchenDisplay.jsx";
import Billing from "./pages/admin/Billing.jsx";

import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import StaffPOS from "./pages/staff/StaffPOS.jsx";
import StaffOrders from "./pages/staff/StaffOrders.jsx";

import ChefDashboard from "./pages/chef/ChefDashboard.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import DashboardRedirect from "./routes/DashboardRedirect.jsx";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Redirect users according to their role */}
      <Route path="/" element={<DashboardRedirect />} />

      {/* ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="menu-items" element={<MenuItemManagement />} />
          <Route path="tables" element={<TableManagement />} />
          <Route path="pos" element={<POS />} />
          <Route path="kitchen" element={<KitchenDisplay />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Route>

      {/* WAITER */}
      <Route element={<ProtectedRoute allowedRoles={["waiter"]} />}>
        <Route path="/waiter" element={<DashboardLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="pos" element={<StaffPOS />} />
          <Route path="orders" element={<StaffOrders />} />
        </Route>
      </Route>

      {/* CHEF */}
      <Route element={<ProtectedRoute allowedRoles={["chef"]} />}>
        <Route path="/chef" element={<DashboardLayout />}>
          <Route path="dashboard" element={<ChefDashboard />} />
          <Route path="kitchen" element={<KitchenDisplay />} />
        </Route>
      </Route>

      {/* CASHIER */}
      <Route element={<ProtectedRoute allowedRoles={["cashier"]} />}>
        <Route path="/cashier" element={<DashboardLayout />}>
          <Route path="billing" element={<Billing />} />
        </Route>
      </Route>

      {/* Not found */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;