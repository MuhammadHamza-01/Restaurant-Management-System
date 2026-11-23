
import { useCallback, useEffect, useMemo, useState } from "react";
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
  TrendingUp,
  Utensils,
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
          "Unable to load dashboard information. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const today = new Date().toDateString();

  const todaysOrders = useMemo(
    () =>
      orders.filter(
        (order) => new Date(order.createdAt).toDateString() === today
      ),
    [orders, today]
  );

  const activeOrders = useMemo(
    () =>
      orders.filter((order) =>
        ACTIVE_STATUSES.includes(order.orderStatus)
      ),
    [orders]
  );

  const occupiedTableIds = useMemo(
    () =>
      new Set(
        activeOrders
          .map((order) => order.table?._id || order.table)
          .filter(Boolean)
          .map(String)
      ),
    [activeOrders]
  );

  const readyOrders = useMemo(
    () => orders.filter((order) => order.orderStatus === "ready"),
    [orders]
  );

  const servedToday = useMemo(
    () =>
      todaysOrders.filter((order) =>
        ["served", "completed"].includes(order.orderStatus)
      ),
    [todaysOrders]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 6),
    [orders]
  );

  const stats = [
    {
      label: "Today's Orders",
      value: todaysOrders.length,
      description: "Orders received today",
      icon: ShoppingCart,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Occupied Tables",
      value: occupiedTableIds.size,
      description: `Out of ${tables.length} total tables`,
      icon: Table2,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Ready Orders",
      value: readyOrders.length,
      description: "Waiting to be served",
      icon: ChefHat,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Served Today",
      value: servedToday.length,
      description: "Served or completed",
      icon: CheckCircle2,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-orange-500"
            size={30}
          />
          <p className="mt-3 text-sm text-gray-500">
            Loading staff dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Dashboard data unavailable</p>
            <p className="mt-1">{error}</p>

            <button
              onClick={() => fetchDashboardData(true)}
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
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>

                <span className="text-xs font-medium text-gray-400">
                  Today
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


      {/* Restaurant activity */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <Utensils size={21} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {activeOrders.length}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Orders currently in the service process.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Table2 size={21} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Tables</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {Math.max(tables.length - occupiedTableIds.size, 0)}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Tables without an active order.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <TrendingUp size={21} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Served Today</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {servedToday.length}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Successfully served or completed orders.
          </p>
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
                  <tr
                    key={order._id}
                    className="transition hover:bg-gray-50"
                  >
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
