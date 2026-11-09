import { useEffect, useState } from "react";
import api from "../../services/api";
import { Clock, CheckCircle, RefreshCw, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await api.get("/orders");
      setOrders(
        (response.data.orders || []).filter(
          (order) => order.orderStatus === "ready",
        ),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load ready orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsServed = async (orderId) => {
    try {
      setUpdatingId(orderId);

      await api.patch(`/orders/${orderId}/serve`);

      await fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark order as served");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ready Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Orders waiting to be served to customers
          </p>
        </div>
        <Link
          to="/staff/pos"
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          Back to POS
        </Link>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Utensils size={40} className="mx-auto mb-3 text-gray-300" />
          <h2 className="font-semibold text-gray-700">
            No orders waiting to be served
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Ready kitchen orders will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">
                    {order.orderNumber}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Table {order.table?.tableNumber || "N/A"}
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Ready
                </span>
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                <Clock size={14} />
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div className="mb-4 space-y-3 border-y border-gray-100 py-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="text-gray-700">{item.name}</span>
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

              <button
                onClick={() => markAsServed(order._id)}
                disabled={updatingId === order._id}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
              >
                <CheckCircle size={17} />
                {updatingId === order._id ? "Updating..." : "Mark as Served"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffOrders;
