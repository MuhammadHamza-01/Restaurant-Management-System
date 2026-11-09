
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Receipt,
  Search,
  CreditCard,
  Banknote,
  RefreshCw,
} from "lucide-react";

const Billing = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [payments, setPayments] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatPrice = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const selectOrder = async (order) => {
    setSelectedOrder(order);
    setDiscount(order.discount || 0);
    setServiceCharge(order.serviceCharge || 0);
    setPaymentAmount("");
    setPayments([]);

    try {
      const response = await api.get(
        `/billing/orders/${order._id}/payments`
      );

      setPayments(response.data.payments || []);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    }
  };

  const updateBill = async () => {
    try {
      setSaving(true);

      const response = await api.patch(
        `/billing/orders/${selectedOrder._id}`,
        {
          discount: Number(discount),
          serviceCharge: Number(serviceCharge),
        }
      );

      setSelectedOrder(response.data.order);
      await fetchOrders();

      alert("Bill updated successfully");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update bill"
      );
    } finally {
      setSaving(false);
    }
  };

  const receivePayment = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      return alert("Enter a valid payment amount");
    }

    try {
      setSaving(true);

      await api.post(
        `/billing/orders/${selectedOrder._id}/payments`,
        {
          amount: Number(paymentAmount),
          method: paymentMethod,
        }
      );

      setPaymentAmount("");

      await fetchOrders();

      const updatedOrder = await api.get("/orders");
      const order = updatedOrder.data.orders.find(
        (item) => item._id === selectedOrder._id
      );

      if (order) {
        await selectOrder(order);
      }

      alert("Payment received successfully");
    } catch (error) {
      alert(
        error.response?.data?.message || "Payment failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      ["served", "completed"].includes(order.orderStatus) &&
      order.paymentStatus !== "paid" &&
      (
        order.orderNumber?.toLowerCase().includes(query) ||
        order.table?.tableNumber?.toLowerCase().includes(query)
      )
    );
  });

  const subtotal = selectedOrder?.subtotal || 0;
  const finalTotal =
    subtotal - Number(discount || 0) + Number(serviceCharge || 0);

  const paidAmount = selectedOrder?.paidAmount || 0;
  const remainingBalance = finalTotal - paidAmount;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">
          Billing & Payments
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage customer bills and receive payments
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Orders list */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-1">
          <h2 className="mb-4 font-semibold text-gray-900">
            Unpaid Orders
          </h2>

          <div className="relative mb-4">
            <Search
              size={17}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or table..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
            />
          </div>

          {loading ? (
            <p className="py-6 text-center text-gray-400">
              Loading orders...
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              No unpaid orders available
            </p>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <button
                  key={order._id}
                  onClick={() => selectOrder(order)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    selectedOrder?._id === order._id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-sm font-bold text-orange-600">
                      {formatPrice(
                        order.total - (order.paidAmount || 0)
                      )}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Table {order.table?.tableNumber}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {order.paymentStatus === "partial"
                      ? "Partially paid"
                      : "Unpaid"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bill details */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2">
          {!selectedOrder ? (
            <div className="flex min-h-96 flex-col items-center justify-center text-gray-400">
              <Receipt size={45} className="mb-3" />
              <p>Select an order to manage its bill</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Table {selectedOrder.table?.tableNumber}
                  </p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              {/* Order items */}
              <div className="mb-6 space-y-3 border-b border-gray-100 pb-5">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill adjustments */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    disabled={paidAmount > 0}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:border-orange-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Service Charge (PKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                    disabled={paidAmount > 0}
                    className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:border-orange-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {paidAmount === 0 && (
                <button
                  onClick={updateBill}
                  disabled={saving}
                  className="mb-6 rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                >
                  Save Bill Adjustments
                </button>
              )}

              {/* Bill summary */}
              <div className="mb-6 rounded-xl bg-gray-50 p-5">
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>Discount</span>
                  <span>- {formatPrice(discount)}</span>
                </div>

                <div className="mb-3 flex justify-between text-sm text-gray-600">
                  <span>Service Charge</span>
                  <span>{formatPrice(serviceCharge)}</span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                <div className="mt-3 flex justify-between text-sm text-green-700">
                  <span>Paid</span>
                  <span>{formatPrice(paidAmount)}</span>
                </div>

                <div className="mt-2 flex justify-between font-bold text-orange-600">
                  <span>Remaining</span>
                  <span>{formatPrice(remainingBalance)}</span>
                </div>
              </div>

              {/* Payment form */}
              {remainingBalance > 0 && (
                <div className="mb-7">
                  <h3 className="mb-4 font-semibold text-gray-900">
                    Receive Payment
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Payment Amount
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={remainingBalance}
                        value={paymentAmount}
                        onChange={(e) =>
                          setPaymentAmount(e.target.value)
                        }
                        placeholder="Enter amount"
                        className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 p-3 outline-none focus:border-orange-500"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="bank_transfer">
                          Bank Transfer
                        </option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={receivePayment}
                    disabled={saving}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <CreditCard size={18} />
                    {saving ? "Processing..." : "Receive Payment"}
                  </button>
                </div>
              )}

              {/* Payment history */}
              <div>
                <h3 className="mb-4 font-semibold text-gray-900">
                  Payment History
                </h3>

                {payments.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No payments recorded yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment._id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Banknote
                            size={20}
                            className="text-green-600"
                          />
                          <div>
                            <p className="text-sm font-semibold capitalize text-gray-900">
                              {payment.method.replace("_", " ")}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(
                                payment.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold text-green-700">
                          {formatPrice(payment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
