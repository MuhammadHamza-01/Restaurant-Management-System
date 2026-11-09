
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  UtensilsCrossed,
  LoaderCircle,
  ImageIcon,
} from "lucide-react";

import api from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  image: "",
};

const MenuItemManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState(initialForm);

  // Fetch menu items and categories
  const fetchData = async () => {
    try {
      setLoading(true);

      const [itemsResponse, categoriesResponse] = await Promise.all([
        api.get("/menu-items"),
        api.get("/categories"),
      ]);

      setMenuItems(itemsResponse.data.menuItems);
      setCategories(categoriesResponse.data.categories);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch menu data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open add modal
  const openAddModal = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditingItem(item);

    setFormData({
      name: item.name,
      description: item.description || "",
      category: item.category?._id || "",
      price: String(item.price),
      image: item.image || "",
    });

    setError("");
    setShowModal(true);
  };

  // Create or update menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      if (editingItem) {
        const response = await api.patch(
          `/menu-items/${editingItem._id}`,
          {
            ...payload,
            isAvailable: editingItem.isAvailable,
          }
        );

        setMenuItems((prev) =>
          prev.map((item) =>
            item._id === editingItem._id
              ? response.data.menuItem
              : item
          )
        );

        setSuccess(response.data.message);
      } else {
        const response = await api.post("/menu-items", payload);

        setMenuItems((prev) => [
          response.data.menuItem,
          ...prev,
        ]);

        setSuccess(response.data.message);
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save menu item."
      );
    } finally {
      setSaving(false);
    }
  };

  // Toggle item availability
  const handleAvailability = async (item) => {
    try {
      const response = await api.patch(
        `/menu-items/${item._id}/availability`,
        {
          isAvailable: !item.isAvailable,
        }
      );

      setMenuItems((prev) =>
        prev.map((menuItem) =>
          menuItem._id === item._id
            ? response.data.menuItem
            : menuItem
        )
      );

      setSuccess(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update item availability."
      );
    }
  };

  // Delete menu item
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/menu-items/${id}`);

      setMenuItems((prev) =>
        prev.filter((item) => item._id !== id)
      );

      setSuccess(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete menu item."
      );
    }
  };

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        item.category?._id === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.isAvailable) ||
        (availabilityFilter === "unavailable" && !item.isAvailable);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );
    });
  }, [menuItems, search, categoryFilter, availabilityFilter]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Menu Items
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant food items and prices.
          </p>
        </div>

        <button
          onClick={openAddModal}
          disabled={categories.filter((c) => c.isActive).length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} />
          Add Menu Item
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && !showModal && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Items</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {menuItems.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Available Items</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {menuItems.filter((item) => item.isAvailable).length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Unavailable Items</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-600">
            {menuItems.filter((item) => !item.isAvailable).length}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

        </div>
      </div>

      {/* Menu Items Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            All Menu Items ({filteredItems.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoaderCircle
              className="animate-spin text-orange-600"
              size={28}
            />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <UtensilsCrossed
              className="mx-auto mb-3 text-gray-400"
              size={40}
            />
            <p className="font-medium text-gray-700">
              No menu items found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or add a new item.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Menu Item</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Availability</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-orange-50">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon
                                size={20}
                                className="text-orange-400"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="max-w-xs truncate text-xs text-gray-500">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.category?.name || "Unknown"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(item.price)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.isAvailable
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit item"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleAvailability(item)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
                        >
                          {item.isAvailable ? "Disable" : "Enable"}
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          title="Delete item"
                          className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">

          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? "Edit Menu Item" : "Add Menu Item"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter food item information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Chicken Tikka Pizza"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((category) => category.isActive)
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price (PKR)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="e.g. 1200"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the food item..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/food.jpg"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingItem
                      ? "Save Changes"
                      : "Create Item"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuItemManagement;
