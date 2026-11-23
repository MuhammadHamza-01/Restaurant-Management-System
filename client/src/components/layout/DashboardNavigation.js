import {
  LayoutDashboard,
  Users,
  Tags,
  Utensils,
  Table2,
  ShoppingCart,
  Receipt,
  ChefHat,
  ClipboardList,
} from "lucide-react";

export const dashboardNavigation = {
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Staff", path: "/admin/staff", icon: Users },
    { label: "Categories", path: "/admin/categories", icon: Tags },
    { label: "Menu", path: "/admin/menu-items", icon: Utensils },
    { label: "Tables", path: "/admin/tables", icon: Table2 },
    { label: "Point of Sale", path: "/admin/pos", icon: ShoppingCart },
    { label: "Billing & Payments", path: "/admin/billing", icon: Receipt },
    { label: "Kitchen Display", path: "/admin/kitchen", icon: ChefHat },
  ],

  waiter: [
    { label: "Dashboard", path: "/waiter/dashboard", icon: LayoutDashboard },
    { label: "Point of Sale", path: "/waiter/pos", icon: ShoppingCart },
    { label: "Ready Orders", path: "/waiter/orders", icon: ClipboardList },
  ],

  chef: [
    { label: "Dashboard", path: "/chef/dashboard", icon: LayoutDashboard },
    { label: "Kitchen Display", path: "/chef/kitchen", icon: ChefHat },
  ],

  cashier: [
    { label: "Billing & Payments", path: "/cashier/billing", icon: Receipt },
  ],
};

export const roleLabels = {
  admin: "Administrator",
  waiter: "Waiter",
  chef: "Kitchen Staff",
  cashier: "Cashier",
};