
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ChefHat,
  RefreshCw,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    preparing: "bg-blue-100 text-blue-700",
    ready: "bg-emerald-100 text-emerald-700",
    served: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

const extractArray = (response, keys) => {
  for (const key of keys) {
    if (Array.isArray(response?.data?.[key])) {
      return response.data[key];
    }
  }

  return [];
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const results = await Promise.allSettled([
        api.get("/orders"),
        api.get("/admin/staff"),
        api.get("/menu-items"),
      ]);

      const [ordersResult, staffResult, menuResult] = results;

      const failedRequests = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedRequests.length === results.length) {
        throw failedRequests[0].reason;
      }

      if (ordersResult.status === "fulfilled") {
        setOrders(
          extractArray(ordersResult.value, ["orders"])
        );
      }

      if (staffResult.status === "fulfilled") {
        setStaff(
          extractArray(staffResult.value, ["staff", "users"])
        );
      }

      if (menuResult.status === "fulfilled") {
        setMenuItems(
          extractArray(menuResult.value, ["menuItems", "items"])
        );
      }

      if (failedRequests.length > 0) {
        setError(
          "Some dashboard information could not be loaded. Check your API permissions and try refreshing."
        );
      }
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Today's date
  const today = new Date().toDateString();

  const todaysOrders = orders.filter(
    (order) =>
      order.createdAt &&
      new Date(order.createdAt).toDateString() === today
  );

  // Revenue is calculated from actual payments received.
  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.paidAmount || 0),
    0
  );

  const totalOrders = orders.length;

  const activeStaff = staff.filter(
    (member) => member.isActive === true
  ).length;

  const availableMenuItems = menuItems.filter(
    (item) => item.isAvailable === true
  ).length;

  const completedOrders = todaysOrders.filter(
    (order) => order.orderStatus === "completed"
  ).length;

  const pendingOrders = todaysOrders.filter(
    (order) =>
      ["pending", "preparing"].includes(order.orderStatus)
  ).length;

  const kitchenOrders = todaysOrders.filter(
    (order) =>
      ["pending", "preparing", "ready"].includes(order.orderStatus)
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Payments collected",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      description: "All restaurant orders",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active Staff",
      value: activeStaff,
      description: "Currently active accounts",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Available Menu Items",
      value: availableMenuItems,
      description: "Currently available items",
      icon: UtensilsCrossed,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-orange-500"
          />
          <p className="mt-3 text-sm text-gray-500">
            Loading restaurant dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

    
      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Dashboard data warning</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs">
                <TrendingUp size={15} className="text-green-600" />
                <span className="font-medium text-gray-500">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Sections */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Recent Orders
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Latest restaurant orders
              </p>
            </div>

            <ShoppingBag className="text-orange-500" size={22} />
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag
                size={35}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 font-semibold text-gray-700">
                No orders found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Orders will appear here when customers place them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="pb-4 font-medium">Order ID</th>
                    <th className="pb-4 font-medium">Table</th>
                    <th className="pb-4 font-medium">Items</th>
                    <th className="pb-4 font-medium">Total</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4 font-semibold text-gray-800">
                        {order.orderNumber || "—"}
                      </td>

                      <td className="py-4 text-gray-600">
                        {order.table?.tableNumber
                          ? `Table ${order.table.tableNumber}`
                          : "—"}
                      </td>

                      <td className="py-4 text-gray-600">
                        {order.items?.reduce(
                          (sum, item) =>
                            sum + Number(item.quantity || 0),
                          0
                        ) || 0}
                      </td>

                      <td className="py-4 font-medium text-gray-800">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-5 border-t border-gray-100 pt-4">
            <Link
              to="/admin/billing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              View billing <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Restaurant Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800">
            Restaurant Overview
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Today's restaurant activity
          </p>

          <div className="mt-6 space-y-6">

            {/* Completed */}
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CheckCircle size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Completed Orders
                </p>

                <h4 className="text-xl font-bold text-gray-800">
                  {completedOrders}
                </h4>
              </div>
            </div>

            {/* Pending */}
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Clock size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Pending / Preparing
                </p>

                <h4 className="text-xl font-bold text-gray-800">
                  {pendingOrders}
                </h4>
              </div>
            </div>

            {/* Kitchen */}
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <ChefHat size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Active Kitchen Orders
                </p>

                <h4 className="text-xl font-bold text-gray-800">
                  {kitchenOrders}
                </h4>
              </div>
            </div>
          </div>

          <Link
            to="/admin/kitchen"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#18181b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Open Kitchen Display
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Last updated information */}
      <p className="text-right text-xs text-gray-400">
        Data is refreshed when you open the dashboard or click Refresh Data.
      </p>
    </div>
  );
};

export default Dashboard;
