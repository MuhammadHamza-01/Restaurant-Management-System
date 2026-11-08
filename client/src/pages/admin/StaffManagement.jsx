import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  UserPlus,
  RefreshCw,
  Mail,
  Edit,
  ShieldCheck,
  ShieldOff,
  LoaderCircle,
} from "lucide-react";

import api from "../../services/api.js";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [formError, setFormError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "staff",
  });

  const [editError, setEditError] = useState("");

  // Fetch staff members
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/staff");

      setStaff(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load staff members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Search and filter staff
  const filteredStaff = useMemo(() => {
    return staff.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, search, roleFilter, statusFilter]);

  // Update account status
  const handleStatusChange = async (user) => {
    try {
      setUpdatingId(user._id);
      setError("");
      setSuccess("");

      const response = await api.patch(`/admin/staff/${user._id}/status`, {
        isActive: !user.isActive,
      });

      setStaff((prev) =>
        prev.map((item) => (item._id === user._id ? response.data.user : item)),
      );

      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update staff status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    setFormError("");

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post("/admin/staff", formData);

      setSuccess(response.data.message);
      setShowAddModal(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "staff",
      });

      await fetchStaff();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Unable to create staff account.",
      );
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (user) => {
    setEditingStaff(user);

    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setEditError("");
    setShowEditModal(true);
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    setEditError("");

    try {
      setUpdating(true);

      const response = await api.patch(
        `/admin/staff/${editingStaff._id}`,
        editFormData,
      );

      setStaff((prev) =>
        prev.map((user) =>
          user._id === editingStaff._id ? response.data.user : user,
        ),
      );

      setSuccess(response.data.message);
      setShowEditModal(false);
      setEditingStaff(null);
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Unable to update staff information.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const activeCount = staff.filter((user) => user.isActive).length;
  const inactiveCount = staff.length - activeCount;

  const roleColors = {
    staff: "bg-blue-50 text-blue-700",
    chef: "bg-orange-50 text-orange-700",
    delivery: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant employees and their accounts.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError("");
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
        >
          <UserPlus size={18} />
          Add Staff
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Staff"
          value={staff.length}
          icon={Users}
          color="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Active Accounts"
          value={activeCount}
          icon={ShieldCheck}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Inactive Accounts"
          value={inactiveCount}
          icon={ShieldOff}
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Staff Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Filters */}
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            >
              <option value="all">All Roles</option>
              <option value="staff">Staff</option>
              <option value="chef">Chef</option>
              <option value="delivery">Delivery</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={fetchStaff}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <LoaderCircle
                      className="mx-auto animate-spin text-orange-500"
                      size={28}
                    />
                    <p className="mt-3 text-gray-500">
                      Loading staff members...
                    </p>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <Users size={35} className="mx-auto text-gray-300" />
                    <p className="mt-3 font-medium text-gray-700">
                      No staff members found
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-50">
                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {user.name}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <Mail size={13} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                          roleColors[user.role] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "ΓÇö"}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(user)}
                          disabled={updatingId === user._id}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                            user.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {updatingId === user._id
                            ? "Updating..."
                            : user.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Edit size={15} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {!loading && (
          <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
            Showing {filteredStaff.length} of {staff.length} staff members
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Add New Staff
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create a new restaurant employee account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
              >
                Γ£ò
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddStaff} className="space-y-5 p-6">
              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={50}
                  placeholder="Enter employee name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  placeholder="employee@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Password must contain at least 8 characters.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Employee Role
                </label>

                <select
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                >
                  <option value="staff">Staff</option>
                  <option value="chef">Chef</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={creating}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Edit Staff Member
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Update staff account information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEditModal(false)}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          Γ£ò
        </button>
      </div>

      <form onSubmit={handleEditStaff} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={50}
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                name: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            required
            value={editFormData.email}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                email: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Staff Role
          </label>
          <select
            value={editFormData.role}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                role: e.target.value,
              })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          >
            <option value="staff">Staff</option>
            <option value="chef">Chef</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        {editError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {editError}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button> 

          <button
            type="submit"
            disabled={updating}
            className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

// Reusable statistics card
const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-800">{value}</h3>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
