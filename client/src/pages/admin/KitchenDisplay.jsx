
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Clock,
  ChefHat,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const statuses = [
  { key: "pending", label: "New Orders", color: "amber" },
  { key: "preparing", label: "Preparing", color: "blue" },
  { key: "ready", label: "Ready", color: "green" },
];

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/kitchen/orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch kitchen orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 15000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, orderStatus) => {
    try {
      setUpdatingId(orderId);

      await api.patch(`/kitchen/orders/${orderId}/status`, {
        orderStatus,
      });

      await fetchOrders();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextAction = (status) => {
    if (status === "pending") {
      return {
        label: "Start Preparing",
        next: "preparing",
      };
    }

    if (status === "preparing") {
      return {
        label: "Mark as Ready",
        next: "ready",
      };
    }

    return null;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading kitchen orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kitchen Display
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage incoming restaurant orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {statuses.map((status) => {
          const filteredOrders = orders.filter(
            (order) => order.orderStatus === status.key
          );

          return (
            <div
              key={status.key}
              className="min-w-0 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  {status.label}
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                  {filteredOrders.length}
                </span>
              </div>

              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
                    No orders here
                  </p>
                ) : (
                  filteredOrders.map((order) => {
                    const action = getNextAction(order.orderStatus);

                    return (
                      <div
                        key={order._id}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {order.orderNumber}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                              Table {order.table?.tableNumber}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={14} />
                            {formatTime(order.createdAt)}
                          </div>
                        </div>

                        <div className="mb-4 space-y-2 border-y border-gray-100 py-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between gap-3 text-sm"
                            >
                              <span className="text-gray-700">
                                {item.name}
                              </span>

                              <span className="font-semibold text-gray-900">
                                × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}

                        {action ? (
                          <button
                            disabled={updatingId === order._id}
                            onClick={() =>
                              updateStatus(order._id, action.next)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                          >
                            {updatingId === order._id
                              ? "Updating..."
                              : action.label}
                            <ChefHat size={16} />
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                            <CheckCircle size={16} />
                            Ready for serving
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenDisplay;
