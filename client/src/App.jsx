import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LogoutButton from "./components/common/LogoutButton.jsx";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import StaffManagement from "./pages/admin/StaffManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import MenuItemManagement from "./pages/admin/MenuItemManagement";
import TableManagement from "./pages/admin/TableManagement.jsx";
import POS from "./pages/admin/POS.jsx";
import KitchenDisplay from "./pages/admin/KitchenDisplay.jsx";
import Billing from "./pages/admin/Billing.jsx";
import StaffOrders from "./pages/staff/StaffOrders.jsx";
import StaffPOS from "./pages/staff/StaffPOS.jsx";
import StaffLayout from "./pages/staff/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardRedirect from "./routes/DashboardRedirect";

// Temporary dashboard placeholders
const Menu = () => (
  <h1>
    Customer Menu <LogoutButton className="w-full justify-start" />
  </h1>
);

const KitchenDashboard = () => <h1>Kitchen Dashboard</h1>;
const POSDashboard = () => <h1>POS Dashboard</h1>;
const DeliveryDashboard = () => <h1>Delivery Dashboard</h1>;

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Role-based home redirect */}
      <Route path="/" element={<DashboardRedirect />} />

      {/* Customer */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route path="/menu" element={<Menu />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="menu-items" element={<MenuItemManagement />} />
          <Route path="tables" element={<TableManagement />} />
          <Route path="pos" element={<POS />} />
          <Route path="billing" element={<Billing />} />
          <Route path="kitchen" element={<KitchenDisplay />} />
        </Route>
      </Route>

      {/* Kitchen */}
      <Route element={<ProtectedRoute allowedRoles={["chef"]} />}>
        <Route path="/chef/kitchen" element={<KitchenDisplay />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="pos" element={<StaffPOS />} />
          <Route path="orders" element={<StaffOrders />} />
        </Route>
      </Route>

      {/* Delivery */}
      <Route element={<ProtectedRoute allowedRoles={["delivery"]} />}>
        <Route path="/delivery" element={<DeliveryDashboard />} />
      </Route>

      {/* Not found */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
