
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  ClipboardList,
  CheckCircle2,
  Clock3,
  ShoppingCart,
  AlertCircle,
  ArrowLeft,
  Utensils,
} from "lucide-react";

import api from "../../services/api";

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

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchReadyOrders = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setRefreshing(true);

      setError("");

      const response = await api.get("/orders");
      const allOrders = response.data.orders || [];

      setOrders(
        allOrders
          .filter((order) => order.orderStatus === "ready")
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          )
      );
    } catch (err) {
      console.error("Ready orders error:", err);
      setError(
        err.response?.data?.message || "Unable to load ready orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReadyOrders();

    const interval = setInterval(() => {
      fetchReadyOrders();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchReadyOrders]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-orange-500"
          />
          <p className="mt-3 text-sm text-gray-500">
            Loading ready orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ready Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View orders prepared by the kitchen and ready for serving.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchReadyOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <ClipboardList size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Ready Orders</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {orders.length}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <Clock3 size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Oldest Ready Order</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              {orders.length > 0
                ? formatTime(orders[0].createdAt)
                : "No ready orders"}
            </h2>
          </div>
        </div>
      </section>

      {/* Orders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Kitchen Handover
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              These orders have been marked ready by the chef.
            </p>
          </div>

          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
            {orders.length} Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <Utensils size={29} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No ready orders
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              Kitchen-ready orders will appear here automatically.
            </p>

            <Link
              to="/staff/pos"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <ShoppingCart size={16} />
              Create an Order
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Card heading */}
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.orderNumber || "Order"}
                      </h3>

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={13} />
                        Ready
                      </span>
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock3 size={14} />
                      {formatTime(order.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 px-4 py-2 text-right">
                    <p className="text-xs font-medium text-orange-600">
                      Table
                    </p>
                    <p className="text-xl font-bold text-orange-700">
                      {order.table?.tableNumber || "—"}
                    </p>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-3 p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Order Items
                  </h4>

                  {order.items?.length > 0 ? (
                    order.items.map((item, index) => (
                      <div
                        key={item._id || `${order._id}-${index}`}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
                            {item.quantity}x
                          </span>

                          <span className="truncate text-sm font-medium text-gray-800">
                            {item.name ||
                              item.menuItem?.name ||
                              "Menu Item"}
                          </span>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-gray-700">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No item details available.
                    </p>
                  )}
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mx-5 mb-4 rounded-xl bg-amber-50 p-3">
                    <p className="text-xs font-bold uppercase text-amber-700">
                      Order Notes
                    </p>
                    <p className="mt-1 text-sm text-amber-800">
                      {order.notes}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-col justify-between gap-4 border-t border-gray-100 bg-gray-50/70 p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs text-gray-500">Order Total</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
                    <p className="text-sm font-semibold text-emerald-700">
                      Ready for serving
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      Awaiting customer payment
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <ArrowLeft size={14} />
        Orders refresh automatically every 15 seconds.
      </div>
    </div>
  );
};

export default StaffOrders;
