import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, FolderOpen, LoaderCircle } from "lucide-react";

import api from "../../services/api";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await api.get("/categories");
      setCategories(response.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for creating a category
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setError("");
    setShowModal(true);
  };

  // Open modal for editing a category
  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });

    setError("");
    setShowModal(true);
  };

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);

      if (editingCategory) {
        const response = await api.patch(`/categories/${editingCategory._id}`, {
          ...formData,
          isActive: editingCategory.isActive,
        });

        setCategories((prev) =>
          prev.map((category) =>
            category._id === editingCategory._id
              ? response.data.category
              : category,
          ),
        );

        setSuccess(response.data.message);
      } else {

        const response = await api.post("/categories", formData);
        setCategories((prev) => [response.data.category, ...prev]);

        setSuccess(response.data.message);
      }

      setShowModal(false);
      setEditingCategory(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  // Activate or deactivate category
  const handleStatusChange = async (category) => {
    try {
      const response = await api.patch(`/categories/${category._id}`, {
        name: category.name,
        description: category.description,
        image: category.image,
        isActive: !category.isActive,
      });

      setCategories((prev) =>
        prev.map((item) =>
          item._id === category._id ? response.data.category : item,
        ),
      );

      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update category.");
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/categories/${id}`);

      setCategories((prev) => prev.filter((category) => category._id !== id));

      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your restaurant menu into categories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          <Plus size={18} />
          Add Category
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

      {/* Category Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Categories</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {categories.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Active Categories</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {categories.filter((item) => item.isActive).length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Inactive Categories</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-600">
            {categories.filter((item) => !item.isActive).length}
          </h2>
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">All Categories</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoaderCircle className="animate-spin text-orange-600" size={28} />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">
            <FolderOpen className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="font-medium text-gray-700">No categories found</p>
            <p className="mt-1 text-sm text-gray-500">
              Add your first menu category to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Description</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-orange-50">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FolderOpen className="text-orange-600" size={20} />
                          )}
                        </div>

                        <span className="font-semibold text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="max-w-xs px-5 py-4 text-gray-500">
                      {category.description || "No description"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          category.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          title="Edit category"
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleStatusChange(category)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100"
                        >
                          {category.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => handleDelete(category._id)}
                          title="Delete category"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your category information.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                Γ£ò
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Pizzas"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Short category description"
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
                  placeholder="https://example.com/image.jpg"
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
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
