
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ClipboardList,
  Table2,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Clock3,
  ChefHat,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const ACTIVE_STATUSES = ["pending", "preparing", "ready", "served"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const formatTime = (date) => {
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
    pending: "bg-amber-50 text-amber-700",
    preparing: "bg-blue-50 text-blue-700",
    ready: "bg-emerald-50 text-emerald-700",
    served: "bg-purple-50 text-purple-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setError("");

      const [ordersResponse, tablesResponse] = await Promise.all([
        api.get("/orders"),
        api.get("/tables"),
      ]);

      setOrders(ordersResponse.data.orders || []);
      setTables(tablesResponse.data.tables || []);
    } catch (err) {
      console.error("Staff dashboard error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const today = new Date().toDateString();

  const todaysOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === today
  );

  const activeOrders = orders.filter((order) =>
    ACTIVE_STATUSES.includes(order.orderStatus)
  );

  const occupiedTableIds = new Set(
    activeOrders
      .map((order) => order.table?._id || order.table)
      .filter(Boolean)
      .map(String)
  );

  const readyOrders = orders.filter(
    (order) => order.orderStatus === "ready"
  );

  const servedToday = todaysOrders.filter((order) =>
    ["served", "completed"].includes(order.orderStatus)
  );

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  const stats = [
    {
      label: "Today's Orders",
      value: todaysOrders.length,
      icon: ShoppingCart,
      color: "bg-orange-50 text-orange-600",
      description: "Orders received today",
    },
    {
      label: "Occupied Tables",
      value: occupiedTableIds.size,
      icon: Table2,
      color: "bg-blue-50 text-blue-600",
      description: `Out of ${tables.length} tables`,
    },
    {
      label: "Ready Orders",
      value: readyOrders.length,
      icon: ChefHat,
      color: "bg-emerald-50 text-emerald-600",
      description: "Waiting to be served",
    },
    {
      label: "Served Today",
      value: servedToday.length,
      icon: CheckCircle2,
      color: "bg-purple-50 text-purple-600",
      description: "Served or completed",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-orange-500" size={30} />
          <p className="mt-3 text-sm text-gray-500">
            Loading staff dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
       

        <button
          type="button"
          onClick={fetchDashboardData}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Dashboard data unavailable</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs font-medium text-gray-400">
                  Live data
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {stat.label}
              </p>
              <h3 className="mt-1 text-3xl font-bold text-gray-900">
                {stat.value}
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Jump directly to your daily tasks.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/staff/pos"
            className="group flex items-center justify-between rounded-2xl bg-[#18181b] p-5 text-white transition hover:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-500 p-3">
                <ShoppingCart size={23} />
              </div>
              <div>
                <h3 className="font-bold">Create New Order</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Open POS and take a table order
                </p>
              </div>
            </div>
            <ArrowRight
              size={20}
              className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-orange-400"
            />
          </Link>

          <Link
            to="/staff/orders"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-200 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ClipboardList size={23} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Ready Orders</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and serve completed kitchen orders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                {readyOrders.length}
              </span>
              <ArrowRight
                size={20}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-orange-500"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* Recent orders */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest orders across the restaurant.
            </p>
          </div>

          <Link
            to="/staff/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            View ready orders <ArrowRight size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ClipboardList
              size={35}
              className="mx-auto text-gray-300"
            />
            <p className="mt-3 font-semibold text-gray-700">
              No orders yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              New orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Order</th>
                  <th className="px-5 py-4 font-semibold">Table</th>
                  <th className="px-5 py-4 font-semibold">Created By</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900">
                        {order.orderNumber || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {order.table?.tableNumber
                        ? `Table ${order.table.tableNumber}`
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {order.createdBy?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus || "unknown"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock3 size={14} />
                        {formatTime(order.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StaffDashboard;
