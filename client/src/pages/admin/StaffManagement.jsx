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
  X,
} from "lucide-react";

import api from "../../services/api.js";

const STAFF_ROLES = [
  { value: "waiter", label: "Waiter" },
  { value: "chef", label: "Chef" },
  { value: "cashier", label: "Cashier" },
];

const roleColors = {
  waiter: "bg-blue-50 text-blue-700",
  chef: "bg-orange-50 text-orange-700",
  cashier: "bg-purple-50 text-purple-700",
};

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "waiter",
};

const initialEditFormData = {
  name: "",
  email: "",
  role: "waiter",
};

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
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState(initialEditFormData);
  const [editError, setEditError] = useState("");

  // Fetch staff members
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/staff");

      setStaff(response.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load staff members."
      );
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
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, search, roleFilter, statusFilter]);

  // Add staff member
  const handleAddStaff = async (e) => {
    e.preventDefault();

    setFormError("");
    setError("");
    setSuccess("");

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post("/admin/staff", formData);

      setSuccess(response.data.message);
      setShowAddModal(false);
      setFormData(initialFormData);

      await fetchStaff();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Unable to create staff account."
      );
    } finally {
      setCreating(false);
    }
  };

  // Open edit modal
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

  // Update staff member
  const handleEditStaff = async (e) => {
    e.preventDefault();

    setEditError("");
    setError("");
    setSuccess("");

    if (!editingStaff) return;

    try {
      setUpdating(true);

      const response = await api.patch(
        `/admin/staff/${editingStaff._id}`,
        editFormData
      );

      setStaff((prev) =>
        prev.map((user) =>
          user._id === editingStaff._id
            ? { ...user, ...response.data.user }
            : user
        )
      );

      setSuccess(response.data.message);
      setShowEditModal(false);
      setEditingStaff(null);
      setEditFormData(initialEditFormData);
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Unable to update staff information."
      );
    } finally {
      setUpdating(false);
    }
  };

  // Activate or deactivate staff
  const handleStatusChange = async (user) => {
    try {
      setUpdatingId(user._id);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/admin/staff/${user._id}/status`,
        {
          isActive: !user.isActive,
        }
      );

      setStaff((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? { ...item, ...response.data.user }
            : item
        )
      );

      setSuccess(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update staff status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Statistics
  const activeCount = staff.filter((user) => user.isActive).length;
  const inactiveCount = staff.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Staff Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your restaurant employees and their access.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData(initialFormData);
            setFormError("");
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
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
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
          <button onClick={() => setSuccess("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {/* Staff Table */}
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
              {STAFF_ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
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
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 text-right font-semibold">
                  Actions
                </th>
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
                  <tr
                    key={user._id}
                    className="transition hover:bg-gray-50"
                  >
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
                          roleColors[user.role] ||
                          "bg-gray-100 text-gray-700"
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
                            user.isActive
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
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

        {/* Footer */}
        {!loading && (
          <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-500">
            Showing {filteredStaff.length} of {staff.length} staff members
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <Modal
          title="Add New Staff"
          description="Create a new restaurant employee account."
          onClose={() => setShowAddModal(false)}
        >
          <form onSubmit={handleAddStaff} className="space-y-5">
            {formError && <FormError message={formError} />}

            <FormField label="Full Name">
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
                className={inputClass}
              />
            </FormField>

            <FormField label="Email Address">
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
                className={inputClass}
              />
            </FormField>

            <FormField label="Password">
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className={inputClass}
              />

              <p className="mt-1 text-xs text-gray-400">
                Password must contain at least 8 characters.
              </p>
            </FormField>

            <FormField label="Employee Role">
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
                className={inputClass}
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </FormField>

            <ModalActions
              onCancel={() => setShowAddModal(false)}
              loading={creating}
              submitLabel="Create Account"
            />
          </form>
        </Modal>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && editingStaff && (
        <Modal
          title="Edit Staff Member"
          description="Update staff account information."
          onClose={() => {
            setShowEditModal(false);
            setEditingStaff(null);
          }}
        >
          <form onSubmit={handleEditStaff} className="space-y-5">
            {editError && <FormError message={editError} />}

            <FormField label="Full Name">
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
                className={inputClass}
              />
            </FormField>

            <FormField label="Email Address">
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
                className={inputClass}
              />
            </FormField>

            <FormField label="Staff Role">
              <select
                required
                value={editFormData.role}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    role: e.target.value,
                  })
                }
                className={inputClass}
              >
                {STAFF_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </FormField>

            <ModalActions
              onCancel={() => {
                setShowEditModal(false);
                setEditingStaff(null);
              }}
              loading={updating}
              submitLabel="Save Changes"
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

// Shared input styling
const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

// Reusable statistics card
const StatCard = ({ title, value, icon: Icon, color }) => (
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

// Reusable modal
const Modal = ({ title, description, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6">{children}</div>
    </div>
  </div>
);

// Reusable form field
const FormField = ({ label, children }) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-700">
      {label}
    </label>
    {children}
  </div>
);

// Reusable form error
const FormError = ({ message }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
    {message}
  </div>
);

// Reusable modal actions
const ModalActions = ({
  onCancel,
  loading,
  submitLabel,
}) => (
  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
    <button
      type="button"
      onClick={onCancel}
      disabled={loading}
      className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
    >
      Cancel
    </button>

    <button
      type="submit"
      disabled={loading}
      className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
    >
      {loading ? "Please wait..." : submitLabel}
    </button>
  </div>
);

export default StaffManagement;