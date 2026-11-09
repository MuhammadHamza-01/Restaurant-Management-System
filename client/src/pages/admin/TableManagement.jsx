
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Armchair,
  Users,
  X,
  LoaderCircle,
} from "lucide-react";

import api from "../../services/api";

const initialForm = {
  tableNumber: "",
  capacity: "",
};

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  // Fetch tables from the backend
  const fetchTables = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/tables");
      setTables(data.tables || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tables.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Open modal for adding a table
  const openAddModal = () => {
    setEditingTable(null);
    setForm(initialForm);
    setError("");
    setModalOpen(true);
  };

  // Open modal for editing a table
  const openEditModal = (table) => {
    setEditingTable(table);
    setForm({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
    });
    setError("");
    setModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create or update table
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.tableNumber.trim() || !form.capacity) {
      setError("Please fill in all fields.");
      return;
    }

    if (!Number.isInteger(Number(form.capacity)) || Number(form.capacity) < 1) {
      setError("Capacity must be a positive whole number.");
      return;
    }

    try {
      setSaving(true);

      if (editingTable) {
        await api.patch(`/tables/${editingTable._id}`, {
          tableNumber: form.tableNumber.trim(),
          capacity: Number(form.capacity),
        });
      } else {
        await api.post("/tables", {
          tableNumber: form.tableNumber.trim(),
          capacity: Number(form.capacity),
        });
      }

      setModalOpen(false);
      setForm(initialForm);
      setEditingTable(null);

      await fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save table.");
    } finally {
      setSaving(false);
    }
  };

  // Activate or deactivate table
  const handleStatusChange = async (table) => {
    try {
      await api.patch(`/tables/${table._id}/status`, {
        isActive: !table.isActive,
      });

      await fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update table status.");
    }
  };

  // Delete table
  const handleDelete = async (table) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete table ${table.tableNumber}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tables/${table._id}`);
      await fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete table.");
    }
  };

  // Search tables
  const filteredTables = tables.filter((table) =>
    table.tableNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalTables = tables.length;
  const activeTables = tables.filter((table) => table.isActive).length;
  const inactiveTables = totalTables - activeTables;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Table Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage restaurant tables and seating capacity.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          <Plus size={18} />
          Add Table
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Tables"
          value={totalTables}
          icon={Armchair}
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          title="Active Tables"
          value={activeTables}
          icon={CheckCircle}
          color="bg-green-50 text-green-600"
        />

        <StatCard
          title="Inactive Tables"
          value={inactiveTables}
          icon={XCircle}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by table number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Restaurant Tables</h2>
          <p className="mt-1 text-sm text-gray-500">
            {filteredTables.length} table(s) found
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <LoaderCircle className="animate-spin" size={20} />
            Loading tables...
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="py-16 text-center">
            <Armchair className="mx-auto text-gray-300" size={40} />
            <p className="mt-3 font-medium text-gray-700">
              No tables found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add your first restaurant table to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Table</th>
                  <th className="px-5 py-4 font-semibold">Capacity</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTables.map((table) => (
                  <tr key={table._id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          <Armchair size={19} />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {table.tableNumber}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        {table.capacity} Seats
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          table.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {table.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(table.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(table)}
                          title="Edit table"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleStatusChange(table)}
                          title={table.isActive ? "Deactivate" : "Activate"}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                        >
                          {table.isActive ? (
                            <XCircle size={17} />
                          ) : (
                            <CheckCircle size={17} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(table)}
                          title="Delete table"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
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
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingTable ? "Edit Table" : "Add New Table"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the table details below.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Table Number
                </label>
                <input
                  type="text"
                  name="tableNumber"
                  value={form.tableNumber}
                  onChange={handleChange}
                  placeholder="e.g. T-01"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  step="1"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {editingTable ? "Save Changes" : "Create Table"}
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
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
      </div>

      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

export default TableManagement;
