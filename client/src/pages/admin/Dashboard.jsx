
import {
  Users,
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ChefHat,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "Rs. 45,250",
    change: "+12.5%",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Total Orders",
    value: "128",
    change: "+8.2%",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Active Staff",
    value: "12",
    change: "Currently active",
    icon: Users,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Menu Items",
    value: "35",
    change: "Available items",
    icon: UtensilsCrossed,
    color: "bg-purple-100 text-purple-600",
  },
];

const recentOrders = [
  { id: "#ORD-001", table: "Table 01", items: 3, total: "Rs. 2,450", status: "Completed" },
  { id: "#ORD-002", table: "Table 04", items: 2, total: "Rs. 1,800", status: "Preparing" },
  { id: "#ORD-003", table: "Table 07", items: 4, total: "Rs. 3,200", status: "Pending" },
  { id: "#ORD-004", table: "Table 02", items: 1, total: "Rs. 950", status: "Completed" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">

      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening at Pizza Mahal today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs">
                <TrendingUp size={15} className="text-green-600" />
                <span className="font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Recent Orders
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Latest restaurant orders
              </p>
            </div>
            <ShoppingBag className="text-orange-500" size={22} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Table</th>
                  <th className="pb-4 font-medium">Items</th>
                  <th className="pb-4 font-medium">Total</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 font-semibold text-gray-800">
                      {order.id}
                    </td>
                    <td className="py-4 text-gray-600">{order.table}</td>
                    <td className="py-4 text-gray-600">{order.items}</td>
                    <td className="py-4 font-medium text-gray-800">
                      {order.total}
                    </td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Preparing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restaurant Summary */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800">
            Restaurant Overview
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Today's restaurant activity
          </p>

          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CheckCircle size={21} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Orders</p>
                <h4 className="text-xl font-bold text-gray-800">86</h4>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Clock size={21} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <h4 className="text-xl font-bold text-gray-800">12</h4>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <ChefHat size={21} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kitchen Activity</p>
                <h4 className="text-xl font-bold text-gray-800">Active</h4>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
