
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChefHat,
  Clock3,
  ClipboardList,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  Flame,
  Timer,
} from "lucide-react";

import api from "../../services/api";

const formatTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatElapsedTime = (date) => {
  if (!date) return "—";

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 60000)
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes
    ? `${hours}h ${remainingMinutes}m ago`
    : `${hours}h ago`;
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  preparing: "bg-blue-50 text-blue-700",
  ready: "bg-emerald-50 text-emerald-700",
};

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchKitchenData = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/kitchen/orders");
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Chef dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load kitchen information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchKitchenData();

    const interval = setInterval(() => {
      fetchKitchenData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchKitchenData]);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.orderStatus === "pending"),
    [orders]
  );

  const preparingOrders = useMemo(
    () => orders.filter((order) => order.orderStatus === "preparing"),
    [orders]
  );

  const readyOrders = useMemo(
    () => orders.filter((order) => order.orderStatus === "ready"),
    [orders]
  );

  const oldestOrder = useMemo(() => {
    if (!orders.length) return null;

    return [...orders].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    )[0];
  }, [orders]);

  const stats = [
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      description: "Waiting to be prepared",
      icon: ClipboardList,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Preparing",
      value: preparingOrders.length,
      description: "Currently in the kitchen",
      icon: Flame,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Ready Orders",
      value: readyOrders.length,
      description: "Waiting for staff pickup",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
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
            Loading kitchen dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Kitchen data unavailable</p>
            <p className="mt-1">{error}</p>

            <button
              onClick={() => fetchKitchenData(true)}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      

      {/* Kitchen order list */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Current Kitchen Orders
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Orders currently waiting for preparation or pickup.
            </p>
          </div>

          <Link
            to="/chef/kitchen"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            Manage orders <ArrowRight size={16} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ChefHat size={36} className="mx-auto text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">
              No active kitchen orders
            </p>
            <p className="mt-1 text-sm text-gray-500">
              New orders will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Order</th>
                  <th className="px-5 py-4 font-semibold">Table</th>
                  <th className="px-5 py-4 font-semibold">Items</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Received</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {[...orders]
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .slice(0, 8)
                  .map((order) => (
                    <tr
                      key={order._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        {order.orderNumber || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {order.table?.tableNumber
                          ? `Table ${order.table.tableNumber}`
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {order.items?.reduce(
                          (total, item) =>
                            total + Number(item.quantity || 0),
                          0
                        ) || 0}{" "}
                        items
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            statusStyles[order.orderStatus] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {formatTime(order.createdAt)}
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

export default ChefDashboard;
