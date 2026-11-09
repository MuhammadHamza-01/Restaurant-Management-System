
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Armchair,
  UtensilsCrossed,
  LoaderCircle,
  X,
  CheckCircle,
} from "lucide-react";

import api from "../../services/api";

const POS = () => {
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch tables, categories, and menu items
  const fetchPOSData = async () => {
    try {
      setLoading(true);

      const [tableRes, categoryRes, menuRes, orderRes] =
        await Promise.all([
          api.get("/tables"),
          api.get("/categories"),
          api.get("/menu-items"),
          api.get("/orders"),
        ]);

      const activeOrders = orderRes.data.orders.filter((order) =>
        ["pending", "preparing", "ready", "served"].includes(
          order.orderStatus
        )
      );

      const occupiedTableIds = activeOrders.map((order) =>
        typeof order.table === "object"
          ? order.table._id
          : order.table
      );

      setTables(
        tableRes.data.tables
          .filter((table) => table.isActive)
          .map((table) => ({
            ...table,
            isOccupied: occupiedTableIds.includes(table._id),
          }))
      );

      setCategories(
        categoryRes.data.categories.filter(
          (category) => category.isActive
        )
      );

      setMenuItems(
        menuRes.data.menuItems.filter(
          (item) => item.isAvailable && item.category?.isActive !== false
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load POS data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOSData();
  }, []);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category?._id === selectedCategory;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, search]);

  // Add item to cart
  const addToCart = (item) => {
    setError("");
    setMessage("");

    setCart((currentCart) => {
      const existing = currentCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existing) {
        return currentCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  // Change item quantity
  const updateQuantity = (itemId, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === itemId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== itemId)
    );
  };

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(price);

  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedTable) {
      setError("Please select a table first.");
      return;
    }

    if (cart.length === 0) {
      setError("Please add at least one menu item.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");
      setMessage("");

      const response = await api.post("/orders", {
        table: selectedTable._id,
        items: cart.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
      });

      setMessage(
        `Order ${response.data.order.orderNumber} created successfully!`
      );

      setCart([]);
      setSelectedTable(null);

      await fetchPOSData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to place order."
      );

      await fetchPOSData();
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-gray-500">
        <LoaderCircle className="animate-spin" size={22} />
        Loading POS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Point of Sale
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a table, add menu items, and create a dine-in order.
        </p>
      </div>

      {/* Notifications */}
      {message && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle size={18} />
          {message}
          <button
            onClick={() => setMessage("")}
            className="ml-auto"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-auto"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Table Selection */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Select a Table
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose an available table for this order.
            </p>
          </div>

          <Armchair className="text-orange-600" size={23} />
        </div>

        {tables.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
            No active tables available. Please create tables first.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {tables.map((table) => (
              <button
                key={table._id}
                disabled={table.isOccupied}
                onClick={() => setSelectedTable(table)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedTable?._id === table._id
                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                    : table.isOccupied
                    ? "cursor-not-allowed border-red-100 bg-red-50 opacity-60"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                <Armchair
                  size={22}
                  className={
                    table.isOccupied
                      ? "text-red-500"
                      : "text-orange-600"
                  }
                />

                <p className="mt-3 font-bold text-gray-900">
                  {table.tableNumber}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {table.capacity} Seats
                </p>

                <p
                  className={`mt-2 text-xs font-semibold ${
                    table.isOccupied
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {table.isOccupied ? "Occupied" : "Available"}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Menu Section */}
        <section className="space-y-5 xl:col-span-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                selectedCategory === "all"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-600 hover:bg-orange-50"
              }`}
            >
              All Items
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  selectedCategory === category._id
                    ? "bg-orange-600 text-white"
                    : "bg-white text-gray-600 hover:bg-orange-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
              <UtensilsCrossed
                size={36}
                className="mx-auto text-gray-300"
              />
              <p className="mt-3 font-medium text-gray-700">
                No menu items found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <button
                  key={item._id}
                  onClick={() => addToCart(item)}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
                >
                  <div className="flex h-36 items-center justify-center bg-orange-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UtensilsCrossed
                        size={38}
                        className="text-orange-300"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <p className="font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.category?.name}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-orange-600">
                        {formatPrice(item.price)}
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <Plus size={17} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Cart Section */}
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white shadow-sm xl:sticky xl:top-6">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="font-bold text-gray-900">
                Current Order
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {cart.length} different item(s)
              </p>
            </div>

            <ShoppingCart className="text-orange-600" size={22} />
          </div>

          <div className="border-b border-gray-100 p-5">
            <p className="text-xs font-medium uppercase text-gray-400">
              Selected Table
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {selectedTable
                ? `${selectedTable.tableNumber} (${selectedTable.capacity} Seats)`
                : "No table selected"}
            </p>
          </div>

          <div className="max-h-[400px] space-y-4 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingCart
                  size={34}
                  className="mx-auto text-gray-300"
                />
                <p className="mt-3 text-sm font-medium text-gray-600">
                  Your cart is empty
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Select menu items to add them.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatPrice(item.price)} each
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="rounded-md border border-gray-200 p-1 text-gray-600 hover:bg-gray-50"
                      >
                        <Minus size={13} />
                      </button>

                      <span className="min-w-5 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="rounded-md border border-gray-200 p-1 text-gray-600 hover:bg-gray-50"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="mt-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 border-t border-gray-100 p-5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between border-t border-gray-100 pt-3">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-orange-600">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || cart.length === 0 || !selectedTable}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Place Order
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default POS;
