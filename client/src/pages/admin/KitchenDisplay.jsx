
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import {
  Clock,
  ChefHat,
  CheckCircle,
  RefreshCw,
  Utensils,
  AlertCircle,
} from "lucide-react";

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      }

      const response = await api.get("/kitchen/orders");
      setOrders(response.data.orders || []);
      setError("");
    } catch (error) {
      console.error("Failed to fetch kitchen orders:", error);
      setError(
        error.response?.data?.message || "Failed to load kitchen orders"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const markAsReady = async (orderId) => {
    try {
      setUpdatingId(orderId);

      await api.patch(`/kitchen/orders/${orderId}/status`, {
        orderStatus: "ready",
      });

      await fetchOrders(true);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to mark order as ready"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending"
  );

  // Keep older preparing orders visible until they are marked ready.
  const readyOrders = orders.filter(
    (order) => order.orderStatus === "ready"
  );

  const legacyPreparingOrders = orders.filter(
    (order) => order.orderStatus === "preparing"
  );

  const OrderCard = ({ order, isReady = false }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900">
            {order.orderNumber}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Table {order.table?.tableNumber || "N/A"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Waiter: {order.createdBy?.name || "Staff"}
          </p>
        </div>

        <div className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-500">
          <Clock size={14} />
          {formatTime(order.createdAt)}
        </div>
      </div>

      <div className="mb-4 space-y-3 border-y border-gray-100 py-3">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between gap-3 text-sm"
          >
            <span className="font-medium text-gray-700">
              {item.name}
            </span>

            <span className="font-bold text-gray-900">
              × {item.quantity}
            </span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <strong>Special Instructions:</strong>
          <p className="mt-1">{order.notes}</p>
        </div>
      )}

      {isReady ? (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          <CheckCircle size={17} />
          Ready for serving
        </div>
      ) : (
        <button
          disabled={updatingId === order._id}
          onClick={() => markAsReady(order._id)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updatingId === order._id ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <CheckCircle size={17} />
              Mark as Ready
            </>
          )}
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center text-gray-500">
        Loading kitchen orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kitchen Display
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View new orders and mark completed food preparation as ready.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-orange-800">
              New Orders
            </p>
            <Utensils className="text-orange-600" size={20} />
          </div>
          <p className="mt-2 text-3xl font-bold text-orange-700">
            {pendingOrders.length + legacyPreparingOrders.length}
          </p>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-green-800">
              Ready Orders
            </p>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {readyOrders.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* New Orders */}
        <section className="min-w-0 rounded-xl bg-gray-50">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-orange-100 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                <ChefHat size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  New Orders
                </h2>
                <p className="text-xs text-gray-500">
                  Prepare these orders
                </p>
              </div>
            </div>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
              {pendingOrders.length + legacyPreparingOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {pendingOrders.length === 0 &&
            legacyPreparingOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
                No new orders
              </div>
            ) : (
              [...pendingOrders, ...legacyPreparingOrders]
                .sort(
                  (a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                )
                .map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
            )}
          </div>
        </section>

        {/* Ready Orders */}
        <section className="min-w-0 rounded-xl bg-gray-50">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-green-100 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 text-green-600">
                <CheckCircle size={20} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Ready Orders
                </h2>
                <p className="text-xs text-gray-500">
                  Waiting to be served
                </p>
              </div>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-400">
                No ready orders
              </div>
            ) : (
              readyOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isReady
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default KitchenDisplay;
