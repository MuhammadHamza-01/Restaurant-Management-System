import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LogoutButton from "./components/common/LogoutButton.jsx";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import StaffManagement from "./pages/admin/StaffManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import MenuItemManagement from "./pages/admin/MenuItemManagement";
import TableManagement from "./pages/admin/TableManagement.jsx";

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
        </Route>
      </Route>

      {/* Kitchen */}
      <Route element={<ProtectedRoute allowedRoles={["chef"]} />}>
        <Route path="/kitchen" element={<KitchenDashboard />} />
      </Route>

      {/* POS */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
        <Route path="/pos" element={<POSDashboard />} />
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
